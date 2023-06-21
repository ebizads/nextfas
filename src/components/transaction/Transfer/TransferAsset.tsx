import React, { useEffect, useState, useMemo } from "react"
import { useStepper } from "headless-stepper"
import {
    ArrowsExchange,
    Check,
    Checks,
    CircleNumber1,
    CircleNumber2,
    CircleNumber3,
} from "tabler-icons-react"
import { Accordion, Checkbox, Select, Textarea } from "@mantine/core"
import { trpc } from "../../../utils/trpc"
import { InputField } from "../../atoms/forms/InputField"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetEditInput } from "../../../server/schemas/asset"
import { z } from "zod"
import { SelectValueType } from "../../atoms/select/TypeSelect"
import { getAddress, getLifetime } from "../../../lib/functions"
import Modal from "../../headless/modal/modal"
import Link from "next/link"
import { useTransferAssetStore } from "../../../store/useStore"
import { DatePicker } from "@mantine/dates"

export type Assets = z.infer<typeof AssetEditInput>

const Transfer = ({ }) => {
    const [assetNumber, setAssetNumber] = useState<string>("")
    const [searchAsset, setSearchAsset] = useState<string>("")

    const [checked, setChecked] = useState(false)

    const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase())
    const { data: departmentData } = trpc.department.findAll.useQuery()

    const [selectedDept, setSelectedDept] = useState<string>("")
    const [selectedEMP, setSelectedEMP] = useState<string>("")

    const [searchModal, setSearchModal] = useState<boolean>(false)
    const [completeModal, setCompleteModal] = useState<boolean>(false)

    const { data: employeeData } = trpc.employee.findAll.useQuery({
        search: {
            team: {
                department: {
                    id: Number(selectedDept) ?? 0,
                },
            },
        },
    })

    const { data: employee } = trpc.employee.findOne.useQuery(Number(selectedEMP))
    const { data: department } = trpc.department.findOne.useQuery(
        Number(selectedDept)
    )

    const employeeList = useMemo(() => {
        const list = employeeData?.employees.map((employee) => {
            return { value: employee.id.toString(), label: employee.name }
        }) as SelectValueType[]
        return list ?? []
    }, [employeeData]) as SelectValueType[]

    const departmentList = useMemo(() => {
        const list = departmentData?.departments.map((department) => {
            return { value: department.id.toString(), label: department.name }
        }) as SelectValueType[]
        return list ?? []
    }, [departmentData]) as SelectValueType[]

    useMemo(() => {
        if (asset === null && assetNumber !== "") {
            setSearchModal(true)
        }
    }, [asset, assetNumber])

    const utils = trpc.useContext()

    const { mutate } = trpc.asset.edit.useMutation({
        onSuccess() {
            setCompleteModal(true)
            // invalidate query of asset id when mutations is successful
            utils.asset.findAll.invalidate()
        },
    })

    const { register, handleSubmit, reset, setValue, getValues } = useForm<Assets>({
        resolver: zodResolver(AssetEditInput),
    })

    useEffect(() => reset(asset as Assets), [asset, reset])

    const onSubmit = (asset: Assets) => {
        // Register function
        console.log("oms")
        mutate({
            ...asset,
            departmentId: asset.departmentId ?? 2,
            custodianId: asset.custodianId ?? 2,
        })
        reset()
    }

    const steps = useMemo(
        () => [
            {
                label: "Check Asset Details",
                icon: (
                    <>
                        <i className="fa-solid fa-info text-white" />
                    </>
                ),
            },
            {
                label: "Transfer Asset",
                icon: (
                    <>
                        {" "}
                        <ArrowsExchange size={25} strokeWidth={2} color={"#E0E0E0 "} />
                    </>
                ),
            },
            {
                label: "Confirmation",
                icon: (
                    <>
                        {" "}
                        <Checks size={25} strokeWidth={2} color={"#E0E0E0 "} />
                    </>
                ),
            },
        ],
        []
    )

    const { state, stepperProps, stepsProps, nextStep, prevStep } = useStepper({
        steps,
    })

    const { transferAsset, setTransferAsset } = useTransferAssetStore()


    const resetTransferAsset = () => {
        setTransferAsset(null)
        console.log("dapat wala na")
    }

    const [companyId, setCompanyId] = useState<string>("")
    const { data: companyData } = trpc.company.findAll.useQuery()

    useEffect(() => {
        setAssetNumber(transferAsset?.number ?? "")
        setCompanyId(asset?.subsidiaryId?.toString() ?? "")

    }, [asset?.subsidiaryId, transferAsset?.number])



    const company_address = useMemo(() => {
        if (companyId) {
            const address = companyData?.companies.filter(
                (company: { id: number }) => company.id === Number(companyId)
            )[0]
            return address ?? null
        }
    }, [companyId, companyData])

    const companyList = useMemo(
        () =>
            companyData?.companies
                .filter((item: { id: number }) => item.id != 0)
                .map((company: { id: { toString: () => any }; name: any }) => {
                    return { value: company.id.toString(), label: company.name }
                }),
        [companyData]
    ) as SelectValueType[] | undefined


    // console.log(company_address);
    return (
        <div className="px-4">
            <div>
                <nav className="w-100 my-4 grid grid-cols-6" {...stepperProps}>
                    <ol className="z-1 col-span-full flex flex-row">
                        {stepsProps?.map((step, index) => (
                            <li
                                className={`flex justify-center ${index !== 2 ? "w-full" : ""}`}
                                key={index}
                            >
                                <div className="flex w-full flex-col gap-2">
                                    <div className="flex w-full items-center gap-4">
                                        {state.currentStep > index ? (
                                            <span
                                                className={`border-full flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors ease-in-out group-focus:ring-2 group-focus:ring-offset-2 ${state?.currentStep >= index
                                                    ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                                                    : ""
                                                    }`}
                                            >
                                                <Check size={25} strokeWidth={2} />
                                            </span>
                                        ) : (
                                            <span
                                                className={`border-full flex h-8 w-8 items-center justify-center rounded-full border bg-white text-black ring-tangerine-500 transition-colors ease-in-out group-focus:ring-2 group-focus:ring-offset-2 ${state?.currentStep >= index
                                                    ? "bg-[#B45309] text-white ring-2 ring-offset-2"
                                                    : ""
                                                    }`}
                                            >
                                                {steps[index]?.icon}
                                            </span>
                                        )}

                                        {
                                            <div
                                                className={`mr-4 h-2 flex-1 rounded border ${index !== 2 ? "" : "invisible"
                                                    } ${state?.currentStep > index
                                                        ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                                                        : "bg-[#ECECEC]"
                                                    }`}
                                            />
                                        }
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs">Step {index + 1}</span>
                                        <span className="font-bold">{steps[index]?.label}</span>
                                        {/* <div>
                                        {state.currentStep >= index ? <span className="rounded-3xl border px-2 text-sm bg-[#FEF3C7] border-[#FEF3C7] text-[#F59E0B]">{state.currentStep === index ? "Ongoing" : "Completed"}</span>
                                            : <span className="rounded-3xl border px-2 text-sm border-[#0f1a2a86] text-[#0f1a2a86]">Pending</span>}
                                    </div> */}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            <Modal
                className="max-w-lg"
                isVisible={searchModal}
                setIsVisible={setSearchModal}
                title="NOTICE!!"
            >
                <div className="py-2">
                    <p className="text-center text-lg font-semibold">No Data Found!</p>
                </div>
            </Modal>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
                noValidate
            >
                {asset !== null && state.currentStep === 0 && (
                    <div>
                        <div className="rounded-md bg-white drop-shadow-lg">
                            <div className="p-5">
                                <Accordion multiple={true} defaultValue={['1', '2', '3']}>

                                    <Accordion.Item value={"1"} className="">
                                        <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                                            <div className=" flex items-center gap-2 text-gray-700">
                                                {/* <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400 p-1 text-sm text-yellow-400">
                                                    1
                                                </div> */}
                                                <CircleNumber1 className="h-7 w-7" color="gold"></CircleNumber1>{" "}
                                                <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">Asset Information</p>
                                            </div>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="grid grid-cols-9 gap-7">
                                                <div className="col-span-9 grid grid-cols-8 gap-7">
                                                    <div className="col-span-4">
                                                        <InputField
                                                            register={register}
                                                            label="Name"
                                                            name="name"
                                                            placeholder="Name"
                                                            // className="placeholder:font-semibold"
                                                            disabled
                                                        // required
                                                        />
                                                        {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                                                    </div>
                                                    <div className="col-span-4">
                                                        <InputField
                                                            register={register}
                                                            label="Alternate Asset Number"
                                                            placeholder="Alternate Asset Number"
                                                            name="alt_number"
                                                            disabled

                                                        />
                                                        {/* <AlertInput>{errors?.alt_number?.message}</AlertInput> */}
                                                    </div>
                                                    {/* <div className="col-span-2">
                                                        <InputField
                                                            register={register}
                                                            required
                                                            name={"model.typeId"}
                                                            label="Type"
                                                            placeholder="Enter Asset Type"
                                                        />
                                                    </div> */}
                                                </div>
                                                <div className="col-span-3">
                                                    <InputField
                                                        register={register}
                                                        label="Serial Number"
                                                        placeholder="Serial Number"
                                                        name="serial_no"
                                                        disabled

                                                    />
                                                    {/* <AlertInput>{errors?.serial_no?.message}</AlertInput> */}
                                                </div>
                                                <div className="col-span-6 grid grid-cols-9 gap-7">
                                                    <div className="col-span-3">
                                                        <InputField
                                                            name={"parentId"}
                                                            register={register}
                                                            // setValue={setValue}
                                                            // value={getValues("parentId")?.toString()}
                                                            label={"Parent Asset"}
                                                            // placeholder={"Select parent asset"}
                                                            // data={assetsList ?? []}
                                                            disabled

                                                        />
                                                        {/* <AlertInput>{errors?.parentId?.message}</AlertInput> */}
                                                    </div>
                                                    <div className="col-span-3">
                                                        <InputField
                                                            name={"assetProjectId"}
                                                            register={register}
                                                            // setValue={setValue}
                                                            // value={getValues("assetProjectId")?.toString()}
                                                            label={"Project"}
                                                            // placeholder={"Select project"}
                                                            // data={projectsList ?? []}
                                                            disabled

                                                        />
                                                        {/* <AlertInput>{errors?.assetProjectId?.message}</AlertInput> */}
                                                    </div>
                                                    <div className="col-span-3">
                                                        <InputField
                                                            name={"vendorId"}
                                                            register={register}
                                                            // setValue={setValue}
                                                            // value={getValues("vendorId")?.toString()}
                                                            label={"Vendor"}
                                                            // placeholder={"Select vendor"}
                                                            // data={vendorsList ?? []}
                                                            disabled

                                                        />
                                                        {/* <AlertInput>{errors?.vendorId?.message}</AlertInput> */}
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <InputField
                                                        // required
                                                        register={register}
                                                        label="Model Name"
                                                        placeholder="Model Name"
                                                        name="model.name"
                                                        disabled

                                                    />
                                                    {/* <AlertInput>{errors?.model?.name?.message}</AlertInput> */}
                                                </div>
                                                <div className="col-span-6 grid grid-cols-9 gap-7">
                                                    <div className="col-span-3">
                                                        <InputField
                                                            register={register}
                                                            label="Model Brand"
                                                            placeholder="Model Brand"
                                                            name="model.brand"
                                                            disabled
                                                        />
                                                        {/* <AlertInput>{errors?.model?.brand?.message}</AlertInput> */}
                                                    </div>
                                                    <div className="col-span-3">
                                                        <InputField
                                                            register={register}
                                                            label="Model Number"
                                                            placeholder="Model Number"
                                                            name="model.number"
                                                            disabled
                                                        />
                                                        {/* <AlertInput>{errors?.model?.number?.message}</AlertInput> */}
                                                    </div>
                                                    <div className="col-span-3">
                                                        <InputField
                                                            register={register}
                                                            label="Asset Lifetime"
                                                            placeholder="Months"
                                                            name={"management.asset_lifetime"}
                                                            disabled


                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-9 grid grid-cols-12 gap-7">
                                                    <div className="col-span-3">
                                                        <InputField
                                                            register={register}
                                                            label="Original Cost"
                                                            placeholder="Original Cost"
                                                            name="management.original_cost"
                                                            disabled
                                                        />
                                                        {/* <AlertInput>
                                                            {errors?.management?.original_cost?.message}
                                                        </AlertInput> */}
                                                    </div>
                                                    <div className="col-span-3">
                                                        <InputField
                                                            register={register}
                                                            label="Current Cost"
                                                            placeholder="Current Cost"
                                                            name="management.current_cost"
                                                            disabled
                                                        />
                                                        {/* <AlertInput>
                                                            {errors?.management?.current_cost?.message}
                                                        </AlertInput> */}
                                                    </div>

                                                    <div className="col-span-3">
                                                        <InputField
                                                            register={register}
                                                            label="Residual Value"
                                                            placeholder="Residual Value"
                                                            name={"management.residual_value"}
                                                            disabled
                                                        />
                                                        {/* <AlertInput>
                                                            {errors?.management?.residual_value?.message}
                                                        </AlertInput> */}
                                                    </div>
                                                    <div className=" col-span-3">
                                                        <InputField
                                                            type="number"
                                                            register={register}
                                                            label="Residual Value Percentage"
                                                            placeholder="Residual Value Percentage"
                                                            name={"management.residual_percentage"}
                                                            disabled
                                                        />
                                                    </div>

                                                </div>





                                                <div className="col-span-9">


                                                    <Textarea
                                                        value={asset?.description ?? ""}
                                                        label="Asset Description"
                                                        minRows={6}
                                                        maxRows={6}
                                                        readOnly
                                                        classNames={{
                                                            input:
                                                                " w-full border-2 border-gray-400 outline-none focus:border-gray-400 cursor-default focus:outline-none focus:ring-0 mt-2 bg-gray-200 text-gray-400",
                                                            label:
                                                                "font-sans text-sm font-normal text-gray-600 text-light",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>

                                    <Accordion.Item value={"2"} className="">
                                        <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <CircleNumber2 className="h-7 w-7" color="gold"></CircleNumber2>{" "}
                                                <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                                                    General Information
                                                </p>
                                            </div>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="grid gap-7">
                                                <div className="grid grid-cols-9 col-span-9 gap-7">
                                                    <div className="col-span-4">
                                                        <InputField
                                                            name={"subsidiary.name"}
                                                            register={register}
                                                            label={"Company"}
                                                            placeholder={"Select company or subsidiary"}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="col-span-8">
                                                        <div className="text-gray-700">
                                                            <div className="flex flex-1 flex-col gap-2">
                                                                <label htmlFor="address" className="text-sm">
                                                                    Company Address
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id={"address"}
                                                                    className={
                                                                        "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                                                                    }
                                                                    placeholder={company_address?.address
                                                                        ? getAddress(company_address)
                                                                        : ""}
                                                                    value={
                                                                        company_address?.address
                                                                            ? getAddress(company_address)
                                                                            : ""
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-12 grid grid-cols-12 gap-7">
                                                        <div className="col-span-3">
                                                            <InputField
                                                                name={"department.name"}
                                                                register={register}
                                                                label={"Department"}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <div className="text-gray-700">
                                                                <div className=" gap-2">
                                                                    <InputField
                                                                        name={"department.location.floor"}
                                                                        register={register}
                                                                        label={"Floor"}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <div className="text-gray-700">
                                                                <div className=" gap-2">
                                                                    <InputField
                                                                        name={"department.location.room"}
                                                                        register={register}
                                                                        label={"Room"}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <InputField
                                                                name={"custodian.name"}
                                                                register={register}
                                                                label={"Custodian"}
                                                                disabled
                                                            />
                                                        </div>

                                                    </div>
                                                    <div className="col-span-12 grid grid-cols-12 gap-7 ">
                                                        <div className="col-span-2">
                                                            <InputField
                                                                name={"model.class.name"}
                                                                register={register}
                                                                label={"Class"}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-span-2">

                                                            <InputField
                                                                name={"model.category.name"}
                                                                register={register}
                                                                label={"Category"}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <InputField
                                                                name={"model.type.name"}
                                                                register={register}
                                                                label={"Type"}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-span-6">
                                                            <InputField
                                                                register={register}
                                                                label="Asset Location"
                                                                placeholder="Asset Location"
                                                                name="management.asset_location"

                                                                disabled
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-9 col-span-9 gap-7">
                                                    <div className="col-span-3">

                                                        <InputField

                                                            name={"management.currency"}
                                                            register={register}

                                                            label={"Currency"}
                                                            disabled
                                                        />
                                                    </div>

                                                    <div className="col-span-3">


                                                        <InputField

                                                            name={"management.accounting_method"}
                                                            register={register}

                                                            label={"Accounting Method"}
                                                            disabled
                                                        />
                                                    </div>

                                                    <div className="col-span-3 space-y-2">

                                                        <InputField

                                                            name={"management.purchase_date"}
                                                            register={register}

                                                            label={"Purchase Date"}
                                                            disabled
                                                        />
                                                    </div>

                                                </div>


                                                <div className="col-span-9 grid grid-cols-6 gap-7">
                                                    <div className="col-span-2">

                                                        <InputField

                                                            name={"management.depreciation_rule"}
                                                            register={register}

                                                            label={"Depreciation Method"}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">

                                                        <InputField

                                                            name={"management.depreciation_start"}
                                                            register={register}

                                                            label={"Depreciation Start Date"}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">

                                                        <InputField

                                                            name={"management.depreciation_end"}
                                                            register={register}

                                                            label={"Depreciation End Date"}
                                                            disabled
                                                        />
                                                    </div>

                                                </div>

                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>

                                    <Accordion.Item value={"3"} className="">
                                        <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <CircleNumber3 className="h-7 w-7" color="gold"></CircleNumber3>{" "}
                                                <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">Asset Usage</p>
                                            </div>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="grid grid-cols-9 col-span-9 gap-7">
                                                <div className="col-span-3 space-y-2">
                                                    <InputField
                                                        // query={companyId}
                                                        // setQuery={setCompanyId}
                                                        // required
                                                        name={"management.depreciation_start"}
                                                        register={register}
                                                        // setValue={setValue}
                                                        // value={getValues("subsidiaryId")?.toString()}
                                                        label={"Date of Usage"}
                                                        // placeholder={"Select company or subsidiary"}
                                                        disabled
                                                    // data={companyList ?? []}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <InputField
                                                        // query={companyId}
                                                        // setQuery={setCompanyId}
                                                        // required
                                                        name={"management.depreciation_period"}
                                                        register={register}
                                                        // setValue={setValue}
                                                        // value={getValues("subsidiaryId")?.toString()}
                                                        label={"Period (month/s)"}
                                                        // placeholder={"Select company or subsidiary"}
                                                        disabled
                                                    // data={companyList ?? []}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <InputField
                                                        // query={companyId}
                                                        // setQuery={setCompanyId}
                                                        // required
                                                        name={"management.asset_quantity"}
                                                        register={register}
                                                        // setValue={setValue}
                                                        // value={getValues("subsidiaryId")?.toString()}
                                                        label={"Asset Quantity"}
                                                        // placeholder={"Select company or subsidiary"}
                                                        disabled
                                                    // data={companyList ?? []}
                                                    />
                                                </div>
                                                <div className="col-span-9">
                                                    <Textarea
                                                        value={asset?.remarks ?? ""}
                                                        // onChange={(event) => {
                                                        //     const text = event.currentTarget.value
                                                        //     setDescription(text)
                                                        //     setValue("description", text)
                                                        // }}
                                                        // placeholder="Asset Description"
                                                        label="Remarks"
                                                        minRows={6}
                                                        maxRows={6}
                                                        readOnly
                                                        classNames={{
                                                            input:
                                                                " w-full border-2 border-gray-400 outline-none focus:border-gray-400 cursor-default focus:outline-none focus:ring-0 mt-2 bg-gray-200 text-gray-400",
                                                            label:
                                                                "font-sans text-sm font-normal text-gray-600 text-light",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                <hr className="w-full"></hr>
                                <div className="align-center flex w-full flex-col justify-center gap-4 py-3">
                                    <div className="flex w-full justify-center gap-3">
                                        <button
                                            type="button"
                                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="flex w-full justify-center">
                                        <button
                                            type="button"
                                            className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={resetTransferAsset}
                                        >
                                            Cancel Process
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {state.currentStep == 1 && (
                    <div className="rounded-md bg-white drop-shadow-lg">

                        <div className="p-5">
                            <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text p-2 font-sans text-xl font-semibold uppercase text-transparent">
                                Location
                            </p>
                            <div className="flex flex-wrap py-2">
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Department</label>
                                        <Select
                                            disabled={checked}
                                            placeholder="Select Department"
                                            onChange={(value) => {
                                                setSelectedDept(value ?? "")
                                                setSelectedEMP("")
                                                setValue("departmentId", Number(value))
                                                console.log(value)
                                            }}
                                            value={selectedDept ?? ""}
                                            data={departmentList}
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
                                            className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Employee</label>
                                        <Select
                                            disabled={checked}
                                            placeholder="Select Employee"
                                            onChange={(value) => {
                                                setSelectedEMP(value ?? "")
                                                console.log(employeeList)
                                                setValue("custodianId", Number(value))
                                            }}
                                            value={selectedEMP}
                                            data={employeeList}
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
                                            className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <div className="flex flex-row gap-2 mb-2">
                                            <label className="font-semibold w-full">Floor</label>
                                            <label className="font-semibold w-full">Room</label>
                                        </div>

                                        <div className="flex flex-row gap-2">
                                            <input
                                                type="text"
                                                id={"floor"}
                                                className={
                                                    "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                                                }
                                                placeholder="Floor no."
                                                value={department?.location?.floor ?? ""}
                                                disabled
                                            />

                                            <input
                                                type="text"
                                                id={"floor"}
                                                className={
                                                    "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                                                }
                                                placeholder="Room no."
                                                value={department?.location?.room ?? ""}
                                                disabled
                                            /></div>
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Transfer Date</label>
                                        <DatePicker
                                            dropdownType="popover"
                                            placeholder="Pick Date"
                                            size="sm"
                                            variant="unstyled"
                                            // value={props.date}
                                            // onChange={(value) => {
                                            //     setValue("hired_date", value)
                                            //     value === null
                                            //         ? props.setDate(new Date())
                                            //         : props.setDate(value)
                                            // }}
                                            className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>

                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 px-4">
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => {
                                            setChecked(event.currentTarget.checked)
                                            setValue("departmentId", 0)
                                            setValue("custodianId", 0)
                                            setSelectedDept("")
                                            setSelectedEMP("")
                                        }}
                                        label="Return Asset"
                                        color="orange"
                                    />
                                </div>
                                {/* <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-[60%] py-2">
                                    <label className="font-semibold">Remarks</label >
                                    <textarea rows={6} className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                                </div>
                            </div> */}
                            </div>
                            <hr className="w-full"></hr>
                            <div className="align-center flex w-full flex-col justify-center gap-4 py-3">
                                <div className="flex w-full justify-center gap-3">
                                    <button
                                        type="button"
                                        className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={prevStep}
                                    >
                                        Back
                                    </button>
                                    {((selectedEMP !== "") || checked) && ( //TODO: add transfer_date to schema and to this conditional statement
                                        <button
                                            type="button"
                                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                                <div className="flex w-full justify-center">
                                    <button
                                        type="button"
                                        className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={resetTransferAsset}
                                    >
                                        Cancel Process
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {state.currentStep == 2 && (
                    <div className="rounded-md bg-white drop-shadow-lg">
                        <div className="p-5">
                            <div className="flex flex-wrap py-2">
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Asset Number</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="number"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Asset Name</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">
                                            Alternate Asset Number
                                        </label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="alt_number"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Parent Asset</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="parent.name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex w-[60%] flex-col py-2">
                                        <label className="font-semibold">Project</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="project.name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex w-[60%] flex-col py-2">
                                        <label className="font-semibold">Asset Type</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="model.type.name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Residual Value</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="management.residual_value"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">
                                            Residual Value Percentage
                                        </label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="management.residual_value"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-[60%] flex-col py-2">
                                        <label className="font-semibold">Asset Description</label>
                                        <textarea
                                            value={asset?.description ?? ""}
                                            readOnly
                                            className="resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Deprciation Method</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="management.depreciation_rule"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Asset Lifetime</label>
                                        <p className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                                            {getLifetime(
                                                asset?.management?.depreciation_start ?? new Date(),
                                                asset?.management?.depreciation_end ?? new Date()
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Asset Serial Number</label>
                                        <InputField
                                            disabled={true}
                                            register={register}
                                            name="serial_no"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Department</label>
                                        <p className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                                            {department?.name ?? "To Return Asset"}
                                        </p>
                                    </div>
                                    <div className="flex w-full flex-col py-2">
                                        <label className="font-semibold">Employee</label>
                                        <p className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                                            {employee?.name ?? "To Return Asset"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                    <div className="flex w-[60%] flex-col py-2">
                                        <label className="font-semibold">Remarks</label>
                                        <textarea
                                            rows={6}
                                            onChange={(e) =>
                                                setValue("remarks", e.currentTarget.value)
                                            }
                                            className="resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        ></textarea>
                                    </div>
                                </div>

                                <hr className="w-full"></hr>

                                <div className="align-center flex w-full flex-col justify-center gap-4 py-3">
                                    <div className="flex w-full justify-center gap-3">
                                        <button
                                            type="button"
                                            className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={prevStep}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                    <div className="flex w-full justify-center">
                                        <button
                                            type="button"
                                            className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={resetTransferAsset}
                                        >
                                            Cancel Process
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            <Modal
                isVisible={completeModal}
                setIsVisible={setCompleteModal}
                className="max-w-2xl"
                title="Transfer Complete"
            >
                <div className="flex w-full flex-col px-4 py-2">
                    <div>
                        <p className="text-center text-lg font-semibold">
                            Asset Transfer successful.
                        </p>
                    </div>
                    <div className=" flex justify-end pt-2">
                        <Link href={"/assets"}>
                            <button
                                className=" pt-1 rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                onClick={resetTransferAsset}
                            >
                                Return to Assets tab
                            </button>
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Transfer

//{<i className={`fa-sharp fa-solid fa-arrow-right-arrow-left ${active == 1 ? "text-tangerine-600" : ""}`}
//E0E0E0

// <div>
// <Stepper size="xl" iconPosition="left" active={active} color="orange.4" onStepClick={setActive} completedIcon={<Check size={35} strokeWidth={2} color={'#FFFFFF'} />
// }>
//     <Stepper.Step icon={<i className="fa-solid fa-info text-[#F59E0B]" />} label="Step 1" description="Check Asset Details" />
//     <Stepper.Step icon={<ArrowsExchange
//         size={35}
//         strokeWidth={2}
//         color={active === 1 ? '#F59E0B' : "#E0E0E0"}
//     />} label="Transfer Asset" description="Verify email" />
//     <Stepper.Step icon={<Checks
//         size={35}
//         strokeWidth={2}
//         color={active === 2 ? '#F59E0B' : "#E0E0E0"}
//     />} label="Step 3" description="Confirmation" completedIcon={<Checks
//         size={35}
//         strokeWidth={2}
//         color={active === 2 ? '#F59E0B' : "#E0E0E0"}
//     />} />
// </Stepper>

// </div>

// <Link href={"/assets/create"}>