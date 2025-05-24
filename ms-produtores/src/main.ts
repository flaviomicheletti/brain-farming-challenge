import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita o versionamento da API
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  
  await app.listen(3000);
}
bootstrap();