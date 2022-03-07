import { Class } from 'src/classes/class.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Score } from '../scores/score.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 60 })
  name: string;

  @Column({ nullable: false })
  dob: Date;

  @Column('enum', {
    nullable: false,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  })
  gender: 'Male' | 'Female' | 'Other';

  @Column({ nullable: false, length: 128 })
  email: string;

  @ManyToOne(() => Class, (_class) => _class.students, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @OneToMany(() => Score, (_score) => _score.student)
  scores: Score[];

  public get scoreAvg() {
    return this.scores
      ? this.scores.reduce((result, { score }) => result + score, 0) /
          this.scores.length
      : 0;
  }
}
