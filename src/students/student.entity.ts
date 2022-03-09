import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Class } from '../classes/class.entity';
import { Score } from '../scores/score.entity';

@Schema({ timestamps: true, id: true, toObject: { virtuals: true } })
export class Student {
  @Prop({ type: String, required: true, maxLength: 60 })
  name: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({
    type: String,
    enum: { values: ['Male', 'Female', 'Other'] },
    default: 'Male',
  })
  gender: 'Male' | 'Female' | 'Other';

  @Prop({ type: String, required: true, maxLength: 128 })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  @Type(() => Class)
  class: Class;

  @Type(() => Score)
  scores: Score[];
}

export type StudentDocument = Student & Document;

const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('scores', {
  ref: 'Score',
  localField: 'student',
  foreignField: 'students',
});

export { StudentSchema };
