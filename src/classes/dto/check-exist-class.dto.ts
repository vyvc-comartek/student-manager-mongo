import { IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export class CheckExistClassDto {
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;
}
