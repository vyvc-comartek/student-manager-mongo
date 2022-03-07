export interface IStudent {
  id: number;
  name: string;
  dob: Date;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  classId: number;
}
