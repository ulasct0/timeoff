import {Position} from '../dto/Position.dto';

export interface Employee {
  id: number;
  name: string;
  surname: string;
  gender: "MALE" | "FEMALE";
  avatar: string;
  email: string;
  password: string;
  position: Position;
  salary: number;
  address: string;
  phoneNumber: string;
  startDate: Date;
}
