import React, { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { Checkbox, Select } from "@mantine/core"
import { SingletonRouter } from "next/router"
import { useMinimizeStore } from "../store/useStore"

const Table = (props: {
  checkbox: boolean
  setCheckbox: Function
  rows: AssetType[]
  columns: ColumnType[]
}) => {
  return (
    <div className="overflow-x-auto border relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-neutral-50 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 uppercase">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex justify-center items-center">
                <Checkbox
                  color={"orange"}
                  onChange={() => props.setCheckbox(!props.checkbox)}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                  }}
                />
              </div>
            </th>
            {props.columns
              .filter((col) => !col.filtered)
              .map((col) => (
                <th
                  key={col.name}
                  scope="col"
                  className="p-4 duration-150 max-w-[10rem] truncate"
                >
                  {col.name}
                </th>
              ))}

            <th scope="col" className="p-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="p-4 w-4">
                <div className="flex justify-center items-center">
                  <Checkbox
                    color={"orange"}
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </td>
              <td
                scope="row"
                className="py-4 px-6 whitespace-nowrap max-w-[10rem] truncate"
              >
                {row.serial_no}
              </td>
              <td className="py-4 px-6 max-w-[10rem] truncate">
                {row.bar_code}
              </td>
              <td className="py-4 px-6 max-w-[10rem] truncate">{row.type}</td>
              <td className="py-4 px-6 max-w-[10rem] truncate">
                {row.category}
              </td>
              <td className="py-4 px-6 max-w-[10rem] truncate">{row.name}</td>
              <td className="py-4 px-6 max-w-[10rem] truncate">
                {row.description}
              </td>
              <td className="py-4 px-6 max-w-[10rem] truncate">{row.owner}</td>
              <td className="py-4 px-6 max-w-[10rem] truncate">
                {row.added_date}
              </td>

              <td className="flex justify-center items-center py-4 px-6 gap-2">
                <i className="fa-light fa-pen-to-square" />
                <i className="text-red-500 fa-light fa-trash-can" />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

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

type ColumnType = {
  name: string
  filtered: boolean
}

type AssetType = {
  serial_no: string
  bar_code: string
  type: string
  category: string
  name: string
  description: string
  owner: string
  added_date: string
}

const assets = [
  {
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
] as AssetType[]

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
  const [checkbox, setCheckbox] = useState<boolean>(false)

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
              <button className="bg-tangerine-500 p-2 focus:outline-none outline-none hover:bg-tangerine-600 text-neutral-50 flex gap-2 rounded-md text-xs">
                <i className="fa-regular fa-bars-filter text-xs" />
              </button>
            </div>
            {checkbox && (
              <button className="bg-red-400 p-2 focus:outline-none outline-none hover:bg-red-400 text-neutral-50 flex gap-2 rounded-md text-xs">
                Delete
                <i className="fa-regular fa-trash-can text-neutral-50 text-xs" />
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
        <Table
          checkbox={checkbox}
          setCheckbox={setCheckbox}
          rows={assets}
          columns={columns}
        />
      </div>
    </DashboardLayout>
  )
}

export default Assets
