import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private logLevel: LogLevel;
  private logFile: string | null = null;
  private writeStream: fs.WriteStream | null = null;

  constructor() {
    const level = process.env.LOG_LEVEL || 'INFO';
    this.logLevel = LogLevel[level as keyof typeof LogLevel] || LogLevel.INFO;

    // Set up file logging if enabled
    if (process.env.LOG_TO_FILE === 'true') {
      this.setupFileLogging();
    }
  }

  private setupFileLogging() {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    this.logFile = path.join(logsDir, `app-${timestamp}.log`);
    this.writeStream = fs.createWriteStream(this.logFile, { flags: 'a' });
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? JSON.stringify(data, null, 2) : '';
    return `[${timestamp}] [${level}] ${message} ${dataStr}`.trim();
  }

  private writeToFile(message: string) {
    if (this.writeStream) {
      this.writeStream.write(message + '\n');
    }
  }

  private consoleLog(level: LogLevel, levelStr: string, message: string, data?: any) {
    if (this.logLevel >= level) {
      const formattedMessage = this.formatMessage(levelStr, message, data);

      // Write to file
      this.writeToFile(formattedMessage);

      // Console output with color
      const timestamp = chalk.gray(new Date().toISOString());
      switch (level) {
        case LogLevel.ERROR:
          console.error(`${timestamp} ${chalk.red('[ERROR]')} ${message}`, data || '');
          break;
        case LogLevel.WARN:
          console.warn(`${timestamp} ${chalk.yellow('[WARN]')} ${message}`, data || '');
          break;
        case LogLevel.INFO:
          console.info(`${timestamp} ${chalk.blue('[INFO]')} ${message}`, data || '');
          break;
        case LogLevel.DEBUG:
          console.log(`${timestamp} ${chalk.gray('[DEBUG]')} ${message}`, data || '');
          break;
      }
    }
  }

  error(message: string, error?: Error | any) {
    const errorData = error instanceof Error ? {
      ...error,
      message: error.message,
      stack: error.stack
    } : error;
    this.consoleLog(LogLevel.ERROR, 'ERROR', message, errorData);
  }

  warn(message: string, data?: any) {
    this.consoleLog(LogLevel.WARN, 'WARN', message, data);
  }

  info(message: string, data?: any) {
    this.consoleLog(LogLevel.INFO, 'INFO', message, data);
  }

  debug(message: string, data?: any) {
    this.consoleLog(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  // Log API requests
  logRequest(req: any, res: any, responseTime: number) {
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms)`;

    if (level === LogLevel.ERROR) {
      this.error(message, logData);
    } else {
      this.info(message, logData);
    }
  }

  // Log agent execution
  logAgentExecution(agentName: string, phase: string, duration: number, success: boolean, error?: any) {
    const logData = {
      agent: agentName,
      phase,
      duration: `${duration}ms`,
      success,
      error: error ? (error.message || error) : undefined
    };

    const message = `Agent ${agentName} - ${phase} ${success ? 'completed' : 'failed'} (${duration}ms)`;

    if (success) {
      this.info(message, logData);
    } else {
      this.error(message, logData);
    }
  }

  // Performance monitoring
  startTimer(label: string): () => number {
    const startTime = Date.now();
    this.debug(`Timer started: ${label}`);

    return () => {
      const duration = Date.now() - startTime;
      this.debug(`Timer ended: ${label}`, { duration: `${duration}ms` });
      return duration;
    };
  }

  // Close file stream on shutdown
  close() {
    if (this.writeStream) {
      this.writeStream.end();
    }
  }
}

// Singleton instance
const logger = new Logger();

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down logger...');
  logger.close();
});

export default logger;