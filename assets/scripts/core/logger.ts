/**
 * 统一日志（core/logger）。
 * 规则：`core` 层禁止 `import "cc"`（00_Architecture.md 引擎隔离规则）。
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let minLevel: LogLevel = 'debug';

export function setLogLevel(level: LogLevel): void {
  minLevel = level;
}

export function getLogLevel(): LogLevel {
  return minLevel;
}

export function writeLog(level: LogLevel, moduleName: string, message: string, ...args: unknown[]): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) {
    return;
  }
  const prefix = `[${level.toUpperCase()}][${moduleName}]`;
  switch (level) {
    case 'debug':
      console.log(prefix, message, ...args);
      break;
    case 'info':
      console.log(prefix, message, ...args);
      break;
    case 'warn':
      console.warn(prefix, message, ...args);
      break;
    case 'error':
      console.error(prefix, message, ...args);
      break;
    default:
      console.log(prefix, message, ...args);
      break;
  }
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export function createLogger(moduleName: string): Logger {
  return {
    debug: (message: string, ...args: unknown[]) => writeLog('debug', moduleName, message, ...args),
    info: (message: string, ...args: unknown[]) => writeLog('info', moduleName, message, ...args),
    warn: (message: string, ...args: unknown[]) => writeLog('warn', moduleName, message, ...args),
    error: (message: string, ...args: unknown[]) => writeLog('error', moduleName, message, ...args),
  };
}
