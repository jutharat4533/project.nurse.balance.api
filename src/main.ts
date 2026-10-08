import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Application failed to start', error);
  process.exit(1);
});
