import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CoursesModule } from './courses.module';

async function bootstrap() {
  const app = await NestFactory.create(CoursesModule);
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.COURSES_SERVICE_PORT ?? 4009;
  await app.listen(port);
  console.log(`[courses-service] Running on http://localhost:${port}`);
}

bootstrap();
