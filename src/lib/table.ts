//constants

import { ColumnType } from "../types/table";

export const columns = [
  { value: "serial_number", name: "Serial No." },
  { value: "bar_code", name: "Bar Code" },
  { value: "type", name: "Type" },
  { value: "category", name: "Category" },
  { value: "name", name: "Name" },
  { value: "description", name: "Description" },
  { value: "owner", name: "Owner" },
  { value: "added_date", name: "Added Date" },
] as ColumnType[];
