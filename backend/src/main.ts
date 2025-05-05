import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SocketIOAdapter } from './socket-io.adapter';
import { ConfigService } from '@nestjs/config';


dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = [
    configService.get<string>('FRONTEND_URL'),
    configService.get<string>('FRONTEND_CRM_URL'),
    configService.get<string>('FRONTEND_PLATFORM_URL'),
  ].filter(Boolean);
 
  const config = new DocumentBuilder()
    .setTitle('Play Attention')
    .setDescription('Gestión de endpoints para Play Attention')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'playAttentionToken',
        description: 'Enter JWT token',
        in: 'header',
      },
      'playAttentionToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'playAttentionToken'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
  });

  // Configurar el adaptador de Socket.IO con CORS
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  await app.listen(3000);
}
bootstrap();