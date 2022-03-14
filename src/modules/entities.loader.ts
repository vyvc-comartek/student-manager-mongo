import * as DataLoader from 'dataloader';
import { MongoId } from '../types/union/mongo-id.union';

export function createLoader<ObjectType>(
  service: { search: Function },
  _idFieldName: string = '_id',
) {
  return new DataLoader<MongoId, ObjectType>(async (_ids: MongoId[]) => {
    const promises = _ids.map((_id) => service.search({ [_idFieldName]: _id }));

    const entities = await Promise.all(promises);

    return entities;
  });
}
