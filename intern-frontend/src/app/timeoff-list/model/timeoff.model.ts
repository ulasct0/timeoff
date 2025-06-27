export interface Timeoff {
  id: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  typeId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}
