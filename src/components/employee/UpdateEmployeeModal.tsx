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

export const UpdateEmployeeModal = (props: {
  employee: EmployeeType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [searchValue, onSearchChange] = useState<string>(
    props.employee?.teamId?.toString() ?? "0"
  )
  const [workModeValue, onSearchWorkMode] = useState<string>(
    props.employee?.workMode?.toString() ?? " "
  )
  const [workStationValue, onSearchWorkStation] = useState<string>(
    props.employee?.workStation?.toString() ?? " "
  )
  const utils = trpc.useContext()
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)

  const { data: teams } = trpc.team.findAll.useQuery()
  const { editable, setEditable } = useEditableStore()

  const teamList = useMemo(() => {
    const list = teams?.teams.map(
      (team: { id: { toString: () => any }; name: any }) => {
        return { value: team.id.toString(), label: team.name }
      }
    ) as SelectValueType[]
    return list ?? []
  }, [teams]) as SelectValueType[]

  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.edit.useMutation({
    onSuccess() {
      console.log("omsim")
      // invalidate query of asset id when mutations is successful
      setIsVisible(true)
      utils.employee.findAll.invalidate()
      setImage([])
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Employee>({
    resolver: zodResolver(EmployeeEditInput),
  })

  useEffect(() => reset(props.employee as Employee), [props.employee, reset])

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    setEditable(false)
    console.log("editable na dapat ito 9999", editable, "udpated na dapat ito", updated)
  }, [])

  const onSubmit = async (employee: Employee) => {
    // Register function
    mutate({
      ...employee,
      name: `${employee.profile?.first_name} ${employee.profile?.last_name}`,
    })
    reset()
  }

  const handleDelete = () => {
    setOpenModalDel(true)
  }

  const handleEditable = () => {
    setIsEditable(true)
  }

  const handleIsEditable = () => {
    if (!updated) {
      setEditable(true)
      setUpdated(true)
    }

  }

  const { selectedEmp, setSelectedEmp } = useSelectedEmpStore()


  // useEffect(() => { console.log("department: " + props.employee?.team?.department?.name) })

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
                  <p className="font-medium">{selectedEmp?.profile?.first_name}</p>
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
                    {props.employee?.team?.name === null ? "--" : props.employee?.team?.name === undefined ? "--" : props.employee?.team?.name === "" ? "--" : props.employee?.team?.name}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Department</p>
                  <p className="font-medium">
                    {/* {props.asset?.parentId !== 0 */}
                    {/* // ? props.asset?.parent?.name */}
                    {/* // : "--"} */}
                    {props.employee?.team?.department?.name === null ? "--" : props.employee?.team?.department?.name === undefined ? "--" : props.employee?.team?.department?.name === "" ? "--" : props.employee?.team?.department?.name}
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
                <div className="col-span-1">
                  <p className="font-light">Address</p>
                  <p className="font-medium flex">
                    {/* {props.asset?.management?.asset_lifetime */}
                    {/* // ? props.asset?.management?.asset_lifetime
                      // : "--"}{" "} */}
                    {props.employee?.address?.street ?? "--"}

                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-light">Project</p>
                  <p className="font-medium">
                    {/* {props.asset?.project?.name ?? "--"} */}
                  </p>
                </div>
              </section>
              <section className="grid grid-cols-4">
                <div className="col-span-1">
                  <p className="font-light">Description</p>
                  <p className="font-medium">
                    {/* {props.asset?.description ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Remarks</p>
                  <p className="font-medium">
                    {/* {props.asset?.remarks ?? "--"} */}
                  </p>
                </div>
              </section>
            </div>
          </section>
          {/* General information */}
          <section className="border-b pb-4">
            <p className="text-base font-medium text-neutral-600">
              General Information
            </p>
            <div className="mt-4 flex flex-col gap-4 text-sm">
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="font-light">Employee ID</p>
                  <p className="font-medium">
                    {/* {props.asset?.custodian?.employee_id ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Name</p>
                  <p className="font-medium">
                    {/* {props.asset?.custodian?.name ?? "--"} */}
                  </p>
                </div>

                <div className="col-span-1">
                  <p className="font-light">Position</p>
                  <p className="font-medium">
                    {/* {props.asset?.custodian?.position ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Team</p>
                  <p className="font-medium">
                    {/* {props.asset?.department?.teams[ */}
                    {/* // props.asset?.custodian?.teamId ?? 0 */}
                    {/* // ]?.name ?? "--"} */}
                  </p>
                </div>
              </section>
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="font-light">Company</p>
                  <p className="font-medium">
                    {/* {props.asset?.department?.company?.name !== "" */}
                    {/* // ? props.asset?.department?.company?.name */}
                    {/* // : "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Location</p>
                  <p className="font-medium">
                    {/* {props.asset?.department?.location?.floor} floor */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Department</p>
                  <p className="font-medium">
                    {/* {props.asset?.department?.name} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Asset Location</p>
                  <p className="font-medium truncate w-[70%]">
                    {/* {props.asset?.management?.asset_location} */}
                  </p>
                </div>
              </section>
              {/* <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Asset Location</p>
                                            <p className="font-medium">{props.asset?.management?.asset_location}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Class</p>
                                            <p className="font-medium">{props.asset?.model?.class?.name ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Category</p>
                                            <p className="font-medium">{props.asset?.model?.category?.name ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Type</p>
                                            <p className="font-medium">{props.asset?.model?.type?.name ?? "--"}</p>
                                        </div>
                                    </section> */}
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="font-light">Purchase Order </p>
                  <p className="font-medium">
                    {/* {props.asset?.purchaseOrder ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Invoice Number</p>
                  <p className="font-medium">
                    {/* {props.asset?.invoiceNum ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Currency</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.currency ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Accounting Method</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.accounting_method ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Purchase Date</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.purchase_date */}
                    {/* // ? props.asset?.management?.purchase_date?.toLocaleDateString() */}
                    {/* // : "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Status</p>
                  <p className="font-medium">
                    {/* {props.asset?.deployment_status ?? "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Work Mode</p>
                  <p className="font-medium">
                    {/* {props.asset?.custodian?.workMode ?? "--"} */}
                  </p>
                </div>
              </section>
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="font-light">Depreciation Start Date</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.depreciation_start
                      ? props.asset?.management?.depreciation_start?.toLocaleDateString()
                      : "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Depreciation End Date</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.depreciation_end
                      ? props.asset?.management?.depreciation_end?.toLocaleDateString()
                      : "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Depreciation Method</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.depreciation_rule ?? "--"} */}
                  </p>
                </div>
              </section>
            </div>
          </section>
          <section className="border-b pb-4">
            <p className="text-base font-medium text-neutral-600">
              Asset Usage
            </p>
            <div className="mt-4 flex flex-col gap-4 text-sm">
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="font-light">Date of Usage</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.depreciation_start
                      ? props.asset?.management?.depreciation_start?.toLocaleDateString()
                      : "--"} */}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Period</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.depreciation_period ?? "--"}{" "} */}
                    Months
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="font-light">Quantity</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.asset_quantity ?? "--"} Units */}
                  </p>
                </div>
              </section>
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="font-light">Comments</p>
                  <p className="font-medium">
                    {/* {props.asset?.management?.remarks ?? "--"} */}
                  </p>
                </div>
              </section>
            </div>
          </section>
          <section className="pb-4 flex flex-row-reverse">
            <Link href="/employees/update">
              <div className="flex w-[20%]  cursor-pointer items-center gap-2 rounded-md bg-[#555555] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
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
          <div>You are about delete this item with employee name: {props.employee?.name}</div>
          <p className="text-neutral-500">
            <i className="fa-regular fa-circle-exclamation" /> Please carefully review the action before deleting.
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
