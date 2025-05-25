import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);  

  @Get()
  getHello(): string {
    this.logger.log('Log de teste INFO');
    this.logger.warn('Log de teste WARN');
    this.logger.error('Log de teste ERROR');       
    return this.appService.getHello();
  }
}
