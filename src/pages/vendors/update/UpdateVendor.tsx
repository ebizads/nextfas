import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import {
    VendorCreateInput,
    VendorEditInput,
} from "../../../server/schemas/vendor"
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
import { VendorType } from "../../../types/generic"
// import { useEditableStore } from "../../../store/useStore"
import { useEditableStore, useSelectedVendorStore } from "../../../store/useStore"
import { useRouter } from "next/router"

import ph_regions from "../../../json/ph_regions.json"
import all_countries from "../../../json/countries.json"
import all_states from "../../../json/states.json"
import all_cities from "../../../json/cities.json"
import { clearAndGoBack } from "../../../lib/functions"

import { Textarea } from "@mantine/core"

export type Vendor = z.infer<typeof VendorEditInput>
// export type Vendor = z.infer<typeof VendorCreateInput>

export const UpdateVendor = (props: {
    vendor: VendorType
    // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
    // images: ImageJSON[]
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    // isLoading: boolean
    // setEditable: boolean
    // setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { selectedVendor, setSelectedVendor } = useSelectedVendorStore()
    const [country, setCountry] = useState("")
    const [region, setRegion] = useState("")
    const [province, setProvince] = useState("")
    const [city, setCity] = useState("")
    const [barangay, setBarangay] = useState("")
    const router = useRouter()
    // date ?? new Date())
    const utils = trpc.useContext()
    // const [images, setImage] = useState<ImageJSON[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [openModalDel, setOpenModalDel] = useState<boolean>(false)

    // const { data: teams } = trpc.team.findAll.useQuery()
    const { editable, setEditable } = useEditableStore()

    // const teamList = useMemo(() => {
    //     const list = teams?.teams.map(
    //         (team: { id: { toString: () => any }; name: any }) => {
    //             return { value: team.id.toString(), label: team.name }
    //         }
    //     ) as SelectValueType[]
    //     return list ?? []
    // }, [teams]) as SelectValueType[]

    const {
        mutate,
        isLoading: vendorLoading,
        error,
    } = trpc.vendor.edit.useMutation({
        onSuccess() {
            console.log("omsim")
            router.push("/vendors")
            // invalidate query of asset id when mutations is successful
            utils.vendor.findAll.invalidate()
            setIsVisible(true)
            // setImage([])
        },
    })
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<Vendor>({
        resolver: zodResolver(VendorEditInput),
    })

    useEffect(() => {
        reset(props.vendor as Vendor)
        console.log(props.vendor)
    }, [props.vendor, reset])

    const onSubmit = async (vendor: Vendor) => {
        // Register function
        mutate({
            ...vendor,
            name: `${vendor.name}`,
        })
        reset()
    }


    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        console.log(selectedVendor)
        if (selectedVendor === null) {
            router.push("/vendors")
        }
    })

    const handleDelete = () => {
        setOpenModalDel(true)
    }

    // const handleEditable = () => {
    //     setIsEditable(true)
    // }

    // const handleIsEditable = () => {
    //     if (!updated) {
    //         setEditable(true)
    //         setUpdated(true)
    //     }
    // }
    const filteredAllCountries = useMemo(() => {
        console.log("checkcount: ", country)
        const countries = all_countries.map((countries) => {
            return countries.name
        })
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

    // console.log("ALAM MO TONG EMPLOYEE NA TO::::", props.vendor)

    return (
        <main className="container mx-auto flex flex-col justify-center p-2">
            <h3 className="mb-2 bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text text-xl font-bold leading-normal text-transparent md:text-[2rem]">
                Update Vendor Record
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
                            defaultValue={props.vendor?.type ?? "--"}
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
                            className={"mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-[0.10rem]  px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "}
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
                        <label className="flex justify-between pb-1 sm:text-sm">
                            Email
                        </label>
                        <InputField
                            type={"text"}
                            label={""}
                            name={"email"}
                            register={register}
                        />
                        <AlertInput>{errors?.email?.message}</AlertInput>
                    </div>
                    <div className="col-span-4">
                        <label className="sm:text-sm">
                            Phone Number: {`(use " , " for multiple phone numbers)`}
                        </label>
                        <input
                            className={'!mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 '}

                            pattern="[0-9]*"
                            type="text"
                            onKeyDown={(e) => {
                                const regex = /^[0-9, ]|Backspace/
                                if (e.key === "e" || !regex.test(e.key)) {
                                    e.preventDefault()
                                }
                            }}
                            // onInput={(event) => {
                            //   const inputValue = event.currentTarget.value

                            // }}
                            onChange={(event) => {
                                const convertToArray = event.currentTarget.value
                                const phonenumString = convertToArray
                                    .replace(/[^0-9, ]/gi, "")
                                    .split(",")
                                setValue("phone_no", phonenumString)
                            }}
                            defaultValue={props.vendor?.phone_no ?? "--"}
                        />
                        <AlertInput>{errors?.phone_no?.message}</AlertInput>
                    </div>
                    <div className="col-span-4">
                        <label className="!mb-2 sm:text-sm">Fax Number</label>
                        <input
                            type="number"
                            pattern="[0-9]*"
                            defaultValue={props.vendor?.fax_no ?? "--"}
                            className={'!mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 '}

                            onKeyDown={(e) => {
                                if (e.key === "e") {
                                    e.preventDefault()
                                }
                            }}
                            onChange={(event) => {
                                if (event.target.value.length > 8) {
                                    console.log("more than 8")
                                    event.target.value = event.target.value.slice(0, 8)
                                }
                                setValue("fax_no", event.currentTarget.value.toString())
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
                            placeholder={props.vendor?.address?.country ?? "Country"}
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
                            placeholder={props.vendor?.address?.region ?? "Region"}
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
                            placeholder={props.vendor?.address?.province ?? "Province/States"}
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
                            placeholder={props.vendor?.address?.city ?? "City"}
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
                            placeholder={props.vendor?.address?.baranggay ?? "Barangay"}
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
                                disabled={vendorLoading}
                            >
                                {vendorLoading ? "Loading..." : "Save"}
                            </button>
                        </div>
                    }
                    <VendorDeleteModal
                        vendor={props.vendor}
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
                            Vendor Updated Successfully
                        </p>
                        <button
                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                            onClick={() => {
                                // props.setIsVisible(false)
                                // setIsVisible(false)
                                router.push("/vendors")
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

export default UpdateVendor

export const VendorDeleteModal = (props: {
    vendor: VendorType
    openModalDel: boolean
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
    // setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    //trpc utils for delete
    const utils = trpc.useContext()
    const router = useRouter()
    const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false)

    const { mutate } = trpc.vendor.delete.useMutation({
        onSuccess() {
            console.log()
            props.setOpenModalDel(false)
            props.setIsLoading(false)
            // props.setIsVisible(false)
            // router.push('/vendors')
            utils.vendor.findAll.invalidate()
            // window.location.reload()
        },
    })
    const handleDelete = async () => {
        mutate({
            id: props.vendor?.id ?? -1,
        })
    }


    return (
        <>
            <Modal
                className="max-w-2xl"
                title="Delete Vendor"
                isVisible={props.openModalDel}
                setIsVisible={props.setOpenModalDel}
            >
                <div className="m-4 flex flex-col ">
                    <div className="flex flex-col items-center gap-8 text-center">
                        <div>
                            You are about delete this item with vendor name:{" "}
                            {props.vendor?.name}
                        </div>
                        <p className="text-neutral-500">
                            <i className="fa-regular fa-circle-exclamation" /> Please
                            carefully review the action before deleting.
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
                                onClick={() => {
                                    handleDelete()
                                    setIsDeleteVisible(true)
                                }}
                            // disabled={isLoading}
                            >
                                Yes, delete record
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                className="max-w-lg"
                isVisible={isDeleteVisible}
                setIsVisible={setIsDeleteVisible}
                title="NOTICE!"
            >
                <>
                    <div className="flex flex-col items-center gap-3 py-2 ">
                        <p className="text-center text-lg font-semibold ">
                            Vendor Deleted Successfully
                        </p>
                        <button
                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                            onClick={() => {
                                // props.setIsVisible(false)
                                // setIsVisible(false)
                                router.push("/vendors")
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </>
            </Modal>
        </>
    )
}
