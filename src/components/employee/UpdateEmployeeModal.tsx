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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">First Name</label>
            <InputField
              disabled={!isEditable}
              register={register}
              name="profile.first_name"
              type={"text"}
              label={""}
            />
            <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Middle Name (Optional)</label>
            <InputField
              // className="0 appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"profile.middle_name"}
              register={register}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Last Name</label>
            <InputField
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"profile.last_name"}
              register={register}
            />
            <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Team</label>
            <Select
              disabled={!isEditable}
              placeholder="Pick one"
              onChange={(value) => {
                setValue("teamId", Number(value) ?? 0)
                onSearchChange(value ?? "0")
              }}
              value={searchValue}
              data={teamList}
              styles={(theme) => ({
                item: {
                  // applies styles to selected item
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.orange[3]
                          : theme.colors.orange[1],
                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                    },
                  },

                  // applies styles to hovered item (with mouse or keyboard)
                  "&[data-hovered]": {},
                },
              })}
              variant="unstyled"
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
            {/* <AlertInput>{errors?.team?.name?.message}</AlertInput> */}
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Employee Number</label>
            {/* <InputField
               
              type={"text"}
              label={""}
              name={"employee_id"}
              register={register}
            /> */}
            <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >{`${props.employee?.employee_id}`}</p>
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Designation / Position</label>
            <InputField
              type={"text"}
              disabled={!isEditable}
              label={""}
              // placeholder={props.employee?.}
              name={"position"}
              register={register}
            />

            <AlertInput>{errors?.position?.message}</AlertInput>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Email</label>
            <InputField
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"email"}
              register={register}
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Departmemt</label>
            {/* <InputField
              // placeholder={props.employee?.department}
              type={"text"}
              disabled={!editable}
              label={""}
              placeholder={props.employee?.team?.department?.name}
              name={"department"}
              register={register}
            /> */}
            <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >{`${props.employee?.team?.department?.name}`}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">


          <div className="flex w-[23%] flex-col">
            <label className="mb-2 sm:text-sm">Mobile Number</label>
            <input
              disabled={!isEditable}
              type="number"
              pattern="[0-9]*"
              defaultValue={props.employee?.profile?.phone_no ?? "--"}
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
              onKeyDown={(e) => {
                if (e.key === "e") {
                  e.preventDefault()
                }
              }}
              onChange={(event) => {
                if (event.target.value.length > 11) {
                  console.log("more than 11")
                  event.target.value = event.target.value.slice(0, 11)
                }
                setValue(
                  "profile.phone_no",
                  event.currentTarget.value.toString()
                )
              }}
            />

            <AlertInput>{errors?.profile?.phone_no?.message}</AlertInput>
          </div>
          <div className="flex w-[23%] flex-col">
            <label className="sm:text-sm">Device</label>
            <Select
              disabled={!isEditable}
              onChange={(value) => {
                setValue("workStation", String(value) ?? " ")
                onSearchWorkStation(value ?? "")
              }}
              placeholder="--"
              value={workStationValue}
              defaultValue={props.employee?.workStation ?? "--"}
              data={["Desktop", "Latop"]}
              styles={(theme) => ({
                item: {
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.orange[3]
                          : theme.colors.orange[1],
                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                    },
                  },
                  // applies styles to hovered item (with mouse or keyboard)
                  "&[data-hovered]": {},
                },
              })}
              variant="unstyled"
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-0.5 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
          </div>
          <div className="flex w-[23%] flex-col">
            <label className="sm:text-sm">Work Mode</label>
            <Select
              disabled={!isEditable}
              onChange={(value) => {
                setValue("workMode", String(value) ?? "")
                onSearchWorkMode(value ?? "")
              }}
              value={workModeValue}
              placeholder="--"
              data={["WFH", "Hybrid", "On Site"]}
              defaultValue={props.employee?.workMode ?? "--"}
              styles={(theme) => ({
                item: {
                  // applies styles to selected item
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.orange[3]
                          : theme.colors.orange[1],
                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                    },
                  },

                  // applies styles to hovered item (with mouse or keyboard)
                  "&[data-hovered]": {},
                },
              })}
              variant="unstyled"
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-0.5 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
          </div>
          <div className="flex w-full flex-wrap gap-4 py-2.5">
            <div className="flex w-[25%] flex-col">
              <label className="sm:text-sm">Street</label>
              <InputField
                type={"text"}
                label={""}
                name="address.street"
                register={register}
                disabled={!isEditable}
              />
            </div>
            {/* <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Barangay</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.region"}
                disabled={!isEditable}
                register={register}
              />


              <AlertInput>{errors?.address?.region?.message}</AlertInput>
            </div> */}
            <div className="flex w-[25%] flex-col">
              <label className="sm:text-sm">City</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.city"}
                disabled={!isEditable}
                register={register}
              />

              <AlertInput>{errors?.address?.city?.message}</AlertInput>
            </div>
            <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Zip Code</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.zip"}
                disabled={!isEditable}
                register={register}
              />
              <AlertInput>{errors?.address?.zip?.message}</AlertInput>
            </div>
            <div className="flex w-[25%] flex-col">
              <label className="sm:text-sm">Country</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.country"}
                disabled={!isEditable}
                register={register}
              />

              <AlertInput>{errors?.address?.country?.message}</AlertInput>
            </div>
          </div>
        </div>

        {isEditable && (
          <DropZoneComponent
            setImage={setImage}
            setIsLoading={setIsLoading}
            images={images}
            isLoading={isLoading}
            acceptingMany={false}
            setIsVisible={props.setIsVisible}
          />
        )}
        <hr className="w-full"></hr>
        {/* <div className="flex w-full justify-end">
          {isEditable && <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={employeeLoading}
          >
            {employeeLoading ? "Loading..." : "Save"}
          </button>}
        </div> */}
        <div className="flex w-full justify-between">
          {!(
            error &&
            errors && (
              <pre className="mt-2 text-sm italic text-red-500">
                Something went wrong!
              </pre>
            )
          ) ? (
            <div></div>
          ) : (
            error &&
            errors && (
              <pre className="mt-2 text-sm italic text-red-500">
                Something went wrong!
              </pre>
            )
          )}
          {isEditable && (
            <div className="space-x-1">
              <button
                type="button"
                className="rounded bg-red-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  handleDelete(), setIsLoading(true)
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Delete"}
              </button>

              <button
                type="submit"
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={employeeLoading}
              >
                {employeeLoading ? "Loading..." : "Save"}
              </button>
            </div>
          )}
          <EmployeeDeleteModal
            employee={props.employee}
            openModalDel={openModalDel}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setOpenModalDel={setOpenModalDel}
            setIsVisible={props.setIsVisible}
          />
        </div>
      </form>
      <Modal
        className="max-w-lg"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title="NOTICE!"
      >
        <>
          <div className="py-2 items-center flex flex-col gap-3 ">
            <p className="text-center text-lg font-semibold ">
              Employee Updated Successfully
            </p>
            <button
              className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                props.setIsVisible(false)
                setIsVisible(false)
              }}
            >
              Confirm
            </button>
          </div>
        </>
      </Modal>
      {/* {error && errors && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
        </pre>
      )} */}
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
