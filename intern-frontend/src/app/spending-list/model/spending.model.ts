export interface Spending {
  id: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  spendingAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}
