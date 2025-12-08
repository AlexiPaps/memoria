import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT') || 4000;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = [frontendUrl];

  // Enable Cors for file upload
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'apollo-require-preflight',
      'x-apollo-operation-name',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Enable file upload middleware
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 1,
    }),
  );

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/graphql`);
}
bootstrap();