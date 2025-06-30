export interface Type {
  id: number,
  label: string
}

export const timeoffTypes: Type[] = [
  {id: 1, label: 'Paid Leave'},
  {id: 2, label: 'Unpaid Leave'},
  {id: 3, label: 'Birthday Leave'},
];
