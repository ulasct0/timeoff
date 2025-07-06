import {Status} from '../model/leave.model';

export interface LeaveWithFullName {
  id: number;
  employeeId: number;
  employeeFullName: string;
  date: Date;
  status: Status;
  reason: string;
}
