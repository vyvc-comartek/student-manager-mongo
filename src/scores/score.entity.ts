import { Field, Float, HideField, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Student } from '../students/student.entity';
import { Subject } from '../subjects/subject.entity';
import { MongoId } from '../types/union/mongo-id.union';

@ObjectType()
@Schema({
  timestamps: true,
  id: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  selectPopulatedPaths: true,
})
export class Score {
  @Field(() => String)
  _id: MongoId;

  @Field(() => Float)
  @Prop({
    type: Number,
    required: true,
    max: 10,
    min: 1,
    isFloat: true,
  })
  score: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  })
  @Type(() => Student)
  student: Student;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  @Type(() => Subject)
  subject: Subject;
}

export type ScoreDocument = Score & Document;

const ScoreSchema = SchemaFactory.createForClass(Score);

export { ScoreSchema };
