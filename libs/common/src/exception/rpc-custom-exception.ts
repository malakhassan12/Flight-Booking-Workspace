import { RpcException } from "@nestjs/microservices";

export class RpcHttpException extends RpcException {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super({
      statusCode,
      message,
    });
  }
}
