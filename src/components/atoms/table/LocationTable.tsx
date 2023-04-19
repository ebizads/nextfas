/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react"
import { useEditableStore, useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox, Avatar } from "@mantine/core"
import Modal from "../../headless/modal/modal"
import { LocationType } from "../../../types/generic"
import { locationColumn } from "../../../lib/employeeTable"
import { getAddress, getName, getProperty } from "../../../lib/functions"
import { Location , UpdateLocationModal } from "../../maintenance/UpdateLocationModal"

const LocationTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: LocationType[]
  columns: ColumnType[]
}) => {
  const { minimize } = useMinimizeStore()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [updateRecord, setUpdateRecord] = useState<boolean>(false)
  const [details, setDetails] = useState<LocationType>()

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
  }, [setEditable, updateRecord, editable])

  useEffect(() => {
    console.log("editable: " + editable, "updateRecord: " + updateRecord)
  })

  if (editable) {
    console.log("dapat maging editable");
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
            {props.columns
              .filter((col) => props.filterBy.includes(col.value))
              .map((col) => (
                <th
                  key={col.name}
                  scope="col"
                  className="max-w-[10rem] truncate px-6 py-4 duration-150"
                >
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
              {locationColumn
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
          title={(editable) ? "Update Location Record" : "Location Record"}
          isVisible={updateRecord}
          setIsVisible={setUpdateRecord}
          className="max-w-4xl"
        >
          <UpdateLocationModal
            location={details as LocationType}
            setIsVisible={setUpdateRecord}
          />
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default LocationTable

function ShowDetails({
  isVisible,
  setIsVisible,
  info,
}: {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  info: LocationType
}) {
  return (
    <Modal
      title={"Location Details"}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      className="max-w-lg"
    >
      <>
        {info == null ? (
          <div></div>
        ) : (
          <div>
            
            <div className="flex flex-col px-3 py-3">
              <p className="text-lg font-bold">Location Information</p>
              <div className="grid grid-cols-2">
                <div className="py-3">
                  <p className="text-sm font-semibold">Asset Location</p>
                </div>
                <div className="py-3">
                  <p className="col-span-2 text-sm">
                    {info.building?? "NO DATA"}
                  </p>
                </div>
                <div className="py-3">
                  <p className="text-sm font-semibold">Floor</p>
                </div>
                <div className="py-3">
                  <p className="col-span-2 text-sm">
                    {info.floor ?? "NO DATA"}
                  </p>
                </div>
                <div className="py-3">
                  <p className="text-sm font-semibold">Room</p>
                </div>
                <div className="py-3">
                  <p className="col-span-2 text-sm">
                    {info.room ?? "NO DATA"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}
