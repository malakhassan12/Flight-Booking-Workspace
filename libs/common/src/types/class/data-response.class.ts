import { HttpStatus } from '@nestjs/common';

export class DataResponse<T> {
  constructor(
    public readonly message: string,
    public readonly status: HttpStatus,
    public readonly data?: T | null,
  ) {}
}
