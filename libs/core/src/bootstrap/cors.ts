import { INestApplication } from '@nestjs/common';

type CorsOriginCallback = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => void;

interface CorsConfiguration {
  origin: CorsOriginCallback;
}

export function setUpCors(app: INestApplication) {
  const whiteList: Set<string> = new Set(['http://localhost:3000']);
  const corsOptions: CorsConfiguration = {
    origin: (origin, callback) => {
      if (!origin || whiteList.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  app.enableCors(corsOptions);
}
