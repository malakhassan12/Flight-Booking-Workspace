import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { setupSwagger } from './swagger';
import { setUpCors } from './cors';

export interface BootstrapHttpOptions {
  port: number;
  prefix?: string;
  swagger?: boolean;
}

export async function bootstrapHttp(
  app: INestApplication ,
  options: BootstrapHttpOptions,
) {
  const prefix = options.prefix ?? 'api';

  app.setGlobalPrefix(prefix);

  setUpCors(app);

  app.use(cookieParser());

  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (options.swagger) {
    setupSwagger(app , prefix);
  }

  await app.listen(options.port);

  Logger.log(`🚀 Server running on http://localhost:${options.port}/${prefix}`);
}
