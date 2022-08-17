import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  protected context?: string;
  constructor() {
    super();
  }

  setContext(context: string) {
    super.setContext.apply(this, arguments);
    this.context = context;
  }

  log(message: any, context?: string) {
    super.log.apply(this, arguments);
  }

  error(message: any, context?: string) {
    super.error.apply(this, arguments);
  }

  warn(message: any, context?: string) {
    super.warn.apply(this, arguments);
  }
}
