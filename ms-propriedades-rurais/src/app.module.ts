import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropriedadesRuraisModule } from './propriedades/propriedades.module';

import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { RouteLoggingInterceptor } from './interceptors/route-logging.interceptor';

@Module({
  imports: [
    WinstonModule.forRoot(winstonLoggerOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'agro_manager',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    PropriedadesRuraisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RouteLoggingInterceptor,
    },
  ],
})
export class AppModule {}
