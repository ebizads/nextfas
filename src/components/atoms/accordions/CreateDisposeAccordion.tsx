import { Accordion, Select } from "@mantine/core"
import { useStepper } from "headless-stepper";
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import { ArrowsExchange, Check, Checks, Circle1, Circle2, Circle3, Search } from "tabler-icons-react";
import { z } from "zod/lib";
import { AssetDisposalCreateInput } from "../../../server/schemas/asset";
import { trpc } from "../../../utils/trpc";
import Modal from "../../headless/modal/modal";
import InputField from "../forms/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLifetime } from "../../../lib/functions";
import { DatePicker } from "@mantine/dates";
import { SelectValueType } from "../select/TypeSelect";
import Link from "next/link";
import AlertInput from "../forms/AlertInput";
import { AssetFieldValues } from "../../../types/generic";

export type Dispose = z.infer<typeof AssetDisposalCreateInput>

const CreateDisposeAccordion = () => {

    const [assetNumber, setAssetNumber] = useState<string>('');
    const [searchAsset, setSearchAsset] = useState<string>('');
    const [validateString, setValidateString] = useState<string>('');

    const [assetId, setAssetId] = useState<number>(0);

    const [searchModal, setSearchModal] = useState<boolean>(false);
    const [completeModal, setCompleteModal] = useState<boolean>(false);
    const [validateModal, setValidateModal] = useState<boolean>(false);


    const [disposeDate, setDisposeDate] = useState<Date>(new Date());
    const [completionDate, setCompletionDate] = useState<Date>(new Date());

    const [selectedType, setSelectedType] = useState<string>("1");

    // const [xAsset, setXAsset] = useState<object | undefined | null>(null)

    const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase());
    const { data: disposalTypes } = trpc.disposalType.findAll.useQuery();
    const { data: disposalAsset } = trpc.assetDisposal.findAsset.useQuery(assetId);
    const { data: repairAsset } = trpc.assetRepair.findAsset.useQuery(assetId);


    //const utils = trpc.useContext()


    const disposalTypeList = useMemo(() => {
        const list = disposalTypes?.disposalTypes.map((employee) => { return { value: employee.id.toString(), label: employee.name } }) as SelectValueType[]
        return list ?? []
    }, [disposalTypes]) as SelectValueType[]

    const {
        mutate,
    } = trpc.assetDisposal.create.useMutation({
        onSuccess() {
            setCompleteModal(true);
            // invalidate query of asset id when mutations is successful
            // utils.asset.findAll.invalidate()
        },

    })

    const updateAsset = trpc.asset.edit.useMutation({
        onSuccess() {
            console.log("omsim");
        },
    })

    const {
        register,
        handleSubmit,
        reset,
        resetField,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<Dispose>({
        resolver: zodResolver(AssetDisposalCreateInput),
        defaultValues: {
            disposalTypeId: Number(selectedType)
        }
    })

    const onSubmit = (dispose: Dispose) => {

        mutate({
            ...dispose,
            assetId: asset?.id ?? 0,
            disposalTypeId: Number(selectedType) ?? 0,
            disposalStatus: "pending",
        })

        updateAsset.mutate({
            ...asset as AssetFieldValues,
            id: asset?.id ?? 0,
            status: "disposal"
        });

        reset()
    }


    useEffect(() => {
        getValues('disposalTypeId') === 1 ? setValue("customerName", "") : resetField("customerName")
        getValues('disposalTypeId') === 1 ? setValue("telephoneNo", "") : resetField("telephoneNo")
        getValues('disposalTypeId') === 1 ? setValue("apInvoice", "") : resetField("apInvoice")
        getValues('disposalTypeId') === 1 ? setValue("salesInvoice", "") : resetField("salesInvoice")
        getValues('disposalTypeId') === 1 ? setValue("agreedPrice", 0) : resetField("agreedPrice")
        getValues('disposalTypeId') === 1 ? setValue("disposalPrice", 0) : resetField("disposalPrice")
    }, [getValues, resetField, setValue, selectedType])

    useEffect(() => {
        setValue("assetId", asset?.id ?? 0);
    }, [setValue, asset])


    useEffect(() => {
        setAssetId(asset?.id ?? 0);
    }, [assetNumber, asset])


    useEffect(() => {
        if (assetNumber !== "") {
            if (asset === null) {
                setSearchModal(true)
            } else if (asset?.status === "disposal") {
                setValidateString("The asset is already in for disposal")
                setValidateModal(true);
                setAssetNumber("");
            } else if (asset?.status === "repair") {
                setValidateString("The asset is in for repair.")
                setValidateModal(true);
                setAssetNumber("");
            }

        }


    }, [asset, assetNumber, assetId])



    const steps = useMemo(
        () => [
            {
                label: "Check Asset Details",
                icon: <><i className="fa-solid fa-info text-white" /></>,
            },
            {
                label: "Dispose Asset",
                icon: <>    < ArrowsExchange
                    size={25}
                    strokeWidth={2}
                    color={"#E0E0E0 "} /></>
            },
            {
                label: "Confirmation",
                icon: <>    < Checks
                    size={25}
                    strokeWidth={2}
                    color={"#E0E0E0 "} /></>
            },
        ],
        []
    );

    const { state, stepperProps, stepsProps, nextStep, prevStep, } = useStepper({
        steps
    });


    return (
        <div className="px-4">
            <div>
                <nav className="my-4 w-100 grid grid-cols-6" {...stepperProps}>
                    <ol className="col-span-full flex flex-row z-1">
                        {stepsProps?.map((step, index) => (
                            <li className={`flex justify-center ${index !== 2 ? "w-full" : ""}`} key={index}>
                                <div className="flex flex-col gap-2 w-full">

                                    <div className="flex gap-4 items-center w-full">

                                        {state.currentStep > index ?
                                            <span
                                                className={`flex items-center justify-center w-9 h-9 border border-full rounded-full border-transparent group-focus:ring-2 group-focus:ring-offset-2 transition-colors ease-in-out ${state?.currentStep >= index
                                                    ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                                                    : ""
                                                    }`}
                                            >
                                                <Check size={25}
                                                    strokeWidth={2} />
                                            </span>
                                            :
                                            < span
                                                className={`flex items-center justify-center bg-white text-black w-8 h-8 border border-full rounded-full ring-tangerine-500 group-focus:ring-2 group-focus:ring-offset-2 transition-colors ease-in-out ${state?.currentStep >= index
                                                    ? "bg-[#B45309] text-white ring-2 ring-offset-2"
                                                    : ""
                                                    }`}
                                            >

                                                {steps[index]?.icon}
                                            </span>

                                        }


                                        {<div className={`border h-2 flex-1 mr-4 rounded ${index !== 2 ? "" : "invisible"} ${state?.currentStep > index ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white" : "bg-[#ECECEC]"}`} />}
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
            {state.currentStep === 0 &&
                <div className="w-full py-4">
                    <div className="flex flex-row bg-[#F2F2F2] w-80 border border-[#F2F2F2] rounded-sm px-4 py-2">
                        <input type="text" onChange={(event) => {
                            setSearchAsset(event.currentTarget.value)
                        }} placeholder="Search/Input Asset Number" className="bg-transparent w-[100%] outline-none focus:outline-none text-sm" />
                        <button onClick={() => {
                            setAssetNumber(searchAsset);
                        }}><Search className="bg-transparent outline-none focus:outline-none" /></button>
                    </div>
                </div>
            }

            <Modal className="max-w-lg" isVisible={searchModal} setIsVisible={setSearchModal} title="NOTICE!!" >
                <div className="py-2">
                    <p className="text-center text-lg font-semibold">No Data Found!</p>
                </div>
            </Modal>
            <Modal className="max-w-lg" isVisible={validateModal} setIsVisible={setValidateModal} title="NOTICE!!" >
                <div className="py-2">
                    <p className="text-center text-lg font-semibold">{validateString}</p>
                </div>
            </Modal>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate>
                {asset !== null && (state.currentStep === 0 &&
                    <div>
                        <div className="bg-white rounded-md drop-shadow-lg">
                            <div className="p-5">
                                <Accordion defaultValue="transfer">
                                    <Accordion.Item value="Asset Details">
                                        <Accordion.Control><div className="flex flex-row"><Circle1 className="w-7 h-7" color="gold"></Circle1> <p className="font-semibold px-2 text-transparent text-xl bg-clip-text bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 uppercase font-sans">Asset Details</p></div></Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="py-2 flex flex-wrap">
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Number</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.number ?? ""}</p>
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Name</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.name ?? ""}</p>
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Alternate Asset Number</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.alt_number ?? ""}</p>
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Parent Asset</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.parent?.name ?? ""}</p>
                                                    </div>
                                                    <div className="flex flex-col w-[60%] py-2">
                                                        <label className="font-semibold">Project</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.project?.name ?? ""}</p>
                                                    </div>
                                                    <div className="flex flex-col w-[60%] py-2">
                                                        <label className="font-semibold">Asset Type</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.model?.type?.name ?? ""}</p>

                                                    </div>
                                                </div>

                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-[60%] py-2">
                                                        <label className="font-semibold">Asset Description</label >
                                                        <textarea value={asset?.description ?? ""} readOnly className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Accounting Method</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.depreciation_rule ?? ""}</p>

                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Lifetime</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{getLifetime(asset?.management?.depreciation_start ?? new Date(), asset?.management?.depreciation_end ?? new Date())}</p>
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Serial Number</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.number ?? ""}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>

                                    <Accordion.Item value="general_information">
                                        <Accordion.Control><div className="flex flex-row"><Circle2 className="w-7 h-7" color="gold"></Circle2> <p className="font-semibold px-2 text-transparent text-xl bg-clip-text bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 uppercase font-sans">General Information</p></div></Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="py-2 flex flex-wrap">
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Subsidiary</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.subsidiary?.name ?? ""}</p>

                                                    </div>

                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Custodian</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.custodian?.name ?? ""}</p>

                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Purchase Date</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.purchase_date?.toString() ?? ""}</p>

                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Department</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.department?.name ?? ""}</p>

                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Class</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.model?.class?.name ?? ""}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>

                                    <Accordion.Item value="focus-ring">
                                        <Accordion.Control><div className="flex flex-row"><Circle3 className="w-7 h-7" color="gold"></Circle3> <p className="font-semibold px-2 text-transparent text-xl bg-clip-text bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 uppercase font-sans">Asset Usage Information</p></div></Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="py-2 flex flex-wrap">
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Depreciation Start Date</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.depreciation_start?.toString() ?? ""}</p>

                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Depreciation End Date</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.depreciation_end?.toString() ?? ""}</p>

                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Period</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.depreciation_period ?? ""}</p>

                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Original Cost</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.original_cost ?? ""}</p>

                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Current Cost</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.current_cost ?? ""}</p>

                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Depreciation Method</label >
                                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.depreciation_rule ?? ""}</p>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Currency</label >
                                                    <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.currency ?? ""}</p>

                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Residual Value</label >
                                                    <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.management?.residual_value ?? ""}</p>

                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                <hr className="w-full"></hr>
                                <div className="flex w-full justify-end py-3">

                                    <button
                                        type="button"
                                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={nextStep}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {state.currentStep === 1 &&
                    <div>
                        <div className="bg-white rounded-md drop-shadow-lg">
                            <div className="p-5">
                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Method of Disposal</label >
                                        <Select
                                            placeholder="Pick one"

                                            onChange={(value) => {
                                                setSelectedType(value ?? "");
                                                setValue("disposalTypeId", Number(value));
                                                console.log(value);
                                            }}
                                            value={selectedType}
                                            data={disposalTypeList}
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
                                            className="w-full rounded-md border-2 my-2 border-gray-400 bg-transparent px-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">CUFS Code String</label >

                                        <InputField
                                            register={register}
                                            name="cufsCodeString"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Disposal Date</label >
                                        <DatePicker
                                            onChange={(value) => {
                                                setDisposeDate(value as Date);
                                                setValue("disposalDate", value as Date);
                                            }}
                                            value={disposeDate}
                                            minDate={new Date()}
                                            dropdownType="modal"
                                            placeholder="Pick Date"
                                            size="sm"
                                            variant="unstyled"
                                            className="w-full rounded-md border-2 mt-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Date of Completion</label >
                                        <DatePicker
                                            onChange={(value) => {
                                                setCompletionDate(value as Date)
                                                setValue("completionDate", value as Date);
                                            }}
                                            value={completionDate}
                                            minDate={new Date()}
                                            dropdownType="modal"
                                            placeholder="Pick Date"
                                            size="sm"
                                            variant="unstyled"
                                            className="w-full rounded-md border-2 mt-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>

                                </div>
                                {
                                    selectedType !== '1' && <div>
                                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                                            <div className="flex flex-col w-full">
                                                <label className="font-semibold">Customer Name</label >
                                                <InputField
                                                    register={register}
                                                    name="customerName"
                                                    type={"text"}
                                                    label={""}
                                                />
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <label className="font-semibold">Telephone No.</label >
                                                <InputField
                                                    register={register}
                                                    name="telephoneNo"
                                                    type={"text"}
                                                    label={""}
                                                />
                                            </div>
                                        </div>
                                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                                            <div className="flex flex-col w-full">
                                                <label className="font-semibold">AP Invoice Number</label >
                                                <InputField
                                                    register={register}
                                                    name="apInvoice"
                                                    type={"text"}
                                                    label={""}
                                                />
                                            </div>


                                            <div className="flex flex-col w-full">
                                                <label className="font-semibold">Sale Invoice Number</label >
                                                <InputField
                                                    register={register}
                                                    name="salesInvoice"
                                                    type={"text"}
                                                    label={""}
                                                />
                                            </div>
                                        </div>
                                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                                            <div className="flex flex-col w-full">
                                                <label className="font-semibold">Disposal Price</label >
                                                <InputField
                                                    register={register}
                                                    name="disposalPrice"
                                                    type={"number"}
                                                    label={""}
                                                />
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <label className="font-semibold">Agreed Price</label >
                                                <InputField
                                                    register={register}
                                                    name="agreedPrice"
                                                    type={"number"}
                                                    label={""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                <hr className="w-full"></hr>
                                <div className="flex w-full justify-between py-3">
                                    <button
                                        type="button"
                                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={prevStep}
                                    >
                                        Previous
                                    </button>
                                    {
                                        <button
                                            type="button"
                                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {state.currentStep === 2 &&
                    <div>
                        <div className="bg-white rounded-md drop-shadow-lg">
                            <div className="p-7">
                                <div className="flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Asset Number</label >
                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.number ?? ""}</p>
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Asset Name</label >
                                        <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{asset?.name ?? ""}</p>
                                    </div>
                                </div>
                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Method of Disposal</label >
                                        <Select
                                            disabled
                                            placeholder="Pick one"

                                            onChange={(value) => {
                                                setSelectedType(value ?? "");
                                                setValue("disposalTypeId", Number(value));
                                                console.log(value);
                                            }}

                                            value={selectedType}
                                            data={disposalTypeList}
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
                                            className="w-full rounded-md border-2 my-2 border-gray-400 bg-transparent px-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Disposal Date</label >
                                        <DatePicker
                                            disabled
                                            value={disposeDate}
                                            minDate={new Date()}
                                            dropdownType="modal"
                                            placeholder="Pick Date"
                                            size="sm"
                                            variant="unstyled"
                                            className="w-full rounded-md border-2 mt-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                        <AlertInput>{errors?.disposalDate?.message}</AlertInput>
                                    </div>

                                </div>

                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Customer Name</label >
                                        <InputField disabled
                                            register={register}
                                            name="customerName"
                                            type={"text"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.customerName?.message}</AlertInput>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Telephone No.</label >
                                        <InputField disabled
                                            register={register}
                                            name="telephoneNo"
                                            type={"text"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.telephoneNo?.message}</AlertInput>
                                    </div>
                                </div>
                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">AP Invoice Number</label >
                                        <InputField disabled
                                            register={register}
                                            name="apInvoice"
                                            type={"text"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.apInvoice?.message}</AlertInput>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Sale Invoice Number</label >
                                        <InputField disabled
                                            register={register}
                                            name="salesInvoice"
                                            type={"text"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.salesInvoice?.message}</AlertInput>
                                    </div>
                                </div>
                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Disposal Price</label >
                                        <InputField disabled
                                            register={register}
                                            name="disposalPrice"
                                            type={"number"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.disposalPrice?.message}</AlertInput>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Agreed Price</label >
                                        <InputField disabled
                                            register={register}
                                            name="agreedPrice"
                                            type={"number"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.agreedPrice?.message}</AlertInput>
                                    </div>
                                </div>
                                <div className="py-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Date of Completion</label >
                                        <DatePicker
                                            disabled
                                            value={completionDate}
                                            minDate={new Date()}
                                            dropdownType="modal"
                                            placeholder="Pick Date"
                                            size="sm"
                                            variant="unstyled"
                                            className="w-full rounded-md border-2 mt-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                        <AlertInput>{errors?.completionDate?.message}</AlertInput>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">CUFS Code String</label >
                                        <InputField
                                            disabled
                                            register={register}
                                            name="cufsCodeString"
                                            type={"text"}
                                            label={""}
                                        />
                                        <AlertInput>{errors?.cufsCodeString?.message}</AlertInput>
                                    </div>
                                </div>

                                <hr className="w-full"></hr>
                                <div className="flex w-full justify-between py-3">
                                    <button
                                        type="button"
                                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={prevStep}
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"

                                    >
                                        Dispose
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </form>
            <Modal isVisible={completeModal} setIsVisible={setCompleteModal} className="max-w-2xl" title="Transfer Complete" >
                <div className="px-4 py-2 flex flex-col w-full">
                    <div>
                        <p className="text-center text-lg font-semibold">Asset Transfer successful.</p>
                    </div>
                    <div className="flex justify-end py-2">
                        <Link href={"/assets"}>
                            <button className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                            >babu</button>
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    )

}

export default CreateDisposeAccordion
