import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
//import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select } from "@mantine/core"
//import DropZoneComponent from "../dropzone/DropZoneComponent"
import { EmployeeEditInput } from "../../server/schemas/employee"
import { ImageJSON } from "../../types/table"
import DropZoneComponent from "../dropzone/DropZoneComponent"
import { SelectValueType } from "../atoms/select/TypeSelect"
import { EmployeeType } from "../../types/generic"
import { useEditableStore, useSelectedEmpStore } from "../../store/useStore"
import Modal from "../headless/modal/modal"
import Link from "next/link"

// import { useEditableStore } from "../../store/useStore"

export type Employee = z.infer<typeof EmployeeEditInput>

export const EmployeeDetailsModal = (props: {
  employee: EmployeeType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {


  const address = () => {
    return props.employee?.address?.country !== null ??
      props.employee?.address?.country !== ""
      ? props.employee?.address?.country === "Philippines"
        ? (props.employee?.address?.street ? (props.employee?.address?.street + ", ") : "") +
        (props.employee?.address?.baranggay ? (props.employee?.address?.baranggay + ", ") : "") +
        (props.employee?.address?.city ? (props.employee?.address?.city + ", ") : "") +
        (props.employee?.address?.province ? (props.employee?.address?.province + ", ") : "") +
        (props.employee?.address?.region ? (props.employee?.address?.region + ", ") : "") +
        (props.employee?.address?.country ? (props.employee?.address?.country + ", ") : "") +
        (props.employee?.address?.zip ?? "")
        :
        (props.employee?.address?.street ? (props.employee?.address?.street + ", ") : "") +
        (props.employee?.address?.city ? (props.employee?.address?.city + ", ") : "") +
        (props.employee?.address?.province ? (props.employee?.address?.province + ", ") : "") +
        (props.employee?.address?.country ? (props.employee?.address?.country + ", ") : "") +
        (String(props.employee?.address?.zip) ?? "")
      : "--"
  }

  const { selectedEmp, setSelectedEmp } = useSelectedEmpStore()


  return (
    <div className="">
      <div className="flex w-full text-sm text-light-primary">
        <div className="flex w-full flex-col gap-2">
          {/* asset information */}
          <section className="border-b pb-4">
            <p className="text-base font-medium text-neutral-600">
              Personal Information
            </p>
            <div className="mt-4 flex flex-col gap-4 text-sm">
              <section className="grid grid-cols-4">
                <div className="col-span-1">
                  <p className="font-light">First Name</p>
                  <p className="font-medium">
                    {selectedEmp?.profile?.first_name}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Middle Name</p>
                  <p className="font-medium">
                    {props.employee?.profile?.middle_name ?? "--"}
                    {/* {props.asset?.alt_number !== "" */}
                    {/* // ? props.asset?.alt_number */}
                    {/* // : "No Alternate Number"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Last Name</p>
                  <p className="font-medium">
                    {props.employee?.profile?.last_name}
                  </p>
                  {/* <p className="font-medium">{props.asset?.name}</p> */}
                </div>
                <div className="col-span-1">
                  <p className="font-light"></p>
                  <p className="font-medium">
                    {/* {props.asset?.serial_no !== "" */}
                    {/* // ? props.asset?.serial_no */}
                    {/* // : "--"} */}
                  </p>
                </div>
              </section>
              <section className="grid grid-cols-4">
                <div className="col-span-1">
                  <p className="font-light">Employee Number</p>
                  <p className="font-medium">
                    {/* {props.asset?.model?.name */}
                    {/* // ? props.asset?.model?.name
                      // : "--"} */}
                    {props.employee?.employee_id}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Team</p>
                  <p className="font-medium">
                    {/* {props.asset?.parentId !== 0 */}
                    {/* // ? props.asset?.parent?.name */}
                    {/* // : "--"} */}
                    {props.employee?.team?.name === null
                      ? "--"
                      : props.employee?.team?.name === undefined
                        ? "--"
                        : props.employee?.team?.name === ""
                          ? "--"
                          : props.employee?.team?.name}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Department</p>
                  <p className="font-medium">
                    {/* {props.asset?.parentId !== 0 */}
                    {/* // ? props.asset?.parent?.name */}
                    {/* // : "--"} */}
                    {props.employee?.team?.department?.name === null
                      ? "--"
                      : props.employee?.team?.department?.name === undefined
                        ? "--"
                        : props.employee?.team?.department?.name === ""
                          ? "--"
                          : props.employee?.team?.department?.name}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Designation / Position</p>
                  <p className="font-medium">
                    {/* {props.asset?.model?.brand */}
                    {/* // ? props.asset?.model?.brand
                      // : "--"} */}
                    {props.employee?.position ?? "--"}
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-4">
                <div className="col-span-1">
                  <p className="font-light">Email</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.currency}{" "} */}
                    {/* {props.asset?.management?.original_cost ?? 
                      "no information"}*/}
                    {props.employee?.email ?? "--"}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Mobile Number</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.currency}{" "}
                    {props.asset?.management?.current_cost ??
                      "no information"} */}
                    {props.employee?.profile?.phone_no ?? "--"}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Work Station</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.currency}{" "} */}
                    {/* {props.asset?.management?.residual_value ?? */}
                    {/* // "no information"} */}
                    {props.employee?.workStation ?? "--"}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Work Mode</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.residual_percentage ?? "--"}% */}
                    {props.employee?.workMode ?? "--"}
                  </p>
                </div>
              </section>
              <section className="grid grid-cols-4">
                <div className="col-span-4">
                  <p className="font-light">Address</p>
                  <p className="flex font-medium">
                    {/* {props.asset?.management?.asset_lifetime */}
                    {/* // ? props.asset?.management?.asset_lifetime
                      // : "--"}{" "} */}
                    {address()}
                  </p>
                </div>
              </section>
            </div>
          </section>
          <section className="flex flex-row-reverse pt-4">
            <Link href="/employees/update">
              <div className="flex w-[20%]  cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                <i className={"fa-solid fa-pen-to-square"} />
                Edit
              </div>
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
export const EmployeeDeleteModal = (props: {
  employee: EmployeeType
  openModalDel: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  //trpc utils for delete
  const utils = trpc.useContext()

  const { mutate } = trpc.employee.delete.useMutation({
    onSuccess() {
      console.log()
      props.setOpenModalDel(false)
      props.setIsLoading(false)
      props.setIsVisible(false)
      utils.employee.findAll.invalidate()
      // window.location.reload()
    },
  })
  const handleDelete = async () => {
    mutate({
      id: props.employee?.id ?? -1,
    })
  }

  return (
    <Modal
      className="max-w-2xl"
      title="Delete Employee"
      isVisible={props.openModalDel}
      setIsVisible={props.setOpenModalDel}
    >
      <div className="m-4 flex flex-col ">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            You are about delete this item with employee name:{" "}
            {props.employee?.name}
          </div>
          <p className="text-neutral-500">
            <i className="fa-regular fa-circle-exclamation" /> Please carefully
            review the action before deleting.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-sm bg-gray-300 px-5 py-1 hover:bg-gray-400"
              onClick={() => {
                props.setOpenModalDel(false)
                props.setIsLoading(false)
              }}
            >
              Cancel
            </button>
            <button
              className="rounded-sm bg-red-500 px-5 py-1 text-neutral-50 hover:bg-red-600"
              onClick={() => handleDelete()}
            // disabled={isLoading}
            >
              Yes, delete record
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
