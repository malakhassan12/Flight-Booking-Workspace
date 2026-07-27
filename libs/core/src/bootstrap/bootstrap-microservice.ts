import { INestMicroservice } from '@nestjs/common';
import { RpcExceptionFilter } from '@flight-booking-workspace/common';

export function bootstrapMicroservice(app: INestMicroservice) {
  app.useGlobalFilters(new RpcExceptionFilter());
}
