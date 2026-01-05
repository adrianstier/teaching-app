import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs/promises';
import { DocumentParser } from '../../services/document-parser';
import { ContextExtractorAgent } from '../../agents/context-extractor-agent';
import sessionStore from '../../services/session-store';
import logger from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
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
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt', '.md', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not supported. Allowed: ${allowedTypes.join(', ')}`));
    }
  }
});

// Upload and analyze document
router.post(
  '/analyze',
  upload.single('document'),
  async (req: Request, res: Response) => {
    const timer = logger.startTimer('document-analysis');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { sessionId } = req.body;

    try {
      logger.info(`Analyzing uploaded document: ${req.file.originalname}`);

      // Parse the document
      const parser = new DocumentParser();
      const parsedDoc = await parser.parseFile(req.file.path);

      // Extract intake hints
      const hints = await parser.extractIntakeHints(parsedDoc);

      // If sessionId provided, use Context Extractor Agent
      let extractedContext = null;
      let suggestedIntake = null;

      if (sessionId) {
        const session = sessionStore.getSession(sessionId);
        if (session) {
          const extractor = new ContextExtractorAgent(session.context);
          extractedContext = await extractor.execute(parsedDoc.text, req.file.mimetype);

          // Generate suggested intake values
          suggestedIntake = {
            title: extractedContext.suggestedTitle || hints.possibleTitle,
            topic: extractedContext.suggestedTopic,
            duration: extractedContext.suggestedDuration || hints.estimatedDuration,
            prerequisites: extractedContext.suggestedPrerequisites,
            mainGoals: extractedContext.suggestedGoals || hints.possibleObjectives,
            keyTopics: extractedContext.keyTopics || hints.possibleTopics
          };

          // Store context in session for agents to use
          session.context.uploadedDocument = {
            fileName: req.file.originalname,
            parsedContent: parsedDoc,
            extractedContext,
            suggestedIntake,
            uploadedAt: new Date()
          };

          await sessionStore.updateSession(sessionId, session);

          logger.info(`Document context saved to session ${sessionId}`);
        }
      }

      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(err => {
        logger.warn(`Failed to delete uploaded file: ${err.message}`);
      });

      res.json({
        success: true,
        message: 'Document analyzed successfully',
        data: {
          fileName: req.file.originalname,
          fileType: path.extname(req.file.originalname),
          metadata: parsedDoc.metadata,
          hints,
          suggestedIntake,
          extractedContext: extractedContext ? {
            confidence: extractedContext.confidence,
            keyTopics: extractedContext.keyTopics,
            existingStructure: extractedContext.existingStructure?.length
          } : null
        }
      });

    } catch (error) {
      logger.error('Document analysis failed', error);

      // Clean up on error
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      res.status(500).json({
        success: false,
        error: 'Failed to analyze document',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      timer();
    }
  }
);

// Get document analysis for session
router.get('/:sessionId/document', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = sessionStore.getSession(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  const uploadedDoc = (session.context as any).uploadedDocument;

  if (!uploadedDoc) {
    return res.status(404).json({
      success: false,
      error: 'No document uploaded for this session'
    });
  }

  res.json({
    success: true,
    document: {
      fileName: uploadedDoc.fileName,
      uploadedAt: uploadedDoc.uploadedAt,
      suggestedIntake: uploadedDoc.suggestedIntake,
      keyTopics: uploadedDoc.extractedContext?.keyTopics,
      confidence: uploadedDoc.extractedContext?.confidence
    }
  });
});

// Delete uploaded document context
router.delete('/:sessionId/document', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = sessionStore.getSession(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  delete (session.context as any).uploadedDocument;
  await sessionStore.updateSession(sessionId, session);

  res.json({
    success: true,
    message: 'Document context removed from session'
  });
});

export default router;