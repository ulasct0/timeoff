export interface Timeoff {
  id: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  typeId: number;
  status: string;
  reason: string;
  isEarned: boolean;
}
