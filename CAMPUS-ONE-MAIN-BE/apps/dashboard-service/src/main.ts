import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DashboardModule } from './dashboard.module';

async function bootstrap() {
  const app = await NestFactory.create(DashboardModule);
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.DASHBOARD_SERVICE_PORT ?? 4006;
  await app.listen(port);
  console.log(`[dashboard-service] Running on http://localhost:${port}`);
}

bootstrap();
