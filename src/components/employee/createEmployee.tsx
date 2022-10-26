import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { EmployeeCreateInput } from "../../server/common/schemas/employee"
import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select, Loader, Image, Text } from "@mantine/core"

export type Employee = z.infer<typeof EmployeeCreateInput>

export const CreateEmployeeModal = (props: {
  value: Date
  setImage: React.Dispatch<React.SetStateAction<ImageJSON>>
  image: ImageJSON
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}) => {
  const [searchValue, onSearchChange] = useState("")
  const { mutate, isLoading, error } = trpc.employee.create.useMutation()
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
      department: "",
      email: "omsim@omsim.com",
      hired_date: new Date(),
      image: "",
      position: "",
      subsidiary: "",
      address: {
        billing_address: "",
        shipping_address: "",
        city: "",
        country: "",
        street: "",
        zip: "",
      },
      profile: {
        first_name: "",
        middle_name: "",
        last_name: "",
      },
    },
  })

  const onSubmit = async (employee: Employee) => {
    // Register function

    mutate({
      name: `${employee.profile.first_name} ${employee.profile.last_name}`,
      employee_id: employee.employee_id,
      email:
        (employee.profile.first_name[0] + employee.profile.last_name)
          .replace(" ", "")
          .toLowerCase()
          .toString() + "@omsim.com",
      department: employee.department,
      hired_date: employee.hired_date,
      image: employee.image,
      position: employee.position,
      subsidiary: employee.subsidiary,
      address: {
        billing_address: employee.address?.billing_address,
        shipping_address: employee.address?.shipping_address,
        city: employee.address?.city,
        country: employee.address?.country,
        street: employee.address?.street,
        state: employee.address?.state,
        zip: employee.address?.zip,
      },
      profile: {
        first_name: employee.profile.first_name,
        middle_name: employee.profile.middle_name,
        last_name: employee.profile.last_name,
        phone_no: employee.profile.phone_no,
      },
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
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Middle Name</label>
            <InputField
              className="0 appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"profile.middle_name"}
              register={register}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Last Name</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"profile.last_name"}
              register={register}
            />
          </div>
        </div>

        <AlertInput>{errors?.name?.message}</AlertInput>
        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Departments</label>
            {/* <input
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
            /> */}
            <Select
              placeholder="Pick one"
              searchable
              onSearchChange={(value) => {
                setValue("department", value)
                onSearchChange(value)
              }}
              searchValue={searchValue}
              nothingFound="No options"
              data={["Human Resource", "Finance", "Accounting", "IT", "Admin"]}
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
              className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Employee Number</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"employee_id"}
              register={register}
            />

            <AlertInput>{errors?.employee_id?.message}</AlertInput>
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Designation / Position</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"position"}
              register={register}
            />

            <AlertInput>{errors?.position?.message}</AlertInput>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex flex-col sm:w-1/3 md:w-[32%]">
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
              value={props.value}
              onChange={(value) => {
                setValue("hired_date", value)
              }}
              className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Subsidiary</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"subsidiary"}
              register={register}
            />

            <AlertInput>{errors?.subsidiary?.message}</AlertInput>
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Mobile Number</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"profile.phone_no"}
              register={register}
            />

            <AlertInput>{errors?.profile?.phone_no?.message}</AlertInput>
          </div>
          <div className="flex w-full flex-wrap gap-4 py-2.5">
            <div className="flex w-[18%] flex-col">
              <label className="sm:text-sm">Street</label>
              <InputField
                className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
                type={"text"}
                label={""}
                name="address.street"
                register={register}
              />
            </div>
            <div className="flex w-[18%] flex-col">
              <label className="sm:text-sm">Barangay</label>
              <InputField
                className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
                type={"text"}
                label={""}
                name={"address.state"}
                register={register}
              />

              <AlertInput>{errors?.address?.state?.message}</AlertInput>
            </div>
            <div className="flex w-[18%] flex-col">
              <label className="sm:text-sm">City</label>
              <InputField
                className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
                type={"text"}
                label={""}
                name={"address.city"}
                register={register}
              />
            </div>
            <div className="flex w-[18%] flex-col">
              <label className="sm:text-sm">Zip Code</label>
              <InputField
                className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
                type={"text"}
                label={""}
                name={"address.zip"}
                register={register}
              />
              <AlertInput>{errors?.address?.zip?.message}</AlertInput>
            </div>
            <div className="flex w-[18%] flex-col">
              <label className="sm:text-sm">Country</label>
              <InputField
                className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
                type={"text"}
                label={""}
                name={"address.country"}
                register={register}
              />

              <AlertInput>{errors?.address?.country?.message}</AlertInput>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[48%] flex-col">
            <label className="sm:text-sm">Billing Address</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"address.billing_address"}
              register={register}
            />

            <AlertInput>{errors?.address?.billing_address?.message}</AlertInput>
          </div>
          <div className="flex w-[48%] flex-col">
            <label className="sm:text-sm">Shipping Address</label>
            <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"address.shipping_address"}
              register={register}
            />

            <AlertInput>
              {errors?.address?.shipping_address?.message}
            </AlertInput>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 py-2.5 px-5 ">
          <div className="w-[48%] rounded-md border bg-white drop-shadow-2xl">
            <div className="p-5">
              {/* <DropZoneComponent
                setImage={props.setImage}
                setIsLoading={props.setIsLoading}
                setValue={setValue}
              /> */}
            </div>
          </div>
          <div className="flex w-[48%] flex-wrap content-center rounded-md border bg-white drop-shadow-2xl">
            <div className="flex  w-full items-center justify-center">
              {props.isLoading === true ? (
                <Loader color="orange" variant="bars" className="self-center" />
              ) : props.image.file === "" ? (
                <Image
                  height={120}
                  width={200}
                  src="42.png"
                  alt="With custom placeholder"
                  withPlaceholder
                  placeholder={<Text align="center">This image </Text>}
                ></Image>
              ) : (
                <div className="flex flex-row gap-4">
                  <Image
                    radius="md"
                    src={props.image.file}
                    alt="Image"
                    width={135}
                    height={135}
                    withPlaceholder
                  />
                  <div className="flex flex-col p-5">
                    <text>{props.image.name}</text>
                    <text>{props.image.size} mb</text>
                  </div>
                </div>
              )}
            </div>
            <div className=""></div>
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
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
