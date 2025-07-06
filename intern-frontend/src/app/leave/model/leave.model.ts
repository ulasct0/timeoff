export interface Leave {
  id: number;
  employeeId: number;
  date: Date;
  status: Status;
  reason: string;
}

export enum Status {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}
