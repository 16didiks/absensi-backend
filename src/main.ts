// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ================= CORS =================
  app.enableCors();

  // ================= VALIDATION PIPE =================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ================= STATIC FILES =================
  // Serve folder 'uploads' untuk bisa diakses via browser
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // URL: http://localhost:3000/uploads/...
  });

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}

bootstrap();
