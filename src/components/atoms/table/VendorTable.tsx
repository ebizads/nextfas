import { Checkbox } from "@mantine/core"
import React, { useState } from "react"
import { getProperty } from "../../../lib/functions"
import { vendorColumns } from "../../../lib/table"
import { useMinimizeStore } from "../../../store/useStore"
import { AssetType, VendorType } from "../../../types/assets"
import { ColumnType } from "../../../types/table"

const VendorTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: VendorType[]
  columns: ColumnType[]
}) => {
  //minimize screen toggle
  const { minimize } = useMinimizeStore()

  const [openModalDesc, setOpenModalDesc] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [selectedAsset, setSelectedAsset] = useState<VendorType | null>(null)

  const selectAllCheckboxes = () => {
    if (props.checkboxes.length === 0) {
      props.setCheckboxes(props.rows.map((row, idx) => row?.id ?? idx))
    } else {
      props.setCheckboxes([])
    }
  }

  const toggleCheckbox = async (id: number) => {
    if (props.checkboxes.includes(id)) {
      // removes id if not selected
      props.setCheckboxes((prev) => prev.filter((e) => e !== id))
      return
    }
    // adds id
    props.setCheckboxes((prev) => [...prev, id])
  }

  return (
    <div
      className={`max-h-[62vh] max-w-[90vw] overflow-x-auto ${
        minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
      } relative border shadow-md sm:rounded-lg`}
    >
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
          <tr>
            <th scope="col" className="py-1">
              <div className="flex items-center justify-center">
                <Checkbox
                  color={"orange"}
                  onChange={() => {
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
              .filter((col) => props.filterBy.includes(col.value))
              .map((col) => (
                <th
                  key={col.name}
                  scope="col"
                  className="max-w-[10rem] truncate px-6 duration-150"
                >
                  {col.name}
                </th>
              ))}

            <th scope="col" className="p-4 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, idx) => (
            <tr
              key={row?.id ?? idx}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-2">
                <div className="flex items-center justify-center">
                  <Checkbox
                    value={row?.id ?? idx}
                    color={"orange"}
                    onChange={(e) => {
                      toggleCheckbox(Number(e.target.value))
                    }}
                    checked={props.checkboxes.includes(row?.id ?? idx)}
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </td>
              {vendorColumns
                .filter((col) => props.filterBy.includes(col.value))
                .map((col) => (
                  <td
                    key={col.value}
                    className="max-w-[10rem] cursor-pointer truncate py-2 px-6"
                    onClick={() => {
                      setOpenModalDesc(true)
                      setSelectedAsset(row)
                    }}
                  >
                    {getProperty(col.value, row)}
                  </td>
                ))}
              <td className="max-w-[10rem] space-x-2 text-center">
                <button>
                  <i className="fa-light fa-pen-to-square" />
                </button>
                <button
                  onClick={() => {
                    // setOpenModalDel(true)
                    // props.setCheckboxes([row?.id ?? idx])
                  }}
                >
                  <i className="fa-light fa-trash-can text-red-500" />{" "}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VendorTable
