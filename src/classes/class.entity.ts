import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongodb';
import { Student } from '../students/student.entity';

@Schema({
  timestamps: true,
  id: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  selectPopulatedPaths: true,
})
export class Class {
  @Prop({ type: String, required: true, maxlength: 60 })
  name: string;

  @Prop({ type: Number, required: true, default: 0 })
  totalMember: number;

  @Prop({ type: String, required: true, maxlength: 60 })
  teacherName: string;

  @Type(() => Student)
  students: Student[];
}

export type ClassDocument = Class & Document;

const ClassSchema = SchemaFactory.createForClass(Class);

ClassSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'class',
});

export { ClassSchema };
