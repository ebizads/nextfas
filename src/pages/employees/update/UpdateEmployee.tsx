import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import { EmployeeCreateInput, EmployeeEditInput } from "../../../server/schemas/employee"
import { ImageJSON } from "../../../types/table"
import { trpc } from "../../../utils/trpc"
import AlertInput from "../../../components/atoms/forms/AlertInput"
import InputField from "../../../components/atoms/forms/InputField"
import { Select } from "@mantine/core"
import { env } from "../../../env/client.mjs"
import moment from "moment"
import Modal from "../../../components/headless/modal/modal"
import { SelectValueType } from "../../../components/atoms/select/TypeSelect"
import DropZoneComponent from "../../../components/dropzone/DropZoneComponent"
import { EmployeeType } from "../../../types/generic"
// import { useEditableStore } from "../../../store/useStore"
import { useEditableStore, useSelectedEmpStore } from "../../../store/useStore"


export type Employee = z.infer<typeof EmployeeEditInput>
// export type Employee = z.infer<typeof EmployeeCreateInput>

export const UpdateEmployee = (props: {
  employee: EmployeeType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  // setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { selectedEmp, setSelectedEmp } = useSelectedEmpStore()

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

  console.log("ALAM MO TONG EMPLOYEE NA TO::::", props.employee)

  return (
    <main className="container mx-auto flex flex-col justify-center p-2">
      <h3 className="mb-2 bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text text-xl font-bold leading-normal text-transparent md:text-[2rem]">
        Update Employee Record
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">First Name</label>
            <InputField

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

              type={"text"}
              label={""}
              name={"profile.middle_name"}
              register={register}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Last Name</label>
            <InputField

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

              />
            </div>
            {/* <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Barangay</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.state"}
                
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

                register={register}
              />

              <AlertInput>{errors?.address?.country?.message}</AlertInput>
            </div>
          </div>
        </div>

        {/* {(
          <DropZoneComponent
            setImage={setImage}
            setIsLoading={setIsLoading}
            images={images}
            isLoading={isLoading}
            acceptingMany={false}
            setIsVisible={props.setIsVisible}
          />
        )} */}
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
                // props.setIsVisible(false)
                // setIsVisible(false)
              }}
            >
              Confirm
            </button>
          </div>
        </>
      </Modal>
      {error && errors && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
          {JSON.stringify({ error, errors }, null, 2)}
        </pre>
      )}
    </main>
  )
}

export default UpdateEmployee
