import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { EmployeeCreateInput } from "../../../server/schemas/employee"
import { ImageJSON } from "../../../types/table"
import { trpc } from "../../../utils/trpc"
import AlertInput from "../../../components/atoms/forms/AlertInput"
import { InputField } from "../../../components/atoms/forms/InputField"
import { Select } from "@mantine/core"
import DropZoneComponent from "../../../components/dropzone/DropZoneComponent"
import { env } from "../../../env/client.mjs"
import moment from "moment"
import Modal from "../../../components/headless/modal/modal"
import TypeSelect, { SelectValueType } from "../../../components/atoms/select/TypeSelect"
import ph_regions from "../../../json/ph_regions.json"
import all_countries from "../../../json/countries.json"
import all_states from "../../../json/states.json"
import all_cities from "../../../json/cities.json"
import { set } from "lodash"
import { clearAndGoBack } from "../../../lib/functions"
import { VendorCreateInput } from "../../../server/schemas/vendor"
import { Textarea } from "@mantine/core"
import router from "next/router"



export const CreateVendor = () => {
  const [searchValue, onSearchChange] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [tryReset, setTryReset] = useState<boolean>(false)
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [barangay, setBarangay] = useState("")
  type Vendor = z.infer<typeof VendorCreateInput>


  const utils = trpc.useContext()

  const {
    mutate,
  } = trpc.vendor.create.useMutation({
    onSuccess: () => {
      utils.vendor.findAll.invalidate()
      utils.vendor.findAllSample.invalidate()
      setIsVisible(true)
      // setAddSingleRecord(false);
    },
  })


  const deleteVendor = trpc.vendor.deleteMany.useMutation({
    onSuccess: () => {
      utils.vendor.findAll.invalidate()


    }
  })

  // const teamList = useMemo(() => {
  //   const list = teams?.teams.map((team) => {
  //     return { value: team.id.toString(), label: team.name }
  //   }) as SelectValueType[]
  //   return list ?? []
  // }, [teams]) as SelectValueType[]

  const {
    register,
    handleSubmit,
    watch,
    // clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Vendor>({
    resolver: zodResolver(VendorCreateInput), // Configuration the validation with the zod schema.
    defaultValues: {},
  })

  const onSubmit = async (vendor: Vendor) => {
    // Register function
    console.log(vendor)
    mutate({
      ...vendor
    })
  }

  const watcher = watch()


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
    <main className="container mx-auto flex flex-col justify-center p-2">
      <h3 className="mb-2 bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text text-xl font-bold leading-normal text-transparent md:text-[2rem]">
        Create Vendor Record
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-9 gap-7"
        noValidate
      >
        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-4">
            <label className="sm:text-sm">Company Name</label>
            <InputField
              register={register}
              label=""
              name="name"
              type="text"
            />
            <AlertInput>{errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <label className="sm:text-sm">Vendor Type</label>
            <Select
              placeholder="Pick one"
              onChange={(value) => {
                setValue("type", value ?? "")
              }}
              data={["Manufacturer", "Supplier", "Servicing", "Others"]}
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
          <div className="col-span-4">
            <label className="sm:text-sm">Website</label>
            <InputField
              register={register}
              label=""
              name="website"
              type="text"
            />
            <AlertInput>{errors?.website?.message}</AlertInput>
          </div>
        </div>

        <div className="col-span-9 grid grid-cols-12 gap-7">
          <div className="col-span-4">
            <label className="sm:text-sm">Email</label>
            <InputField
              register={register}
              label=""
              name="email"
              type="text"
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <label className="sm:text-sm">Mobile Number: {`(use " , " for multiple Mobile numbers)`}</label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border-2 curs border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2"
              onKeyDown={(e) => {
                const regex = /^[0-9, ]|Backspace/
                if (e.key === "e" || !regex.test(e.key)) {
                  e.preventDefault()
                }
              }}
              onChange={(event) => {
                const convertToArray = event.currentTarget.value;
                const phonenumString = convertToArray.replace(/[^0-9, ]/gi, "").split(",")
                setValue("phone_no", phonenumString);
              }}
              value={watcher.phone_no}
            />
            <AlertInput>{errors?.phone_no?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <label className="sm:text-sm ">Fax/Phone Number</label>
            <input
              // disabled={!isEditable}

              type="number"
              pattern="[0-9]*"
              className={'!mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 '}
              onKeyDown={(e) => {
                if (e.key === "e") {
                  e.preventDefault()
                }
              }}
              onChange={(event) => {

                if (event.target.value.length > 8) {
                  console.log("more than 8")
                  event.target.value = event.target.value.slice(0, 8);
                }
                setValue(
                  "fax_no",
                  event.currentTarget.value.toString()
                )
              }}
            />
            <AlertInput>{errors?.fax_no?.message}</AlertInput>
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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
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
              className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-800 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:text-gray-500"
            />
            <AlertInput>{errors?.address?.baranggay?.message}</AlertInput>
          </div>
          <div className="col-span-2">
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

          <div className="col-span-2">
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

        <div className="col-span-full">
          <Textarea
            placeholder=""
            label="Remarks"
            minRows={6}
            maxRows={6}
            classNames={{
              input:
                "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
              label: "font-sans text-sm text-gray-600 text-light",
            }}
          />
        </div>

        {/* <DropZoneComponent
          setImage={props.setImage}
          setIsLoading={props.setIsLoading}
          images={props.images}
          isLoading={props.isLoading}
          acceptingMany={true}
          setIsVisible={props.setIsVisible}
        /> */}
        <hr className="col-span-full"></hr>
        <div className="col-span-full flex justify-end">
          <button
            className="px-4 py-2 font-medium underline"
            onClick={() => clearAndGoBack()}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            // className="rounded-md bg-tangerine-500 py-2 px-6 font-semibold text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Add Vendor
          </button>
        </div>
      </form>
      {/* {
        error && errors && (
          <pre className="mt-2 text-sm italic text-red-500">
            Something went wrong!
            {JSON.stringify({ error, errors }, null, 2)}
          </pre>
        )
      } */}
      <Modal
        className="max-w-lg"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title="NOTICE!"
      >
        <>
          <div className="flex flex-col items-center gap-3 py-2 ">
            <p className="text-center text-lg font-semibold ">
              Vendor Created Successfully
            </p>
            <button
              className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                // props.setIsVisible(false)
                setIsVisible(false)
                router.push("/vendors")

              }}
            >
              Confirm
            </button>
          </div>
        </>
      </Modal>
    </main >
  )
}

export default CreateVendor
