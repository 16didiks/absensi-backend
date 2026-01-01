import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // optional, biar bisa diakses dari frontend
  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
