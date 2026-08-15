import { Injectable,  } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../../generated/prisma/client';
@Injectable()
export class PrismaService extends PrismaClient   {
  constructor(connectionString : string) {
    const adapter = new PrismaPg({
      // connectionString: process.env.DATABASE_URL as string,
      connectionString
    });
    super({ adapter });
  }


}
