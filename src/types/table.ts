export type ColumnType = {
  name: string;
  value: string;
};

export type RowType = {
  id: number;
  serial_no: string;
  bar_code: string;
  type: string;
  category: string;
  name: string;
  description: string;
  owner: string;
  added_date: string;
};
export type EmployeeRowType = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  id_no: string;
  address: string;
  hire_date: string;
  subsidiary: string;
  contact_number: string;
};

export type ImageJSON = {
  name: string;
  size: number;
  file: string;
};
