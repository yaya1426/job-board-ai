import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { errorHandler } from './utils/errors';
import db from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import applicationsRoutes from './routes/applications.routes';
import hrRoutes from './routes/hr.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5147;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
// Express 5: Explicitly set extended to true (default is now false)
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// OpenAI test endpoint
app.get('/api/test/openai', async (req, res) => {
  try {
    const { openai, openaiModel } = await import('./config/openai');
    
    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI client not initialized',
        message: 'Please set OPENAI_API_KEY in your .env file'
      });
    }

    const testPrompt = 'Say "OpenAI is working!" in a friendly way.';
    
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      messages: [
        {
          role: 'user',
          content: testPrompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({
      success: true,
      message: 'OpenAI connection successful!',
      model: openaiModel,
      prompt: testPrompt,
      response: response,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('OpenAI test error:', error);
    res.status(500).json({
      success: false,
      error: 'OpenAI test failed',
      message: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/hr', hrRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
// Express 5: app.listen now passes errors to callback
async function startServer() {
  let server: any = null;

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} signal received: starting graceful shutdown...`);

    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
      });

      // Force close server after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    }

    // Close database connection
    try {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          process.exit(1);
        } else {
          console.log('Database connection closed');
          console.log('Graceful shutdown completed');
          process.exit(0);
        }
      });
    } catch (error) {
      console.error('Error during database shutdown:', error);
      process.exit(1);
    }
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  try {
    await initDatabase();
    
    server = app.listen(PORT, (error?: Error) => {
      if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
      console.log(`
🚀 Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📝 API: http://localhost:${PORT}/api
      `);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();

export default app;
