import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Genders } from 'src/types/enum/gender.enum';
import { Class } from '../classes/class.entity';
import { Score } from '../scores/score.entity';
import { MongoId } from '../types/union/mongo-id.union';

@ObjectType()
@Schema({
  timestamps: true,
  id: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  selectPopulatedPaths: true,
})
export class Student {
  @Field(() => String)
  _id: MongoId;

  @Prop({ type: String, required: true, maxLength: 60 })
  name: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({
    type: String,
    enum: { values: Object.values(Genders) },
    default: Genders.MALE,
  })
  gender: Genders = Genders.MALE;

  @Prop({ type: String, required: true, maxLength: 128 })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  @Type(() => Class)
  class: Class;

  @Type(() => Score)
  scores: Score[];

  @Field(() => Int)
  @Type(() => Number)
  scoreAvg: number;
}

export type StudentDocument = Student & Document;

const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('scores', {
  ref: 'Score',
  localField: '_id',
  foreignField: 'student',
});

StudentSchema.virtual('scoreAvg').get(function (this: StudentDocument) {
  return this.scores
    ? this.scores.reduce((result, { score }) => result + score, 0) /
        this.scores.length
    : 0;
});

export { StudentSchema };
