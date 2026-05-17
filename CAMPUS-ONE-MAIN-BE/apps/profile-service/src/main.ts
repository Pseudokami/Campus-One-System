import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProfileModule } from './profile.module';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PROFILE_SERVICE_PORT ?? 4005;
  await app.listen(port);
  console.log(`[profile-service] Running on http://localhost:${port}`);
}

bootstrap();
