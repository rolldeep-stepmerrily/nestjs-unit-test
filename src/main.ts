import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const isProduction = configService.getOrThrow<string>('NODE_ENV') === 'production';

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProduction,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (isProduction) {
    app.use(helmet());
  } else {
    const GUEST_NAME = configService.getOrThrow<string>('GUEST_NAME');
    const GUEST_PASSWORD = configService.getOrThrow<string>('GUEST_PASSWORD');

    app.use(['/docs', '/docs-json'], expressBasicAuth({ challenge: true, users: { [GUEST_NAME]: GUEST_PASSWORD } }));

    const config = new DocumentBuilder()
      .setTitle('nestjs-unit-test')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: 0,
        persistAuthorization: true,
        syntaxHighlight: { theme: 'arta' },
        tryItOutEnabled: true,
        tagsSorter: 'alpha',
      },
    });
  }

  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT);
}
bootstrap();
