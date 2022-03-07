import { Student } from 'src/students/student.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 60 })
  name: string;

  @Column({ nullable: false, default: 0 })
  totalMember: number;

  @Column({ nullable: false, length: 60 })
  teacherName: string;

  @OneToMany(() => Student, (_student) => _student.class)
  students: Student[];
}
