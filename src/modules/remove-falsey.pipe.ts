import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RemoveFalseyPipe implements PipeTransform {
  transform(value: object, metadata: ArgumentMetadata) {
    const keys = Object.keys(value);

    for (let i = keys.length - 1; i >= 0; i--) {
      if (!value[keys[i]]) delete value[keys[i]];
    }

    return value;
  }
}
