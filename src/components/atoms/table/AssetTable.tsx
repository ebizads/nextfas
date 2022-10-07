import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType, RowType } from "../../../types/table"
import { Checkbox } from "@mantine/core"

const AssetTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  rows: RowType[]
  columns: ColumnType[]
}) => {
  const { minimize } = useMinimizeStore()
  // const [checkAll, setCheckAll] = useState<boolean>(false)

  const selectAllCheckboxes = () => {
    if (props.checkboxes.length === 0) {
      props.setCheckboxes([-1])

      //returns all asset id
      // const id_array = props.rows.map((asset) => asset.id)

      //toggle all checkboxes to true
      // props.setCheckboxes(id_array)
    } else {
      props.setCheckboxes([])
    }
  }

  const toggleCheckbox = async (id: number) => {
    if (props.checkboxes.includes(id)) {
      props.setCheckboxes((prev) => prev.filter((e) => e !== id))
      return
    }

    props.setCheckboxes((prev) => [...prev, id])
  }

  return (
    <div
      className={`overflow-x-auto max-w-[90vw] ${
        minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
      } border relative shadow-md sm:rounded-lg`}
    >
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-neutral-50 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 uppercase">
          <tr>
            <th scope="col" className="py-1">
              <div className="flex justify-center items-center">
                <Checkbox
                  color={"orange"}
                  onChange={() => {
                    // setCheckAll((prev) => !prev)
                    selectAllCheckboxes()
                  }}
                  checked={props.checkboxes.length > 0 ? true : false}
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
                  className="px-6 duration-150 max-w-[10rem] truncate"
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
            <tr
              key={row.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="p-2 w-4">
                <div className="flex justify-center items-center">
                  <Checkbox
                    value={row.id}
                    color={"orange"}
                    onChange={(e) => {
                      toggleCheckbox(Number(e.target.value))
                    }}
                    checked={
                      props.checkboxes.includes(row.id) ||
                      props.checkboxes.includes(-1)
                    }
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </td>
              <td
                scope="row"
                className="py-2 px-6 whitespace-nowrap max-w-[10rem] truncate"
              >
                {row.serial_no}
              </td>
              <td className="py-2 px-6 max-w-[10rem] truncate">
                {row.bar_code}
              </td>
              <td className="py-2 px-6 max-w-[10rem] truncate">{row.type}</td>
              <td className="py-2 px-6 max-w-[10rem] truncate">
                {row.category}
              </td>
              <td className="py-2 px-6 max-w-[10rem] truncate">{row.name}</td>
              <td className="py-2 px-6 max-w-[10rem] truncate">
                {row.description}
              </td>
              <td className="py-2 px-6 max-w-[10rem] truncate">{row.owner}</td>
              <td className="py-2 px-6 max-w-[10rem] truncate">
                {row.added_date}
              </td>

              <td className="space-x-2 text-center max-w-[10rem]">
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

export default AssetTable
