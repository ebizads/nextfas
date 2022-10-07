import React, { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { Select, Popover, Checkbox } from "@mantine/core"
import { ColumnType, RowType } from "../types/table"
import AssetTable from "../components/atoms/table/AssetTable"

type SearchType = {
  value: string
  label: string
}

const Search = (props: { data: SearchType[] }) => {
  const [value, setValue] = useState<string | null>(null)
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
  )
}

const assets = [
  {
    id: 1,
    serial_no: "omsim123",
    bar_code: "qweqweqweqweqweqweqweqwe",
    type: "Laptop",
    category: "Gadget",
    name: "Mac OS",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
    owner: "Kevin the Rat",
    added_date: "08/22/22 (9:05 am)",
  },
  {
    id: 2,
    serial_no: "omsim345",
    bar_code: "wawawawawawa",
    type: "Printer",
    category: "Office Items",
    name: "Expensive Printer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
    owner: "Klarky Wahaha",
    added_date: "08/23/22 (10:06 am)",
  },
  {
    id: 3,
    serial_no: "omsim678",
    bar_code: "bwahahahahahaha",
    type: "Office Chair",
    category: "Office Items",
    name: "Wheel Chair",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
    owner: "Johnny Allen",
    added_date: "08/19/22 (11:05 pm)",
  },
  {
    id: 4,
    serial_no: "omsim696",
    bar_code: "ediwowhaha",
    type: "Water Dispenser",
    category: "Office Items",
    name: "Super Tubig",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
    owner: "Franz Arvae",
    added_date: "08/10/22 (12:05 pm)",
  },
  {
    id: 5,
    serial_no: "omsim420",
    bar_code: "opopoopopopop",
    type: "Coffee Maker",
    category: "Office Items",
    name: "Bitter Coffee",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
    owner: "Franz Arvae",
    added_date: "08/15/22 (1:05 pm)",
  },
] as RowType[]

const columns = [
  { value: "serial_no", name: "Serial No." },
  { value: "bar_code", name: "Bar Code" },
  { value: "type", name: "Type" },
  { value: "category", name: "Category" },
  { value: "name", name: "Name" },
  { value: "description", name: "Description" },
  { value: "owner", name: "Owner" },
  { value: "added_date", name: "Added Date" },
] as ColumnType[]

function FilterPopover(props) {
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
            props.setOpenPopover(!props.openPopover)
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
  )
}

const Assets = () => {
  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [filterBy, setFilterBy] = useState<string[]>([
    ...columns.map((i) => i.value),
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Assets</h3>
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-fit">
                <div className="flex-1">
                  <Search
                    data={[
                      ...assets.map((obj) => {
                        return { value: obj.serial_no, label: obj.name }
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
              <button className="border-2 border-tangerine-500 py-2 px-4 focus:outline-none outline-none hover:bg-tangerine-200 text-tangerine-600 font-medium flex gap-2 text-center rounded-md text-xs">
                <i className="fa-regular fa-plus text-xs" />
                Add New
              </button>
            </div>
          </div>
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
  )
}

export default Assets
