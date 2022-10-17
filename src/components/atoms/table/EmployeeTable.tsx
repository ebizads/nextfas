import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType, EmployeeRowType } from "../../../types/table"
import { Checkbox, Avatar } from "@mantine/core"
import Modal from "../../headless/modal/modal"

const EmployeeTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: EmployeeRowType[]
  columns: ColumnType[]
}) => {
  const { minimize } = useMinimizeStore()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const selectAllCheckboxes = () => {
    if (props.checkboxes.length === 0) {
      props.setCheckboxes([-1])
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

  const getProperty = (filter: string, asset: EmployeeRowType) => {
    //get object property
    return Object.getOwnPropertyDescriptor(asset, filter)?.value ?? "No Value"
  }

  const showDetails = () => {
    return (
      <Modal
        title={"Employee Details"}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        cancelButton
        className="max-w-lg"
      >
        <div>
          <div className="flex flex-row items-center gap-4 py-5">
            <Avatar src="avatar.png" alt="it's me" radius={200} size={100} />
            <div className="flex flex-col">
              <div className="flex flex-row">
                <text className="text-xl font-bold">
                  Clea Bernadette D. Payra
                </text>
                <div className="ml-2 mt-1 h-5 w-5 rounded-full border bg-green-500"></div>
              </div>
              <text className="text-sm">eBiz-12029312391</text>
            </div>
          </div>
          <div className="flex flex-col px-3 py-3">
            <text className="text-lg font-bold">Personal Information</text>
            <div className="grid grid-cols-2">
              <div className="py-3">
                <text className="text-sm font-semibold">FIRST NAME</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">Clea Bernadette</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">MIDDLE NAME</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">Domingo</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">LAST NAME</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">Payra</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">EMPLOYEE ID</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">eB1z-12029312391</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">STREET ADDRESS</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">123 Tondo</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">HIRE DATE</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">July 11, 2022</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">SUBSIDIARY</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">eBizolution Inc.</text>
              </div>
              <div className="py-3">
                <text className="text-sm font-semibold">PHONE NUMBER</text>
              </div>
              <div>
                <text className="col-span-2 text-sm">0932423423</text>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <div
      className={`max-w-[90vw] overflow-x-auto ${
        minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
      } relative border shadow-md sm:rounded-lg`}
    >
      {typeof props.rows === "object" ? (
        <div>{showDetails()}</div>
      ) : (
        <div></div>
      )}
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
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
            {props.columns.map((col) => (
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
          {props.rows.map((row) => (
            <tr
              key={row.id}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              onClick={() => setIsVisible(true)}
            >
              <td className="w-4 p-2">
                <div className="flex items-center justify-center">
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
              {Object.keys(row).map((key) => {
                return (
                  props.filterBy.includes(key) && (
                    <td className="max-w-[10rem] truncate py-2 px-6">
                      {getProperty(key, row)}
                    </td>
                  )
                )
              })}

              <td className="max-w-[10rem] space-x-2 text-center">
                <i className="fa-light fa-pen-to-square" />
                <i className="fa-light fa-trash-can text-red-500" />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable
