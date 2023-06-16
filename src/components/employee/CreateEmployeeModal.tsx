import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { EmployeeCreateInput } from "../../server/schemas/employee"
import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select } from "@mantine/core"
import DropZoneComponent from "../dropzone/DropZoneComponent"
import { env } from "../../env/client.mjs"
import moment from "moment"
import TypeSelect, { SelectValueType } from "../atoms/select/TypeSelect"

export type Employee = z.infer<typeof EmployeeCreateInput>

export const CreateEmployeeModal = (props: {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  images: ImageJSON[]
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [searchValue, onSearchChange] = useState("")
  const [workModeValue, onSearchWorkMode] = useState("")
  const [workStationValue, onSearchWorkStation] = useState("")

  const [empId] = useState<string>(moment().format("YY-MDhms"))
  const { data: teams } = trpc.team.findAll.useQuery()
  const utils = trpc.useContext()
  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.create.useMutation({
    onSuccess: () => {
      utils.employee.findAll.invalidate()
      props.setIsVisible(false)
      props.setImage([])
    },
  })

  const teamList = useMemo(() => {
    const list = teams?.teams.map((team) => {
      return { value: team.id.toString(), label: team.name }
    }) as SelectValueType[]
    return list ?? []
  }, [teams]) as SelectValueType[]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Employee>({
    resolver: zodResolver(EmployeeCreateInput),
    defaultValues: {
      name: "",
      employee_id: "",
      // supervisee: {
      //   name: ""
      // },
      // superviseeId: 0,
      teamId: 0,
      email: "",
      hired_date: new Date(),
      position: "",
      address: {
        city: "",
        country: "",
        street: "",
        zip: "",
      },
      profile: {
        first_name: "",
        middle_name: "",
        last_name: "",
        image: "",
      },
    },
  })

  const onSubmit = async (employee: Employee) => {
    // Register function

    mutate({
      name: `${employee.profile.first_name} ${employee.profile.last_name}`,
      employee_id: `${env.NEXT_PUBLIC_CLIENT_EMPLOYEE_ID}${empId}`,
      email: employee.email,
      //   (employee.profile.first_name[0] + employee.profile.last_name)
      //     .replace(" ", "")
      //     .toLowerCase()
      //     .toString() + env.NEXT_PUBLIC_CLIENT_EMAIL,
      hired_date: employee.hired_date,
      teamId: employee.teamId,
      // supervisee: {
      //   name: employee.supervisee?.name ?? ""
      // },
      // superviseeId: employee.superviseeId,
      position: employee.position,
      address: {
        city: employee.address?.city,
        country: employee.address?.country,
        street: employee.address?.street,
        // state: employee.address?.state,
        zip: employee.address?.zip,
      },
      profile: {
        first_name: employee.profile.first_name,
        middle_name: employee.profile.middle_name,
        last_name: employee.profile.last_name,
        phone_no: employee.profile.phone_no,
        image: props.images[0]?.file ?? "",
      },
      workMode: employee.workMode,
      workStation: employee.workStation,
    })
    reset()
  }

  return (
    <div>
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

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Team</label>
            <Select
              placeholder="Pick one"
              onChange={(value) => {
                setValue("teamId", Number(value) ?? 0)
                onSearchChange(value ?? "")
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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Employee Number</label>
            {/* <InputField
               
              type={"text"}
              label={""}
              name={"employee_id"}
              register={register}
            /> */}
            <p className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2">{`${env.NEXT_PUBLIC_CLIENT_EMPLOYEE_ID}${empId}`}</p>
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Designation / Position</label>
            <InputField
              type={"text"}
              label={""}
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
              // disabled={!editable}
              type={"text"}
              label={""}
              name={"email"}
              register={register}
              placeholder={"--@email.com"}
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Department</label>
            {/* <InputField
              // placeholder={props.employee?.department}
              type={"text"}
              // disabled={!editable}
              label={""}
              value={props.employee?.team?.department?.name}
              name={"department"}
              register={register}
            /> */}
            <p className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2">
              {"--"}
            </p>
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
              dropdownType="popover"
              placeholder="Pick Date"
              size="sm"
              variant="unstyled"
              value={props.date}
              onChange={(value) => {
                setValue("hired_date", value)
                value === null
                  ? props.setDate(new Date())
                  : props.setDate(value)
              }}
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex w-[23%] flex-col">
            <label className="mb-2 sm:text-sm">Mobile Number</label>
            <input
              type="number"
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
              placeholder="Select Work Location"
              onChange={(value) => {
                setValue("workStation", String(value) ?? " ")
                onSearchWorkStation(value ?? " ")
              }}
              value={workStationValue}
              data={["Desktop", "Latop"]}
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
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex w-[23%] flex-col">
            <label className="sm:text-sm">Work Mode</label>
            <Select
              placeholder="Select your Work mode"
              onChange={(value) => {
                setValue("workMode", String(value) ?? " ")
                onSearchWorkMode(value ?? " ")
              }}
              value={workModeValue}
              data={["WFH", "Hybrid", "On-Site"]}
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
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
              /><AlertInput>{errors?.address?.state?.message}</AlertInput>
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

        <DropZoneComponent
          setImage={props.setImage}
          setIsLoading={props.setIsLoading}
          images={props.images}
          isLoading={props.isLoading}
          acceptingMany={false}
        />
        <hr className="w-full"></hr>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={employeeLoading}
          >
            {employeeLoading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
      {error && errors && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
          {JSON.stringify({ error, errors }, null, 2)}
        </pre>
      )}
    </div>
  )
}
