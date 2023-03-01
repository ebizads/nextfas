/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react"
import { useEditableStore, useMinimizeStore } from "../../store/useStore"
import { ColumnType } from "../../types/table"
import { Checkbox, Avatar } from "@mantine/core"
import Modal from "../headless/modal/modal"
import { UserType } from "../../types/generic"
import { userColumns } from "../../lib/table"
import { getAddressUser, getNameUser, getProperty } from "../../lib/functions"
import UpdateUserModal from "./UpdateUserModal"
import { trpc } from "../../utils/trpc"

const UserTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: UserType[]
  columns: ColumnType[]
}) => {
  const { minimize } = useMinimizeStore()

  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [updateRecord, setUpdateRecord] = useState<boolean>(false)
  const [details, setDetails] = useState<UserType>()
  const [userId, setUserId] = useState<number>(0)
  const { data: user, refetch } = trpc.user.findOne.useQuery(userId)
  const futureDate = new Date()

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

  const { editable, setEditable } = useEditableStore()

  useEffect(() => {
    if (!updateRecord && editable) {
      setEditable(false)
    }
    setUserId(Number(details?.id))
  }, [editable, setEditable, updateRecord])

  useEffect(() => {
    // console.log("ewan: " + Boolean(props.rows))
  })
  const lockedChecker = futureDate < (details?.lockedUntil ?? "") ? true : false
  
  return (
    <div
      className={`max-w-[90vw] overflow-x-auto ${
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
                  className="max-w-[10rem] truncate px-6 py-4 duration-150"
                >
                  {/* {console.log(col)} */}
                  {col.name}
                </th>
              ))}

            <th scope="col" className="p-4 text-center">
              {/* Action */}
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
              {userColumns
                .filter((col) => props.filterBy.includes(col.value))
                .map((col) => (
                  <td
                    key={col.value}
                    className="max-w-[10rem] cursor-pointer truncate py-2 px-6"
                    onClick={() => {
                      // setIsVisible(setUpdateRecord)
                      setDetails(row)
                      setUpdateRecord(true)
                    }}
                  >
                    {
                      // console.log(row)
                      // ternary operator that returns special values for date, name, and address
                      col.value === "team"
                        ? row?.Userteam?.name
                          ? row?.Userteam?.name
                          : "--"
                        : col.value === "hired_date"
                        ? row?.hired_date?.toDateString()
                          ? row?.hired_date?.toDateString()
                          : "--"
                        : col.value.match(/_name/g)
                        ? getNameUser(col.value, row)
                        : col.value === "city"
                        ? getAddressUser(row).includes("undefined")
                          ? "--"
                          : getAddressUser(row)
                        : getProperty(col.value, row)
                    }
                  </td>
                ))}
              {/* <td className="max-w-[10rem] space-x-2 text-center">
                <i
                  className="fa-light fa-pen-to-square"
                  onClick={() => {
                    setDetails(row)
                    setUpdateRecord(true)
                  }}
                />
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      {/* <ShowDetails
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        info={details!}
      /> */}

      {details !== null ? (
        <Modal
          title={
            lockedChecker
              ? editable
                ? "Update User Record \uD83D\uDD12"
                : "User Record \uD83D\uDD12"
              : editable
              ? "Update User Record"
              : "User Record"
          }
          isVisible={updateRecord}
          setIsVisible={setUpdateRecord}
          className="max-w-4xl"
        >
          <UpdateUserModal
            user={details as UserType}
            setIsVisible={setUpdateRecord}
          />
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default UserTable
