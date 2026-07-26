import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication , prefix : string) {
  const config = new DocumentBuilder()
    .setTitle('Flight Booking API')
    .setDescription('Flight Booking Microservices')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  for (const path of Object.values(document.paths)) {
    for (const operation of Object.values(path) as Record<string, unknown>[]) {
      (operation as Record<string, unknown>).security = [
        {
          'access-token': [],
        },
      ];
    }
  }

  SwaggerModule.setup(prefix, app, document, {
    customSiteTitle: 'Flight Booking API Documentation',
    explorer: true,
  });
}
