export type ColumnType = {
  name: string;
  value: string;
};

export type RowType = {
  id: number;
  serial_number: string;
  bar_code: string;
  type: string;
  category: string;
  name: string;
  description: string;
  owner: string;
  added_date: string;
};

export type DetailType = {
  type: string;
  label: string;
};
