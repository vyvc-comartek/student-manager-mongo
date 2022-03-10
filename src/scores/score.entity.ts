import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Student } from '../students/student.entity';
import { Subject } from '../subjects/subject.entity';

@Schema({
  timestamps: true,
  id: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  selectPopulatedPaths: true,
})
export class Score {
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

export const ScoreSchema = SchemaFactory.createForClass(Score);
