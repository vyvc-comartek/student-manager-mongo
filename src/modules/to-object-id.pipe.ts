import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

@Injectable()
export class ToObjectId implements PipeTransform {
  transform(value: object, metadata: ArgumentMetadata) {
    if (!value) return value;

    let changed = {};
    const keys = Object.keys(value);

    for (let i = keys.length - 1; i >= 0; i--) {
      if (isMongoId(value[keys[i]]))
        changed[keys[i]] = ObjectId.createFromHexString(value[keys[i]]);
    }

    return {
      ...value,
      ...changed,
    };
  }
}
