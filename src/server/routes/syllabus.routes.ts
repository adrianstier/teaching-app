import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { SyllabusAnalyzerAgent } from '../../agents/syllabus-analyzer-agent';
import { DocumentParser } from '../../services/document-parser';
import sessionStore from '../../services/session-store';
import logger from '../../utils/logger';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'syllabus');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not supported. Allowed: ${allowedTypes.join(', ')}`));
    }
  }
});

// Parse uploaded syllabus file to extract text
router.post(
  '/:sessionId/parse-file',
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    try {
      logger.info(`Parsing syllabus file: ${req.file.originalname}`);

      const parser = new DocumentParser();
      const parsedDoc = await parser.parseFile(req.file.path);

      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(err => {
        logger.warn(`Failed to delete uploaded file: ${err.message}`);
      });

      res.json({
        success: true,
        content: parsedDoc.text,
        metadata: parsedDoc.metadata
      });

    } catch (error) {
      logger.error('Syllabus file parsing failed', error);

      // Clean up on error
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      res.status(500).json({
        success: false,
        error: 'Failed to parse syllabus file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Analyze syllabus
router.post(
  '/:sessionId/analyze',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { syllabusContent } = req.body;

    try {
      // Auto-create session if it doesn't exist
      let session = sessionStore.getSession(sessionId);
      if (!session) {
        logger.info(`Creating new session for syllabus analysis: ${sessionId}`);
        session = await sessionStore.createSession({
          title: 'Syllabus Analysis',
          topic: 'Course Planning',
          duration: 60,
          level: 'intermediate',
          goals: ['Analyze syllabus for improvements']
        });
        // Update session ID to match the one from the frontend
        (session as any).id = sessionId;
        await sessionStore.updateSession(sessionId, session);
      }

      logger.info(`Analyzing syllabus for session ${sessionId}`);

      const agent = new SyllabusAnalyzerAgent(session.context);
      const analysis = await agent.execute(syllabusContent);

      // Store in session
      session.context.syllabusAnalysis = analysis;
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: analysis,
        message: `Syllabus analyzed. Score: ${analysis.overallScore}/100`
      });

    } catch (error) {
      logger.error('Syllabus analysis failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze syllabus',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Generate optimized syllabus
router.post(
  '/:sessionId/optimize',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const analysis = session.context.syllabusAnalysis;
      if (!analysis) {
        return res.status(400).json({
          success: false,
          error: 'No syllabus analysis found. Please analyze first.'
        });
      }

      const agent = new SyllabusAnalyzerAgent(session.context);
      const optimized = await agent.generateOptimizedSyllabus(analysis);

      res.json({
        success: true,
        data: optimized,
        message: 'Optimized syllabus generated'
      });

    } catch (error) {
      logger.error('Syllabus optimization failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to optimize syllabus',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Suggest scaffolding activities
router.post(
  '/:sessionId/scaffolding',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { concept } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const analysis = session.context.syllabusAnalysis;
      if (!analysis) {
        return res.status(400).json({
          success: false,
          error: 'No syllabus analysis found'
        });
      }

      const agent = new SyllabusAnalyzerAgent(session.context);
      const activities = await agent.suggestScaffoldingActivities(
        analysis.conceptMap,
        concept
      );

      res.json({
        success: true,
        data: activities
      });

    } catch (error) {
      logger.error('Scaffolding suggestion failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to suggest activities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get syllabus analysis
router.get('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = sessionStore.getSession(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    data: session.context.syllabusAnalysis || null
  });
});

export default router;