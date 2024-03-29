import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export const applyAppSettings = (app: INestApplication) => {
  app.enableCors();
  app.use(cookieParser());
  setAppPipes(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setAppExceptionsFilters(app);
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];

        errors.forEach((e) => {
          // @ts-ignore
          //errorsForResponse.push({ field: e.property });
          // @ts-ignore
          const constrainsKeys = Object.keys(e.constraints);
          constrainsKeys.forEach((ckey) => {
            // @ts-ignore
            errorsForResponse.push({
              // @ts-ignore
              message: e.constraints[ckey],
              // @ts-ignore
              field: e.property,
            });
          });
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
};
const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
