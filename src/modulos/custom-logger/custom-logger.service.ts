import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { appendFileSync } from 'fs';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    const baseMessage = `${pidMessage} ${formattedLogLevel} [${logLevel}] ${contextMessage}: ${message}`;
    const timeDiff = timestampDiff ? ` +${timestampDiff}` : '';
    return `${baseMessage}${timeDiff}`;
  }

  log(message: any, context?: string) {
    const formattedMessage = this.formatMessage(
      'log',
      message,
      process.pid.toString(),
      'LOG',
      context || '',
      '',
    );
    super.log(formattedMessage, context);

    this.logEmArquivo(message, context || '');
  }

  logEmArquivo(message: any, context: string) {
    const caminhoDoLog = './src/modulos/customLogger/arquivo.log';

    const mensagemFormatada =
      this.formatMessage(
        'log',
        message,
        process.pid.toString(),
        'LOG',
        context || '',
        '',
      ) + '\n';

    appendFileSync(caminhoDoLog, mensagemFormatada, { encoding: 'utf-8' });

    console.log('Log salvo em arquivo:', mensagemFormatada);
  }
}
