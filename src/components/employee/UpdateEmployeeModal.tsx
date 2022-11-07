import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
//import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select } from "@mantine/core"
//import DropZoneComponent from "../dropzone/DropZoneComponent"
import { EmployeeEditInput } from "../../server/common/schemas/employee"
import { ImageJSON } from "../../types/table"
import DropZoneComponent from "../dropzone/DropZoneComponent"

export type Employee = z.infer<typeof EmployeeEditInput>

export const UpdateEmployeeModal = (props: {
    employee: Employee
    // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
    // images: ImageJSON[]
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    // isLoading: boolean
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [searchValue, onSearchChange] = useState<string>(props.employee.department ?? "")
    const [date, setDate] = useState(props.employee.hired_date ?? new Date())
    const utils = trpc.useContext()
    const [images, setImage] = useState<ImageJSON[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { mutate, isLoading: employeeLoading, error } = trpc.employee.edit.useMutation({
        onSuccess() {
            // invalidate query of asset id when mutations is successful
            utils.employee.findAll.invalidate()
            props.setIsVisible(false)
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

    useEffect(() => reset(props.employee), [props.employee, reset])

    const onSubmit = async (employee: Employee) => {
        // Register function
        mutate({
            ...employee,
            name: `${employee.profile?.first_name} ${employee.profile?.last_name}`,
            image: images[0]?.file ?? ""
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
                        <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>

                    </div>
                    <div className="flex w-[32%] flex-col">
                        <label className="sm:text-sm">Middle Name (Optional)</label>
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
                        <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>

                    </div>
                </div>

                <div className="flex flex-wrap gap-4 py-2.5">
                    <div className="flex w-[32%] flex-col">
                        <label className="sm:text-sm">Departments</label>
                        <Select
                            onChange={(value) => {
                                setValue("department", value)
                                onSearchChange(value ?? "")
                            }}
                            value={searchValue}
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
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-[.28%] px-0  text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                        />
                        <AlertInput>{errors?.department?.message}</AlertInput>

                    </div>
                    <div className="flex w-[32%] flex-col">
                        <label className="sm:text-sm">Employee Number</label>
                        {/* <InputField
              className="focus-outline appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              type={"text"}
              label={""}
              name={"employee_id"}
              register={register}
            /> */}
                        <p className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-[3.23%] px-0  text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                        >{`${props.employee.employee_id}`}</p>
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
                            value={date}
                            onChange={(value) => {
                                setValue("hired_date", value)
                                value === null ? setDate(new Date()) : setDate(value);
                            }}
                            className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-[.28%] px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
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
                            type={"number"}
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

                            <AlertInput>{errors?.address?.city?.message}</AlertInput>
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

                <DropZoneComponent
                    setImage={setImage}
                    setIsLoading={setIsLoading}
                    images={images}
                    isLoading={isLoading}
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
