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
import { useEditableStore } from "../../store/useStore"
import Modal from "../headless/modal/modal"
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
  const [date, setDate] = useState(props.employee?.hired_date ?? new Date())
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


  // useEffect(() => { console.log("department: " + props.employee?.team?.department?.name) })

  return (
    <div>
      <div className="flex w-full flex-row-reverse">
        <div className="flex items-center space-x-1 align-middle ">
          <p className="text-xs uppercase text-gray-500">edit form </p>
          <i
            className="fa-light fa-pen-to-square cursor-pointer"
            onClick={() => {
              handleIsEditable()
              handleEditable()
            }}
          />
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
          <div className="flex flex-col sm:w-1/3 md:w-[25%]">
            <label className="sm:text-sm ">Hired Date</label>
            {/* <InputField
            className= appearance-none border  border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-outline"
            type={"text"}
          /> */}
            <DatePicker
              disabled={!isEditable}
              dropdownType="modal"
              placeholder="Pick Date"
              size="sm"
              variant="unstyled"
              value={date}
              onChange={(value) => {
                setValue("hired_date", value)
                value === null ? setDate(new Date()) : setDate(value)
              }}
              className={
                isEditable
                  ? "my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
          </div>

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
                name={"address.state"}
                disabled={!isEditable}
                register={register}
              />


              <AlertInput>{errors?.address?.state?.message}</AlertInput>
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
