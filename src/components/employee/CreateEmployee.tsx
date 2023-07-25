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
import Modal from "../headless/modal/modal"
import TypeSelect, { SelectValueType } from "../atoms/select/TypeSelect"
import ph_regions from "../../json/ph_regions.json"
import all_countries from "../../json/countries.json"
import all_states from "../../json/states.json"
import all_cities from "../../json/cities.json"
import { set } from "lodash"

export type Employee = z.infer<typeof EmployeeCreateInput>

export const CreateEmployee = (props: {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  images: ImageJSON[]
  generateId: string
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [searchValue, onSearchChange] = useState("")
  const [workModeValue, onSearchWorkMode] = useState("")
  const [workStationValue, onSearchWorkStation] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [tryReset, setTryReset] = useState<boolean>(false)
  const [empId] = useState<string>(moment().format("YY-"))
  const { data: teams } = trpc.team.findAll.useQuery()
  const { data: allEmp } = trpc.employee.findAllNoLimit.useQuery()
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [barangay, setBarangay] = useState("")

  const utils = trpc.useContext()

  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.create.useMutation({
    onSuccess: () => {
      utils.employee.findAll.invalidate()
      setIsVisible(true)
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
      position: "",
      address: {
        city: "",
        country: "",
        street: "",
        zip: 0,
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
      name: `${employee.profile?.first_name ?? ""} ${employee.profile?.last_name ?? ""
        }`,
      employee_id:
        `${env.NEXT_PUBLIC_CLIENT_EMPLOYEE_ID}${empId}` +
        (String(employee.teamId).padStart(2, "0") + props.generateId),
      email: employee.email,
      //   (employee.profile.first_name[0] + employee.profile.last_name)
      //     .replace(" ", "")
      //     .toLowerCase()
      //     .toString() + env.NEXT_PUBLIC_CLIENT_EMAIL,
      teamId: employee.teamId,
      // supervisee: {
      //   name: employee.supervisee?.name ?? ""
      // },
      // superviseeId: employee.superviseeId,
      position: employee.position,
      address: {
        city: employee.address?.city,
        province: employee.address?.province,
        baranggay: employee.address?.baranggay,
        country: employee.address?.country,
        street: employee.address?.street,
        region: employee.address?.region,
        zip: employee.address?.zip,
      },
      profile: {
        first_name: employee.profile?.first_name ?? "",
        middle_name: employee.profile?.middle_name,
        last_name: employee.profile?.last_name ?? "",
        phone_no: employee.profile?.phone_no,
        image: props.images[0]?.file ?? "",
      },
      workMode: employee.workMode,
      workStation: employee.workStation,
    })
    reset()
  }
  const onDiscard = () => {
    props.setIsVisible(false)
    document.forms[0]?.reset()
    reset()
  }

  const filteredAllCountries = useMemo(() => {
    const countries = all_countries.map((countries) => { return countries.name })
    setCountry("")
    console.log("country", countries)
    return countries

  }, [])

  const filteredRegion = useMemo(() => {

    const upperLevel = Object.entries(ph_regions)
      .sort(([key1], [key2]) => {
        const num1 = parseInt(key1)
        const num2 = parseInt(key2)
        return num1 - num2
      })
      .map(([key]) => key)
    setRegion("")
    console.log("keys:", upperLevel)
    return upperLevel



  }, [])

  const filteredProvince = useMemo(() => {
    const newProvince: Array<string> = []
    if (country === "Philippines") {
      if (region === null ?? "") {
        setProvince("")

        return newProvince
      }
      const jsonData = ph_regions

      if (region) {
        const provinceLevel = Object.keys(
          (jsonData as Record<string, any>)[region].province_list
        )
        console.log("province", provinceLevel)
        setProvince("")

        return provinceLevel
      }
    } else {

      if (country) {
        const states = all_states
        console.log("states", all_states)
        const specStates = states.filter((states) => { return states.country_name === country })
        const finalStates = specStates.map((states) => { return states.name })
        if (finalStates.length === 0) {
          return newProvince
        }
        console.log("states:", specStates)
        return finalStates
      }
      return newProvince

    }
    setProvince("")

    return newProvince
  }, [country, region])

  const filteredCity = useMemo(() => {
    const newCity: Array<any> = []
    if (country === "Philippines") {
      if (province === null ?? "") {
        setCity("")

        return newCity
      }

      if (region && province) {
        const jsonData = (ph_regions as Record<string, any>)[region].province_list

        const cityLevel = Object.keys(
          (jsonData as Record<string, any>)[province].municipality_list
        )
        console.log("city", cityLevel)
        setCity("")

        return cityLevel
      }
    } else {
      if (province) {
        const cities = JSON.parse(JSON.stringify(all_cities))
        const specCities = cities.filter((city: { state_name: string }) => { return city.state_name === province })
        const finalCities = specCities.map((city: { name: string }) => { return city.name })
        console.log("cities", finalCities)
        setCity("")
        if (finalCities.length === 0) {
          return newCity
        }
        return finalCities
      }

    }
    setCity("")

    return newCity
  }, [country, province, region])

  const filteredBarangay = useMemo(() => {
    const newBarangay: Array<any> = []
    if (city === null ?? "") {
      setBarangay("")

      return newBarangay
    }

    if (region && province && city) {
      const jsonData = (ph_regions as Record<string, any>)[region].province_list
      const cityData = (jsonData as Record<string, any>)[province]
        .municipality_list
      const barangayLevel = (cityData as Record<string, any>)[city]
        .barangay_list
      console.log("city", barangayLevel)
      setBarangay("")

      return barangayLevel
    }
    setBarangay("")

    return newBarangay
  }, [region, province, city])

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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
            <p className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2">
              {`${env.NEXT_PUBLIC_CLIENT_EMPLOYEE_ID}${empId}${String(searchValue).padStart(2, "0") + props.generateId
                }`}
            </p>
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
            <p className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2">
              {"--"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[23%] flex-col">
            <label className="mb-2 sm:text-sm">Mobile Number</label>
            <input
              placeholder="--"
              type="number"
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-800 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
              data={["Desktop", "Laptop"]}
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
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
              value={workModeValue ?? ""}
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
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex w-full flex-wrap gap-3 py-2.5">
            <div className="flex w-[23%] flex-col">
              <label className="sm:text-sm">Country</label>
              <Select
                name={"address.country"}
                id="address.country"
                searchable
                required
                placeholder="Country"
                data={filteredAllCountries}
                onChange={(value) => {
                  setValue("address.country", value ?? "")
                  setCountry(value ?? "")
                  setRegion("")
                  setProvince("")
                  setCity("")
                  setBarangay("")
                }}
                value={country ?? ""}
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
                clearable
                variant="unstyled"
                className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
              />

              <AlertInput>{errors?.address?.country?.message}</AlertInput>
            </div>
            <div className="flex w-[23%] flex-col">
              <label className="sm:text-sm">Region</label>
              <Select
                name={"address.region"}
                searchable
                // required
                id="address.region"
                placeholder="Region"
                data={filteredRegion ?? [""]}
                disabled={country === "" || country !== "Philippines"}
                onChange={(value) => {
                  setValue("address.region", value ?? "")
                  setRegion(value ?? "")
                  setProvince("")
                  setCity("")
                  setBarangay("")
                }}
                value={region ?? ""}
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
                clearable
                nothingFound="No options"
                variant="unstyled"
                className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
              />

              <AlertInput>{errors?.address?.region?.message}</AlertInput>
            </div>

            <div className="flex w-[23%] flex-col">
              <label className="sm:text-sm">Province/States</label>
              <Select
                name={"address.province"}
                searchable
                // required
                id="address.province"
                placeholder="Province/States"
                data={filteredProvince}
                disabled={country === "Philippines " ? (region === "") : country === ""}
                onChange={(value) => {
                  setValue("address.province", value ?? "")
                  setProvince(value ?? "")
                  setCity("")
                  setBarangay("")
                }}
                value={province ?? ""}
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
                className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:text-gray-500"
              />
              {/* <InputField
                type={"text"}
                label={""}
                name={"address.city"}
                register={register}
              /> */}

              <AlertInput>{errors?.address?.province?.message}</AlertInput>
            </div>
            <div className="flex w-[23%] flex-col">
              <label className="sm:text-sm">City</label>
              <Select
                name={"address.city"}
                id="address.city"
                placeholder="City"
                searchable
                // required
                disabled={province === ""}
                data={filteredCity}
                onChange={(value) => {
                  setValue("address.city", value ?? "")
                  setCity(value ?? "")
                  setBarangay("")
                }}
                value={city ?? ""}
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
                className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:text-gray-500"
              />
              {/* <InputField
                type={"text"}
                label={""}
                name={"address.city"}
                register={register}
              /> */}

              <AlertInput>{errors?.address?.city?.message}</AlertInput>
            </div>
            <div className="flex w-[23%] flex-col">
              <label className="sm:text-sm">Barangay</label>
              <Select
                name={"address.barangay"}
                id="address.barangay"
                placeholder="Barangay"
                data={filteredBarangay}
                searchable
                required
                disabled={country !== "Philippines"}
                onChange={(value) => {
                  setValue("address.baranggay", value ?? "")
                  setBarangay(value ?? "")
                }}
                value={barangay ?? ""}
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
                className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:text-gray-500"
              />
              <AlertInput>{errors?.address?.baranggay?.message}</AlertInput>
            </div>
            <div className="flex w-[23%] flex-col ">
              <label className="disabled:bg-gray-300 disabled:text-gray-500 sm:text-sm">
                Street
              </label>
              <InputField
                type={"text"}
                label={""}
                placeholder="Street"
                disabled={country === ""}
                name={"address.street"}
                register={register}
              />
              <AlertInput>{errors?.address?.street?.message}</AlertInput>
            </div>

            <div className="flex w-[23%] flex-col">
              <label className="disabled:bg-gray-300 disabled:text-gray-500 sm:text-sm">
                Zip Code
              </label>
              <InputField
                type={"number"}
                label={""}
                disabled={country === ""}
                name={"address.zip"}
                register={register}
              />
              <AlertInput>{errors?.address?.zip?.message}</AlertInput>
            </div>
          </div>
        </div>

        {/* <DropZoneComponent
          setImage={props.setImage}
          setIsLoading={props.setIsLoading}
          images={props.images}
          isLoading={props.isLoading}
          acceptingMany={true}
          setIsVisible={props.setIsVisible}
        /> */}
        <hr className="w-full"></hr>
        <div className="flex w-full justify-end">
          <div className="flex items-center justify-end gap-2">
            <button
              className="px-4 py-2 font-medium underline"
              onClick={() => onDiscard()}
            >
              Cancel
            </button>
          </div>
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
      <Modal
        className="max-w-lg"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title="NOTICE!"
      >
        <>
          <div className="flex flex-col items-center gap-3 py-2 ">
            <p className="text-center text-lg font-semibold ">
              Employee Created Successfully
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
    </div>
  )
}
