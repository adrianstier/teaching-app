import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import lectureRoutes from './routes/lecture.routes';
import agentRoutes from './routes/agent.routes';
import exportRoutes from './routes/export.routes';
import uploadRoutes from './routes/upload.routes';
import exerciseRoutes from './routes/exercise.routes';
import learningOutcomesRoutes from './routes/learning-outcomes.routes';
import syllabusRoutes from './routes/syllabus.routes';
import multiRepresentationRoutes from './routes/multi-representation.routes';
import activeLearningRoutes from './routes/active-learning.routes';
import pedagogicalRoutes from './routes/pedagogical.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use('/api', limiter);

// Static files for exports
app.use('/exports', express.static(path.join(__dirname, '../../output')));

// API Routes
app.use('/api/lectures', lectureRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/learning-outcomes', learningOutcomesRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/multi-representation', multiRepresentationRoutes);
app.use('/api/active-learning', activeLearningRoutes);
app.use('/api/pedagogical', pedagogicalRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// WebSocket connections for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-session', (sessionId: string) => {
    socket.join(sessionId);
    console.log(`Client ${socket.id} joined session ${sessionId}`);
  });

  socket.on('leave-session', (sessionId: string) => {
    socket.leave(sessionId);
    console.log(`Client ${socket.id} left session ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export function to emit updates
export function emitUpdate(sessionId: string, event: string, data: any) {
  io.to(sessionId).emit(event, data);
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔒 API rate limiting enabled`);
});