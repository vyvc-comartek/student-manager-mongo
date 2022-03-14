import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SubjectTypes } from 'src/types/enum/subject-types.enum';
import { MongoId } from '../types/union/mongo-id.union';

@ObjectType()
@Schema({ timestamps: true, id: true })
export class Subject {
  @Field(() => String)
  _id: MongoId;

  @Prop({ type: String, required: true, unique: true, maxLength: 128 })
  name: string;

  @Prop({
    type: String,
    enum: { values: Object.values(SubjectTypes) },
    default: SubjectTypes.OFFLINE,
  })
  type: SubjectTypes;
}

export type SubjectDocument = Subject & Document;

export const SubjectSchema = SchemaFactory.createForClass(Subject);
