import React, { useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { Select } from "@mantine/core"
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
] as RowType[]

const columns = [
  { name: "Serial No.", filtered: false },
  { name: "Bar Code", filtered: false },
  { name: "Type", filtered: false },
  { name: "Category", filtered: false },
  { name: "Name", filtered: false },
  { name: "Description", filtered: false },
  { name: "Owner", filtered: false },
  { name: "Added Date", filtered: false },
] as ColumnType[]

const Assets = () => {
  const [checkboxes, setCheckboxes] = useState<number[]>([])

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Assets</h3>
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
              <button className="bg-tangerine-500 p-2 focus:outline-none group w-7 hover:w-16 duration-200 transition-width  outline-none hover:bg-tangerine-400 text-neutral-50 flex gap-2 rounded-md text-xs">
                <i className="fa-regular fa-bars-filter text-xs" />
                <span className="invisible group-hover:visible">Filter</span>
              </button>
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
          columns={columns}
        />
      </div>
    </DashboardLayout>
  )
}

export default Assets
