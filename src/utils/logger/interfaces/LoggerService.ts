import { LogLevel } from '../../../../src/utils/logger/interfaces/LogLevel'

export interface LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]): any

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]): any

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]): any

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]): any

  /**
   * Set log levels.
   * @param levels log levels
   */
  setLogLevels?(levels: typeof LogLevel[number]): any
}