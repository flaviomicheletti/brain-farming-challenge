import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RouteLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RouterExplorer');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    // Opcional: obtenha versão se usar versionamento
    // const version = request.headers['accept-version'] || 'N/A';

    this.logger.log(`Mapped {${url}, ${method}} route`);
    return next.handle();
  }
}
