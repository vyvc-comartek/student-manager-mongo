import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 128 })
  name: string;

  @Column('enum', {
    nullable: false,
    enum: ['Online', 'Offline'],
    default: 'Offline',
  })
  type: 'Online' | 'Offline';
}
