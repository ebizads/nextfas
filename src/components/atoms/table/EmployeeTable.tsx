/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox, Avatar } from "@mantine/core"
import Modal from "../../headless/modal/modal"
import { EmployeeType } from "../../../types/generic"
import { columns } from "../../../lib/table"

const EmployeeTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: EmployeeType[]
  columns: ColumnType[]
}) => {
  const { minimize } = useMinimizeStore()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [details, setDetails] = useState<EmployeeType>()

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

  return (
    <div
      className={`max-w-[90vw] overflow-x-auto ${minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
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
                    checked={
                      props.checkboxes.includes(row?.id ?? idx) ||
                      props.checkboxes.includes(-1)
                    }
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </td>
              {columns
                .filter((col) => props.filterBy.includes(col.value))
                .map((col) => (
                  <td
                    key={col.value}
                    className="max-w-[10rem] cursor-pointer truncate py-2 px-6"
                    onClick={() => {
                      setIsVisible(true)
                      setDetails(row)
                    }}
                  >
                    {col.value === "hired_date"
                      ? row?.hired_date?.toDateString() ?? "No Data"
                      : col.value === "city"
                        ? row?.address?.city ?? "No Data"
                        : // : getEmployeeProperty(col.value, row)}
                        ""}
                  </td>
                ))}
              <td className="max-w-[10rem] space-x-2 text-center">
                <i className="fa-light fa-pen-to-square" />
                <i className="fa-light fa-trash-can text-red-500" />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ShowDetails
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        info={details!}
      />
    </div>
  )
}

export default EmployeeTable

function ShowDetails({
  isVisible,
  setIsVisible,
  info,
}: {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  info: EmployeeType
}) {
  return (
    <Modal
      title={"Employee Details"}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      className="max-w-lg"
    >
      <>
        {console.log(info)}
        {info == null ? (
          <div></div>
        ) : (
          <div>
            <div className="flex flex-row items-center gap-4 py-5">
              <Avatar src={info.image} alt="it's me" radius={200} size={100} />
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <text className="text-xl font-bold">
                    {info.profile?.first_name}
                  </text>
                  <div className="ml-2 mt-1 h-5 w-5 rounded-full border bg-green-500"></div>
                </div>
                <text className="text-sm">{`${info.employee_id}`}</text>
              </div>
            </div>
            <div className="flex flex-col px-3 py-3">
              <text className="text-lg font-bold">Personal Information</text>
              <div className="grid grid-cols-2">
                <div className="py-3">
                  <text className="text-sm font-semibold">FIRST NAME</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.profile?.first_name ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">MIDDLE NAME</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.profile?.middle_name ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">LAST NAME</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.profile?.last_name ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">EMPLOYEE ID</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.employee_id ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">STREET ADDRESS</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.address?.street ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">HIRE DATE</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.hired_date?.toDateString() ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">SUBSIDIARY</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.subsidiary ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">PHONE NUMBER</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.profile?.phone_no ?? "NO DATA"}
                  </text>
                </div>
                <div className="py-3">
                  <text className="text-sm font-semibold">EMAIL</text>
                </div>
                <div className="py-3">
                  <text className="col-span-2 text-sm">
                    {info.email ?? "NO DATA"}
                  </text>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}
