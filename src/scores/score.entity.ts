import { Student } from 'src/students/student.entity';
import { Subject } from 'src/subjects/subject.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float', {
    default: 1.0,
    nullable: false,
    unsigned: true,
    precision: 4,
    scale: 2,
  })
  score: number;

  @ManyToOne(() => Student, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Subject, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;
}
