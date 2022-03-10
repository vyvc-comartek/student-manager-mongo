import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true, id: true })
export class Subject {
  @Prop({ type: String, required: true, unique: true, maxLength: 128 })
  name: string;

  @Field(() => String)
  @Prop({
    type: String,
    enum: { values: ['Online', 'Offline'] },
    default: 'Offline',
  })
  type: 'Online' | 'Offline';
}

export type SubjectDocument = Subject & Document;

export const SubjectSchema = SchemaFactory.createForClass(Subject);
