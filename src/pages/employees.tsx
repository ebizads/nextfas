import React, { Children, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Select, Popover, Checkbox } from "@mantine/core";
import { ColumnType, EmployeeRowType, RowType } from "../types/table";
import AssetTable from "../components/atoms/table/AssetTable";
import Modal from "../components/headless/modal/modal";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";

type SearchType = {
  value: string;
  label: string;
};

const Search = (props: { data: SearchType[] }) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Select
      value={value}
      placeholder="Search"
      searchable
      nothingFound={`Cannot find option`}
      onChange={setValue}
      clearable
      data={[...props.data]}
      icon={<i className="text-xs fa-solid fa-magnifying-glass"></i>}
    />
  );
};

const assets = [
  {
    id: 1,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 2,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 3,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 4,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 5,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 1,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 2,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 3,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 4,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
  {
    id: 5,
    first_name: "kiben",
    middle_name: "james",
    last_name: "paular",
    id_no: "080599",
    address: "Paranaque, NCR",
    hire_date: "08/22/22 (9:05 am)",
    subsidiary: "Kevin the Rat",
    contact_number: "09265467575",
  },
] as EmployeeRowType[];

const columns = [
  { value: "first_name", name: "FIRST NAME" },
  { value: "middle_name", name: "MIDDLE NAME" },
  { value: "last_name", name: "LAST NAME" },
  { value: "id_no", name: "ID" },
  { value: "address", name: "STREET ADDRESS" },
  { value: "hire_date", name: "HIRE DATE" },
  { value: "subsidiary", name: "SUBSIDIARY" },
  { value: "contact_number", name: "CONTACT NUMBER" },
] as ColumnType[];

const FilterPopover = (props: {
  openPopover: boolean;
  setOpenPopover: Function;
  filterBy: string[];
  setFilterBy: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <Popover
      opened={props.openPopover}
      onClose={() => props.setOpenPopover(false)}
      trapFocus={false}
      position="bottom"
      zIndex={10}
      classNames={{
        dropdown: "p-0 w-80 rounded-md shadow-lg",
      }}
    >
      <Popover.Target>
        <button
          onClick={() => {
            props.setOpenPopover(!props.openPopover);
          }}
          className="bg-tangerine-500 p-2 focus:outline-none group w-7 hover:w-16 duration-200 transition-width  outline-none hover:bg-tangerine-400 text-neutral-50 flex gap-2 rounded-md text-xs"
        >
          <i className="fa-regular fa-bars-filter text-xs" />
          <span className="invisible group-hover:visible">Filter</span>
        </button>
      </Popover.Target>{" "}
      <Popover.Dropdown>
        <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
        <div className="px-4 py-2">
          <Checkbox.Group
            orientation="vertical"
            description="Filter by"
            value={props.filterBy}
            onChange={props.setFilterBy}
          >
            <div className="grid grid-cols-2">
              {columns.map((col, idx) => (
                <Checkbox
                  color={"orange"}
                  key={col.name}
                  disabled={
                    props.filterBy.length === 1 &&
                    props.filterBy.includes(col.value)
                      ? true
                      : false
                  }
                  value={col.value}
                  label={col.name}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                  }}
                />
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

const Employees = () => {
  const [checkboxes, setCheckboxes] = useState<number[]>([]);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<string[]>([
    ...columns.map((i) => i.value),
  ]);
  const [value, setValue] = useState<DateRangePickerValue>([
    new Date(2021, 11, 1),
    new Date(2021, 11, 5),
  ]);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Employee</h3>
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-fit">
                <div className="flex-1">
                  <Search
                    data={[
                      ...assets.map((obj) => {
                        return { value: obj.id_no, label: obj.last_name };
                      }),
                    ]}
                  />
                </div>
                <FilterPopover
                  openPopover={openPopover}
                  setOpenPopover={setOpenPopover}
                  filterBy={filterBy}
                  setFilterBy={setFilterBy}
                />
              </div>
              {checkboxes.length > 0 && (
                <button className="p-2 focus:outline-none outline-none text-red-500 underline underline-offset-4  font-medium flex gap-2 rounded-md text-xs">
                  {checkboxes.includes(-1)
                    ? `Delete all record/s ( ${assets.length} ) ?`
                    : `Delete selected record/s ( ${checkboxes.length} )`}
                  {/* <i className="fa-regular fa-trash-can text-red-500 text-xs" /> */}
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <button className="bg-tangerine-500 py-2 px-4 focus:outline-none outline-none hover:bg-tangerine-600 text-neutral-50 flex gap-2 rounded-md text-xs">
                <i className="fa-solid fa-print text-xs" />
                Print CVs
              </button>
              <button
                onClick={() => {
                  setIsVisible(true);
                }}
                className="border-2 border-tangerine-500 py-2 px-4 focus:outline-none outline-none hover:bg-tangerine-200 text-tangerine-600 font-medium flex gap-2 text-center rounded-md text-xs"
              >
                <i className="fa-regular fa-plus text-xs" />
                Add New
              </button>
            </div>
          </div>
          <Modal
            title="Add New Employee"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            cancelButton
          >
            <div>
              <div className="flex flex-wrap gap-10 py-2.5">
                <div className="flex-col flex w-1/4">
                  <label className="sm:text-sm">First Name</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
                <div className="flex-col flex w-1/4">
                  <label className="sm:text-sm">Middle Name</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
                <div className="flex-col flex w-1/4">
                  <label className="sm:text-sm">Last Name</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-10 py-2.5">
                <div className="flex-col flex md:w-1/2 sm:w-13">
                  <label className="sm:text-sm">Address</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
                <div className="flex-col flex w-1/3">
                  <label className="sm:text-sm">Employee Number</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-10 py-2.5">
                <div className="flex-col flex md:w-1/4 sm:w-13">
                  <label className="sm:text-sm">Hired Date</label>
                  {/* <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  /> */}
                  <DateRangePicker
                    dropdownType="modal"
                    placeholder="Pick dates range"
                    size="sm"
                    value={value}
                    onChange={setValue}
                  />
                </div>
                <div className="flex-col flex w-1/4">
                  <label className="sm:text-sm">Subsidiary</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
                <div className="flex-col flex w-1/4">
                  <label className="sm:text-sm">Mobile Number</label>
                  <input
                    className="shadow appearance-none border rounded border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
              </div>
            </div>
          </Modal>
          <AssetTable
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            rows={assets}
            filterBy={filterBy}
            columns={columns.filter((col) => filterBy.includes(col.value))}
          />
        </section>
        <div className="flex justify-between mt-8 px-4">
          <p>{`Showing 1 to 5 of ${assets.length} entries`}</p>
          <div className="flex gap-4 items-center">
            <button className="text-light-muted">Previous</button>
            <button className="bg-tangerine-400 hover:bg-tangerine-500 hover:text-neutral-50 w-8 h-8 text-center rounded-md ">
              1
            </button>
            <button className="hover:bg-tangerine-500 hover:text-neutral-50 w-8 h-8 text-center rounded-md ">
              2
            </button>
            <button className="hover:bg-tangerine-500 hover:text-neutral-50 w-8 h-8 text-center rounded-md ">
              3
            </button>
            <button className="hover:underline outline-none focus:outline-none">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
