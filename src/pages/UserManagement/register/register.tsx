import Head from "next/head"
import Link from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { InputField } from "../../../components/atoms/forms/InputField"
import { trpc } from "../../../utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import AlertInput from "../../../components/atoms/forms/AlertInput"
import { CreateUserInput } from "../../../server/schemas/user"
import { generateRandomPass, generateCertificate } from "../../../lib/functions"
import { User } from "tabler-icons-react"
import Modal from "../../../components/headless/modal/modal"
import DropZoneComponent from "../../../components/dropzone/DropZoneComponent"
import { Select } from "@mantine/core"
import { env } from "../../../env/client.mjs"
import { DatePicker } from "@mantine/dates"
import { SelectValueType } from "../../../components/atoms/select/TypeSelect"
import moment from "moment"
import { ImageJSON } from "../../../types/table"
import PasswordChecker from "../../../components/atoms/forms/PasswordChecker"
import Employee from "../../employees"
import { clearAndGoBack } from "../../../lib/functions"
import ph_regions from "../../../json/ph_regions.json"
import all_countries from "../../../json/countries.json"
import all_states from "../../../json/states.json"
import all_cities from "../../../json/cities.json"

type User = z.infer<typeof CreateUserInput>

const Register2 = () => {
  const [userId, setUserId] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [passwordCheck, setPassword] = useState<string>("")
  const [certificateCheck, setCertificate] = useState<string>("")
  const [searchValue, onSearchChange] = useState<string>("")
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoadingNow, setIsLoading] = useState<boolean>(false)
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [barangay, setBarangay] = useState("")
  const futureDate = new Date()
  futureDate.setFullYear(futureDate.getFullYear() + 1)

  const { mutate, isLoading, error } = trpc.user.create.useMutation({
    onSuccess() {
      setCompleteModal(true)
      // invalidate query of asset id when mutations is successful
      //utils.asset.findAll.invalidate()
    },
  })
  const { data: teams } = trpc.team.findAll.useQuery()

  const teamList = useMemo(() => {
    const list = teams?.teams.map((team) => {
      return { value: team.id.toString(), label: team.name }
    }) as SelectValueType[]
    return list ?? []
  }, [teams]) as SelectValueType[]

  const teamList1 = useMemo(() => {
    const list = teams?.teams.map((team) => {
      return { value: team.id.toString(), label: team.department?.name }
    }) as SelectValueType[]
    return list ?? []
  }, [teams]) as SelectValueType[]

  useEffect(() => {
    setUserId(moment().format("YY-MDhms"))
    setCertificate(generateCertificate())
  }, [setUserId, setCertificate])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(CreateUserInput),
    defaultValues: {
      name: "test",
      user_Id: `${env.NEXT_PUBLIC_CLIENT_USER_ID}${userId}`,
      // supervisee: {
      //   name: ""
      // },
      // superviseeId: 0,
      email: "",
      hired_date: new Date(),
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
      validateTable: {
        certificate: "",
        validationDate: futureDate,
      },
      firstLogin: true,
      password: "",
    }, // Configuration the validation with the zod schema.
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  const onSubmit = async (user: User) => {
    console.log("ewaaaa"),
      // Register function
      mutate({
        firstLogin: true,
        name: `${user.profile.first_name} ${user.profile.last_name}`,
        user_type: "user",
        image: "",
        oldPassword: user.oldPassword,
        password: passwordCheck,
        user_Id: env.NEXT_PUBLIC_CLIENT_USER_ID + userId,
        teamId: user.teamId,
        hired_date: new Date(),
        position: user.position,
        profile: {
          first_name: user.profile.first_name,
          middle_name: user.profile.middle_name,
          last_name: user.profile.last_name,
          image: images[0]?.file ?? "",
          phone_no: user.profile.phone_no,
        },
        email: user.email,
        address: {
          city: user.address?.city,
          country: user.address?.country,
          street: user.address?.street,
          zip: user.address?.zip,
          baranggay: user.address?.baranggay,
          region: user.address?.region,
          province: user.address?.province
        },
        inactivityDate: new Date(),
        passwordAge: new Date(),
        validateTable: {
          certificate: certificateCheck,
          validationDate: futureDate,
        },
      }),
      console.log("Cert: " + certificateCheck)
    console.log(user.validateTable)
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

  const disabledStyles = "disabled:w-full disabled:rounded-md disabled:border-2 disabled:border-gray-400 disabled:bg-transparent disabled:px-4 disabled:py-2 disabled:text-gray-600 disabled:outline-none disabled:ring-tangerine-400/40 disabled:placeholder:text-sm disabled:focus:border-tangerine-400 disabled:focus:outline-none disabled:focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400";

  return (
    <main className="container mx-auto flex flex-col justify-center p-2">
      <h3 className="mb-2 bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text text-xl font-bold leading-normal text-transparent md:text-[2rem]">
        Register
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-9 gap-7"
        noValidate
      >
        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-4">
            {/* <label className="sm:text-sm"></label> */}
            <InputField
              register={register}
              name="profile.first_name"
              type={"text"}
              label={"First Name"}
              required
            />
            <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            {/* <label className="sm:text-sm">Middle Name (Optional)</label> */}
            <InputField
              type={"text"}
              label={"Middle Name (Optional)"}
              name={"profile.middle_name"}
              register={register}
            />
          </div>
          <div className="col-span-4">
            {/* <label className="sm:text-sm">Last Name</label> */}
            <InputField
              type={"text"}
              label={"Last Name"}
              name={"profile.last_name"}
              register={register}
              required
            />
            <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>
          </div>
        </div>

        {/* <InputField
            label="Password"
            register={register}
            name="password"
            type="password"
            className="border-b"
            withIcon="fa-solid fa-eye"
            isPassword={true}
          />
          <PasswordChecker password={watch().password} /> */}
        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-3">
            <label className="sm:text-sm">User Number</label>
            {/* <InputField
              disabled
              label={""}
              type={"text"}
              placeholder={(
                env.NEXT_PUBLIC_CLIENT_USER_ID + userId
              ).toString()}
              value={(env.NEXT_PUBLIC_CLIENT_USER_ID + userId).toString()}
              name={"user_Id"}
              register={register}
            /> */}
            <p className="mt-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2">
              {`${env.NEXT_PUBLIC_CLIENT_USER_ID}`}
              {userId}
            </p>
          </div>
          <div className="col-span-3">
            {/* <label className="sm:text-sm">Designation / Position</label> */}
            <InputField
              type={"text"}
              label={"Designation / Position"}
              name={"position"}
              register={register}
              required
            />

            <AlertInput>{errors?.position?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <label className="sm:text-sm">
              Team<span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Pick one"
              onChange={(value) => {
                setValue("teamId", Number(value))
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
            <AlertInput>{errors?.teamId?.message}</AlertInput>
          </div>



          <div className="col-span-3">
            <label className="sm:text-sm">
              Deparment<span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="--"
              onChange={(value) => {
                setValue("teamId", Number(value))
                onSearchChange(value ?? "")
              }}
              disabled
              value={searchValue}
              data={teamList1}
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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-2 py-0.5 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2  disabled:bg-gray-200 disabled:text-gray-400 "
            />
            <AlertInput>{errors?.teamId?.message}</AlertInput>
          </div>
        </div>

        <div className="col-span-9 grid grid-cols-12 gap-7">

          <div className="col-span-4">
            {/* <label className="sm:text-sm">Email</label> */}
            <InputField
              // disabled={!editable}
              type={"text"}
              label={"Email"}
              name={"email"}
              register={register}
              placeholder={"--@email.com"}
              required
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <label className="!mb-2 sm:text-sm">Mobile Number</label>
            <input
              type="number"
              className="!my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
              className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            />
          </div>

        </div>



        <div className="col-span-9 grid grid-cols-8 gap-7">
          <div className="col-span-2">
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
          <div className="col-span-2">
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

        {/* <DropZoneComponent
          setImage={setImage}
          setIsLoading={setIsLoading}
          images={images}
          isLoading={isLoadingNow}
          acceptingMany={false}
        /> */}
        <hr className="col-span-full"></hr>
        <div className="col-span-full flex justify-end">
          <button
            type="button"
            className="px-4 py-2 font-medium underline"
            onClick={() => clearAndGoBack()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" rounded-md bg-tangerine-500  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            disabled={isLoading}
            onClick={() => setPassword(generateRandomPass())}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
      {error && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
          {JSON.stringify({ error, errors }, null, 2)}
        </pre>
      )}

      <Modal
        isVisible={completeModal}
        setIsVisible={setCompleteModal}
        className="max-w-2xl"
        title="New Account"
      >
        <div className="flex w-full flex-col px-4 py-2">
          <div>
            <p className="text-center text-lg font-semibold">
              New account registration successful.
            </p>

            <p className="text-center text-lg font-semibold">
              Password: {passwordCheck}
            </p>
          </div>
          <hr className="absolute left-0 bottom-[5.5rem] w-full" />
          <div className="mt-16 flex flex-row justify-end">
            <button
              className="w-[20%] rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                setCompleteModal(false)
                setUserId(moment().format("YY-MDhms"))
                setCertificate(generateCertificate())
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}

export default Register2
