import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { logLevel } from 'kafkajs';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  protected context?: string;
  constructor() {
    super();
  }

  setContext(context: string) {
    super.setContext(context);
    this.context = context;
  }

  log(message: any) {
    super.log(message, this.context);
  }

  error(message: any) {
    super.error(message, '', this.context);
  }

  warn(message: any) {
    super.warn(message, this.context);
  }

  logKafka(level: number, message: any) {
    switch (level) {
      case logLevel.NOTHING:
        this.log(message);
      case logLevel.INFO:
        this.log(message);
      case logLevel.ERROR:
        this.error(message);
      case logLevel.WARN:
        this.warn(message);
      case logLevel.DEBUG:
        this.log(message);
      default:
        this.log(message);
    }
  }
}
