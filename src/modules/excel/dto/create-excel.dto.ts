import { Type } from 'class-transformer';

export class CreateExcelDto<T> {
  @Type(() => Buffer)
  schema: Buffer;

  data: T;
}
