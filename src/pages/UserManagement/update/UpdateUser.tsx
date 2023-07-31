import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ImageJSON } from "../../../types/table"
import { trpc } from "../../../utils/trpc"
import AlertInput from "../../../components/atoms/forms/AlertInput"
import InputField from "../../../components/atoms/forms/InputField"
import { Select } from "@mantine/core"
import Modal from "../../../components/headless/modal/modal"
import { SelectValueType } from "../../../components/atoms/select/TypeSelect"
import { UserType } from "../../../types/generic"
import { useEditableStore, useSelectedUserStore } from "../../../store/useStore"
import router, { useRouter } from "next/router"

import ph_regions from "../../../json/ph_regions.json"
import all_countries from "../../../json/countries.json"
import all_states from "../../../json/states.json"
import all_cities from "../../../json/cities.json"
import { clearAndGoBack, generateCertificate } from "../../../lib/functions"
import { EditUserInput } from "../../../server/schemas/user"

type User = z.infer<typeof EditUserInput>
// export type User = z.infer<typeof UserCreateInput>

export const UpdateUser = (props: {
  user: UserType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  // setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const [searchValue, onSearchChange] = useState<string>(
    props.user?.user_Id?.toString() ?? "0"
  )
  const futureDate = new Date()
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [certificateCheck, setCertificate] = useState<string>("")
  const utils = trpc.useContext()
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: teams } = trpc.team.findAll.useQuery()
  const { editable, setEditable } = useEditableStore()
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [barangay, setBarangay] = useState("")

  const { data: user } = trpc.user.findOne.useQuery(
    Number(props.user?.id) ?? 0
  )
  const { data: singleTeams } = trpc.team.findOne.useQuery(
    props.user?.teamId ?? 0
  )

  const lockedChecker =
    futureDate < (props.user?.lockedUntil ?? "") ? true : false

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
    isLoading: userLoading,
    error,
  } = trpc.user.updateAdmin.useMutation({
    onSuccess() {
      console.log("omsim")
      setCompleteModal(true)
      utils.user.findAll.invalidate()
      setImage([])
      router.back()
    },
    onError() {
      console.log(error)
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(EditUserInput),
  })

  useEffect(() => {
    console.log(("test") + JSON.stringify(user))
    reset(props.user as User)
    setCertificate(generateCertificate())

    console.log("error mo to", JSON.stringify(error))
  }, [error, props.user, reset, user, setCertificate])

  const onSubmit = async (userForm: User) => {
    // Register function
    console.log(userForm)
    console.log("error na nga to anoba", JSON.stringify(error))


    mutate({
      ...userForm,
      name: `${userForm.profile?.first_name
        ? userForm.profile?.first_name
        : user?.profile?.first_name
        } ${userForm.profile?.last_name
          ? userForm.profile?.last_name
          : user?.profile?.last_name
        }`,
      inactivityDate: new Date(),
      lockedAt: null,
      lockedUntil: null,
      attempts: 0,
      lockedReason: null,
      teamId: userForm.teamId,
      id: userForm.id,
      validateTable: {
        certificate: certificateCheck,
        validationDate: props.user?.validateTable?.validationDate ?? futureDate,
      },
    })
    reset()
  }

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [updated, setUpdated] = useState(false)

  const handleDelete = () => {
    setOpenModalDel(true)
  }

  const handleEditable = () => {
    setIsEditable(true)
  }

  const handleIsEditable = () => {
    if (!updated) {
      setEditable(!editable)
      setUpdated(true)
    }
  }

  // useEffect(() => { console.log("department: " + props.user?.team?.department?.name) })

  const filteredAllCountries = useMemo(() => {
    console.log("checkcount: ", country)
    const countries = all_countries.map((countries) => {
      return countries.name
    })
    setCountry("")
    console.log("country", countries)
    return countries
  }, [country])

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
        const specStates = states.filter((states) => {
          return states.country_name === country
        })
        const finalStates = specStates.map((states) => {
          return states.name
        })
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
        const jsonData = (ph_regions as Record<string, any>)[region]
          .province_list

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
        const specCities = cities.filter((city: { state_name: string }) => {
          return city.state_name === province
        })
        const finalCities = specCities.map((city: { name: string }) => {
          return city.name
        })
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

  // console.log("ALAM MO TONG EMPLOYEE NA TO::::", props.user)

  return (
    <main className="container mx-auto flex flex-col justify-center p-2">
      <h3 className="mb-2 bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text text-xl font-bold leading-normal text-transparent md:text-[2rem]">
        Update User Record
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-9 gap-7"
        noValidate
      >
        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-4">
            <label className="sm:text-sm">First Name</label>
            <InputField
              register={register}
              name="profile.first_name"
              type={"text"}
              label={""}
            />
            <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <label className="sm:text-sm">Middle Name (Optional)</label>
            <InputField
              // className="0 appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"

              type={"text"}
              label={""}
              name={"profile.middle_name"}
              register={register}
            />
          </div>
          <div className="col-span-4">
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

        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-4">
            <label className="flex justify-between pb-1 sm:text-sm">
              User Number
              {/* <div className="flex items-center gap-2">
                <i
                  className="fa-light fa-pen-to-square cursor-pointer"
                  onClick={() => {
                    handleIsEditable()
                    handleEditable()
                  }}
                />
              </div> */}
            </label>
            {/* <InputField
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"user_Id"}
              register={register}
            /> */}
            <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >{`${props.user?.user_Id}`}</p>
            {/* <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >{`${props.user?.user_id}`}</p> */}
          </div>
          <div className="col-span-4">
            <label className="sm:text-sm">Designation / Position</label>
            <InputField
              type={"text"}
              label={""}
              // placeholder={props.user?.}
              name={"position"}
              register={register}
            />

            <AlertInput>{errors?.position?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <label className="sm:text-sm">User Type</label>
            <Select
              // disabled={!isEditable}
              placeholder={user?.user_type ? user?.user_type : "Pick One"}
              onChange={(value) => {
                setValue("user_type", String(value) ?? "")
              }}
              data={["user", "admin"]}
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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
            />
          </div>
        </div>

        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-6">
            <label className="sm:text-sm">Team</label>
            <Select
              disabled={!isEditable}
              placeholder={singleTeams?.name ? singleTeams?.name : "Pick One"}
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

          <div className="col-span-6">
            <label className="sm:text-sm">Department</label>
            {/* <InputField
              // placeholder={props.user?.department}
              type={"text"}
              disabled={!editable}
              label={""}
              placeholder={props.user?.team?.department?.name}
              name={"department"}
              register={register}
            /> */}
            <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >{`${props.user?.Userteam?.department?.name}`}</p>
          </div>

          {/* <div className="col-span-6">
            <label className="sm:text-sm">Location</label>
            <InputField
              // placeholder={props.user?.department}
              type={"text"}
              disabled={!editable}
              label={""}
              placeholder={props.user?.team?.department?.name}
              name={"department"}
              register={register}
            />
            <p
              className={
                "my-2 w-full truncate rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400  outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >
              {"based on workmode (based wer?)"}
            </p>
          </div> */}
        </div>

        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-4">
            <label className="mb-2 sm:text-sm">Mobile Number</label>
            <input
              type="number"
              pattern="[0-9]*"
              defaultValue={props.user?.profile?.phone_no ?? "--"}
              className="!mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
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

          <div className="col-span-4">
            <label className="sm:text-sm">Email</label>
            <InputField
              type={"text"}
              label={""}
              name={"email"}
              register={register}
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          {/* <div className="col-span-4">
            <label className="sm:text-sm">Device</label>
            <Select
              onChange={(value) => {
                setValue("workStation", String(value) ?? " ")
                onSearchWorkStation(value ?? "")
              }}
              placeholder="--"
              value={workStationValue}
              defaultValue={props.user?.workStation ?? "--"}
              data={["Desktop", "Laptop"]}
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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-0.5 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
            />
          </div> */}
        </div>
        <div className="col-span-9 grid grid-cols-8 gap-7">
          <div className="col-span-2">
            <label className="sm:text-sm">Country</label>
            <Select
              name={"address.country"}
              id="address.country"
              searchable
              required
              placeholder={props.user?.address?.country ?? "Country"}
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
          <div className="col-span-2">
            <label className="sm:text-sm">Region</label>
            <Select
              name={"address.region"}
              searchable
              // required
              id="address.region"
              placeholder={props.user?.address?.region ?? "Region"}
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
              className={country === "" || country !== "Philippines" ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 pointer-events-none px-4 py-[.15rem] text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2" : "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2  "}
            />

            <AlertInput>{errors?.address?.region?.message}</AlertInput>
          </div>

          <div className="col-span-2">
            <label className="sm:text-sm">Province/States</label>
            <Select
              name={"address.province"}
              searchable
              // required
              id="address.province"
              placeholder={props.user?.address?.province ?? "Province/States"}
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
              className={(country === "Philippines " ? (region === "") : country === "") ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-[.15rem] text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2" : "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2  "}
            />
            {/* <InputField
                type={"text"}
                label={""}
                name={"address.city"}
                register={register}
              /> */}

            <AlertInput>{errors?.address?.province?.message}</AlertInput>
          </div>
          <div className="col-span-2">
            <label className="sm:text-sm">City</label>
            <Select
              name={"address.city"}
              id="address.city"
              placeholder={props.user?.address?.city ?? "City"}
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
              className={province === "" ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-[.15rem] text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2" : "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2  "}
            />
            {/* <InputField
                type={"text"}
                label={""}
                name={"address.city"}
                register={register}
              /> */}

            <AlertInput>{errors?.address?.city?.message}</AlertInput>
          </div>
          <div className=" col-span-2">
            <label className="sm:text-sm">Barangay</label>
            <Select
              name={"address.barangay"}
              id="address.barangay"
              placeholder={props.user?.address?.baranggay ?? "Barangay"}
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
              className={(country === "Philippines" && city !== "") ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2  " : "mt-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-[.15rem] text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"}
            />
            <AlertInput>{errors?.address?.baranggay?.message}</AlertInput>
          </div>
          <div className="col-span-2">
            <InputField
              type={"text"}
              label={"Street"}
              placeholder="Street"
              disabled={country === ""}
              name={"address.street"}
              register={register}
            />
            <AlertInput>{errors?.address?.street?.message}</AlertInput>
          </div>

          <div className="col-span-2">
            <InputField
              type={"number"}
              label={"Zip Code"}
              disabled={country === ""}
              name={"address.zip"}
              register={register}
            />
            <AlertInput>{errors?.address?.zip?.message}</AlertInput>
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
        <hr className="col-span-full"></hr>
        {/* <div className="flex w-full justify-end">
          {<button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={userLoading}
          >
            {userLoading ? "Loading..." : "Save"}
          </button>}
        </div> */}
        <div className="col-span-full">
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
          {
            <div className="flex w-full justify-end gap-4">
              <button
                type="button"
                className=" px-4 py-1 font-medium underline "
                onClick={() => clearAndGoBack()}
              >
                Cancel
              </button>

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
                disabled={userLoading}
              >
                {userLoading
                  ? "Loading..."
                  : lockedChecker
                    ? "Unlock and save "
                    : "Save"}
              </button>
            </div>
          }
          <UserDeleteModal
            user={props.user}
            openModalDel={openModalDel}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setOpenModalDel={setOpenModalDel}
          // setIsVisible={props.setIsVisible}
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
          <div className="flex flex-col items-center gap-3 py-2 ">
            <p className="text-center text-lg font-semibold ">
              User Updated Successfully
            </p>
            <button
              className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                // props.setIsVisible(false)
                // setIsVisible(false)
                router.push("/UserManagement")
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

export default UpdateUser

export const UserDeleteModal = (props: {
  user: UserType
  openModalDel: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
  // setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  //trpc utils for delete
  const utils = trpc.useContext()

  const { mutate } = trpc.user.createArchive.useMutation({
    onSuccess() {
      console.log()
      props.setOpenModalDel(false)
      props.setIsLoading(false)
      // props.setIsVisible(false)
      utils.user.findAll.invalidate()

    },
  })
  const handleDelete = async () => {
    mutate({
      old_id: Number(props.user?.id),
    })
  }

  return (
    <Modal
      className="max-w-2xl"
      title="Delete User Account"
      isVisible={props.openModalDel}
      setIsVisible={props.setOpenModalDel}
    >
      <div className="m-4 flex flex-col ">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>You are about to permanently delete </div>
          <p className="text-neutral-500">
            <i className="fa-regular fa-circle-exclamation" /> This action is
            irrevokable, please carefully review the action.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-sm bg-gray-300 px-5 py-1 hover:bg-gray-400"
              onClick={() => {
                props.setOpenModalDel(false)
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