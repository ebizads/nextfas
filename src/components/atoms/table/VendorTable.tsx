import { Avatar, Checkbox } from "@mantine/core"
import React, { useState, useEffect } from "react"
import { getProperty, getPropertyDisposal } from "../../../lib/functions"
import { vendorColumns } from "../../../lib/table"
import { useEditableStore, useMinimizeStore } from "../../../store/useStore"
import { VendorType } from "../../../types/generic"
import { ColumnType } from "../../../types/table"
import Modal from "../../headless/modal/modal"
// import Modal from "../../asset/Modal"
import { trpc } from "../../../utils/trpc"

import { UpdateVendorModal } from "../../vendor/UpdateVendorModal"

const VendorTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: VendorType[]
  columns: ColumnType[]
}) => {
  //minimize screen toggle
  const { minimize } = useMinimizeStore()

  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [openModalDesc, setOpenModalDesc] = useState<boolean>(false)
  const [selectedAsset, setSelectedAsset] = useState<VendorType | null>(null)
  const [updateRecord, setUpdateRecord] = useState<boolean>(false)
  const [details, setDetails] = useState<VendorType>()
  // const [openModalDel, setOpenModalDel] = useState<boolean>(false)

  const utils = trpc.useContext()

  const deleteVendor = trpc.vendor.delete.useMutation({
    onSuccess: () => {
      utils.vendor.findAll.invalidate()
    },
  })

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

  const { editable, setEditable } = useEditableStore()

  useEffect(() => {
    if (!updateRecord && editable) {
      setEditable(false)
    }
  }, [setEditable, updateRecord])

  useEffect(() => {
    console.log("editable: " + editable, "updateRecord: " + updateRecord)
  })

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
                  className="max-w-[10rem] truncate px-6 py-4 duration-150"
                >
                  {col.name}
                </th>
              ))}

            {/* <th scope="col" className="p-4 text-center">
                  Action
                </th> */}
          </tr>
        </thead>
        <tbody>
          {props.rows
            .sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
            .map((row, idx) => (
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
                        // setOpenModalDesc(true)
                        // setSelectedAsset(row)

                        setDetails(row)
                        setUpdateRecord(true)
                      }}
                    >
                      {getPropertyDisposal(col.value, row) ?? "Invalid data"}
                    </td>
                  ))}
                {/* <td className="max-w-[10rem] space-x-2 text-center">
               
                <button
                  onClick={() => {
                    deleteVendor.mutate(row?.id ?? 0)
                  }}
                >
                  <i className="fa-light fa-trash-can text-red-500" />{" "}
                </button>
              </td> */}
              </tr>
            ))}
        </tbody>
      </table>
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      {/* <Modal isOpen={openModalDesc} setIsOpen={setOpenModalDesc} size={8} >
        <pre><>
          {selectedAsset === null ? (
            <div></div>
          ) : (
            <div className="p-4">
              <div className="flex flex-row items-center gap-4 py-5">
                <Avatar
                  src={selectedAsset.name ?? ""}
                  alt="it's me"
                  radius={200}
                  size={100}
                />
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <p className="text-xl font-bold">
                      {selectedAsset.name}
                    </p>
                  </div>
                  <p className="text-sm">{selectedAsset.email}</p>
                </div>
              </div>
              <div className="flex flex-col px-3 py-3">
                <p className="text-lg font-bold">Vendor Information</p>
                <div className="grid grid-cols-2">
                  <div className="py-3">
                    <p className="text-sm font-semibold">Vendor Type</p>
                  </div>


                  <div className="py-3">
                    <p className="col-span-2 text-sm">
                      {selectedAsset.type ?? "NO DATA"}
                    </p>
                  </div>
                  <div className="py-3">
                    <p className="text-sm font-semibold">Address</p>
                  </div>
                  <div className="py-3">
                    <p className="col-span-2 text-sm">
                      {selectedAsset.address?.city ?? "NO DATA"}
                    </p>
                  </div>
                  <div className="py-3">
                    <p className="text-sm font-semibold">Email</p>
                  </div>
                  <div className="py-3">
                    <p className="col-span-2 text-sm">
                      {selectedAsset.email ?? "NO DATA"}
                    </p>
                  </div>
                  <div className="py-3">
                    <p className="text-sm font-semibold">Telephone Number</p>
                  </div>
                  <div className="py-3">
                    <p className="col-span-2 text-sm">
                      {selectedAsset.phone_no.toString() ?? "NO DATA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </></pre>
      </Modal> */}

      {details !== null ? (
        <Modal
          title={editable ? "Update Vendor Record" : "Vendor Record"}
          isVisible={updateRecord}
          setIsVisible={setUpdateRecord}
          className="max-w-[57rem]"
        >
          <UpdateVendorModal
            vendor={details as VendorType}
            setIsVisible={setUpdateRecord}
          />
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default VendorTable
