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
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetEditInput, AssetTransferCreateInput } from "../../../server/schemas/asset"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { SelectValueType } from "../../atoms/select/TypeSelect"
import { getAddress, getLifetime } from "../../../lib/functions"
import Modal from "../../headless/modal/modal"
import Link from "next/link"
import { useTransferAssetStore } from "../../../store/useStore"
import { DatePicker } from "@mantine/dates"
import { AssetTransfer } from "@prisma/client"
import { AssetTransferValues } from "../../../types/generic"
import { stringify } from "superjson"

export type Transfer = z.infer<typeof AssetTransferCreateInput>

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
    const [validateModal, setValidateModal] = useState<boolean>(false)

    const [validateString, setValidateString] = useState<string>("")



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

    // const utils = trpc.useContext()

    const { mutate } = trpc.assetTransfer.create.useMutation({
        onSuccess() {
            setCompleteModal(true)
            // invalidate query of asset id when mutations is successful
            // utils.assetTransfer.findAll.invalidate()
        },
    })

    const { register, handleSubmit, reset, setValue, formState: { errors }, } = useForm<Transfer>({
        resolver: zodResolver(AssetTransferCreateInput),
    })



    // useEffect(() => reset(asset as unknown as Transfer), [asset, reset])

    // const onSubmit = (asset: Transfer) => {
    //     // Register function
    //     console.log("oms")
    //     mutate({
    //         ...asset,
    //         departmentId: asset.departmentId ?? 2,
    //         custodianId: asset.custodianId ?? 2,
    //     })
    //     reset()
    // }

    const updateAsset = trpc.asset.edit.useMutation({
        onSuccess() {
            console.log("omsim")
        },
    })
    const updateDept = trpc.employee.edit.useMutation({
        onSuccess() {
            console.log("omsim")
        },
    })


    const onSubmit = (transfer: Transfer) => {
        if (asset?.status === null || asset?.status === undefined || asset?.status === "") {
            mutate({
                ...transfer,
                transferStatus: "pending",
                assetId: asset?.id ?? 0
            })
            updateAsset.mutate({
                ...asset,
                id: asset?.id ?? 0,
                status: "transfer",
                custodianId: Number(selectedEMP)
            })
            reset()
        }
        else {
            if (asset?.status === "disposal") {
                setValidateString("The asset is in for disposal")
                setValidateModal(true)
                setAssetNumber("")
            } else if (asset?.status === "repair") {
                setValidateString("The asset is in for repair.")
                setValidateModal(true)
                setAssetNumber("")
            } else if (asset?.status === "transfer") {
                setValidateString("The asset is being transferred.")
                setValidateModal(true)
                setAssetNumber("")
            }
        }
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


    const [transfer_date, setTransfer_date] = useState<Date | null>(null)

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

            <Modal
                className="max-w-lg"
                isVisible={validateModal}
                setIsVisible={setValidateModal}
                title="NOTICE!!"
            >
                <div className="py-2">
                    <p className="text-center text-lg font-semibold">{validateString}</p>
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
                                Transfer Details
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
                                                setValue("departmentCode", String(value))
                                                console.log("TEST: " + employeeData)
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
                                        <div className="relative">
                                            <DatePicker
                                                placeholder={""}
                                                allowFreeInput
                                                size="sm"
                                                onChange={(value) => {
                                                    setTransfer_date(value),
                                                        setValue("transferDate", value)
                                                }}
                                                classNames={{
                                                    input:
                                                        "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                                                }}
                                            />
                                            <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                                                <span className="opacity-50">
                                                    {transfer_date ? "" : "Month, Day, Year"}
                                                </span>
                                                <span className="pointer-events-none pr-3">📅</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex w-full flex-row justify-between gap-7 px-4">
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => {
                                            setChecked(event.currentTarget.checked)
                                            setValue("departmentCode", "0")
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
                                    {/* {((selectedEMP !== "") || checked) && ( //TODO: add transfer_date to schema and to this conditional statement */}
                                    <button
                                        type="button"
                                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={nextStep}
                                    >
                                        Next
                                    </button>
                                    {/* )} */}
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
                                            onClick={() => { console.log("jejeje" + stringify(errors)) }}
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