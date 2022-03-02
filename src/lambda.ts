import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  app.enableCors();

  app.useGlobalPipes(
    /**
     * Reference: https://docs.nestjs.com/techniques/validation#auto-validation
     */
    new ValidationPipe({
      // Make sure that there's no unexpected data
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,

      /**
       * Detailed error messages since this is 4xx
       */
      disableErrorMessages: false,

      validationError: {
        /**
         * WARNING: Avoid exposing the values in the error output (could leak sensitive information)
         */
        value: false,
      },

      /**
       * Transform the JSON into a class instance when possible.
       * Depends on the type of the data on the controllers
       */
      transform: true,
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('Some APIs')
    .setDescription('API for something')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};