export interface TimeoffWithFullName {
  id: number;
  employeeId: number;
  employeeFullName: string;
  startDate: Date;
  endDate: Date;
  typeId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}
