import React, { useEffect, useState, useMemo } from "react"
import { useStepper } from "headless-stepper";
import { ArrowsExchange, Check, Checks, Circle1, Circle2, Circle3, Search, } from "tabler-icons-react";
import { Accordion, Checkbox, Select } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { InputField } from "../atoms/forms/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetEditInput } from "../../server/schemas/asset";
import { z } from "zod";
import { SelectValueType } from "../atoms/select/TypeSelect";

export type Assets = z.infer<typeof AssetEditInput>

const Transfer = () => {

    const [assetNumber, setAssetNumber] = useState<string>('');
    const [checked, setChecked] = useState(false);
    const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase());
    const { data: departmentData } = trpc.department.findAll.useQuery()

    const [selectedDept, setSelectedDept] = useState<string>("");
    const [selectedEMP, setSelectedEMP] = useState<string>("");

    const { data: employeeData } = trpc.employee.findAll.useQuery({
        search: {
            team: {
                department: {
                    name: selectedDept
                }
            }
        }
    })

    const employeeList = useMemo(() => {
        const list = employeeData?.employees.map((employee) => { return { value: employee.id.toString(), label: employee.name } }) as SelectValueType[]
        return list ?? []
    }, [employeeData]) as SelectValueType[]

    const departmentList = useMemo(() => {
        const list = departmentData?.departments.map((department) => { return { value: department.id.toString(), label: department.name } }) as SelectValueType[]
        return list ?? []
    }, [departmentData]) as SelectValueType[]




    const utils = trpc.useContext()

    const {
        mutate,
    } = trpc.asset.edit.useMutation({
        onSuccess() {
            // invalidate query of asset id when mutations is successful
            utils.asset.findAll.invalidate()
        },
    })
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<Assets>({
        resolver: zodResolver(AssetEditInput),
    })

    useEffect(() => reset(asset as Assets), [asset, reset])

    const onSubmit = async (asset: Assets) => {
        console.log("oms")
        // Register function
        mutate({
            departmentId: Number(selectedDept) ?? 1,
            custodianId: Number(selectedEMP) ?? 1,
            ...asset,
        })
        reset()
    }


    const steps = React.useMemo(
        () => [
            {
                label: "Check Asset Details",
                icon: <><i className="fa-solid fa-info text-white" /></>,
            },
            {
                label: "Transfer Asset",
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
            <div className="w-full py-4">
                <div className="flex flex-row bg-[#F2F2F2] w-80 border border-[#F2F2F2] rounded-sm px-4 py-2">
                    <input type="text" onChange={(event) => setAssetNumber(event.currentTarget.value)} placeholder="Search/Input Asset Number" className="bg-transparent w-[100%] outline-none focus:outline-none text-sm" />
                    <button onClick={() => {
                        console.log(asset);
                    }}><Search className="bg-transparent outline-none focus:outline-none" /></button>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
                noValidate>
                {state.currentStep === 0 &&
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
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="number"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Name</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Alternate Asset Number</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="alt_number"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Parent Asset</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="parent.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-[60%] py-2">
                                                        <label className="font-semibold">Project</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="project.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-[60%] py-2">
                                                        <label className="font-semibold">Asset Type</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="model.type.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Residual Value</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.residual_value"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Residual Value Percentage</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="name"
                                                            type={"text"}
                                                            label={""}
                                                        />
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
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.depreciation_rule"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Lifetime</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="serial_no"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Asset Serial Number</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="serial_no"
                                                            type={"text"}
                                                            label={""}
                                                        />
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
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="subsidiary.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Currency</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.currency"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Custodian</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="custodian.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Purchase Date</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.purchase_date"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Department</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="department.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Class</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="model.class.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
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
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.depreciation_start"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Depreciation End Date</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.depreciation_end"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Period</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.depreciation_period"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Original Cost</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.original_cost"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Current Cost</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.current_cost"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full py-2">
                                                        <label className="font-semibold">Depreciation Method</label >
                                                        <InputField disabled={true}
                                                            register={register}
                                                            name="management.depreciation_rule"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                    <div className="flex flex-col w-full py-2">
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                <hr className="w-full"></hr>
                                <div className="flex w-full justify-end py-3">

                                    <button
                                        // type="submit"
                                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                        onClick={nextStep}
                                    >
                                        {/* {employeeLoading ? "Loading..." : "Register"} */}
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}
                {state.currentStep == 1 && <div className="bg-white rounded-md drop-shadow-lg">
                    <div className="p-5">
                        <div className="py-2 flex flex-wrap">
                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">

                                <div className="flex flex-col w-full py-2">
                                    <label className="font-semibold">Department</label >
                                    <Select
                                        disabled={checked}
                                        placeholder="Select Department"
                                        onChange={(value) => {
                                            setSelectedDept(value ?? "");
                                            setSelectedEMP("");
                                            console.log(value);

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
                                        className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 p-0.5 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                    />
                                </div>
                                <div className="flex flex-col w-full py-2">
                                    <label className="font-semibold">Employee</label >
                                    <Select
                                        disabled={checked}
                                        placeholder="Select Employee"
                                        onChange={(value) => {
                                            setSelectedEMP(value ?? "");
                                            console.log(employeeList);

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
                                        className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 p-0.5 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                    />
                                </div>

                            </div>
                            <div className="px-4 flex flex-row justify-between w-full gap-7">
                                <Checkbox checked={checked} onChange={(event) => {
                                    setChecked(event.currentTarget.checked);
                                    setSelectedDept("1")
                                    setSelectedEMP("1")
                                }}
                                    label="Return Asset"
                                    color="orange"

                                />
                            </div>
                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-[60%] py-2">
                                    <label className="font-semibold">Remarks</label >
                                    <textarea rows={6} className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                                </div>
                            </div>
                        </div>
                        <hr className="w-full"></hr>
                        <div className="flex w-full justify-between py-3">
                            <button
                                // type="submit"
                                className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                onClick={prevStep}
                            >
                                {/* {employeeLoading ? "Loading..." : "Register"} */}
                                Back
                            </button>
                            <button
                                // type="submit"
                                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                onClick={nextStep}
                            >
                                {/* {employeeLoading ? "Loading..." : "Register"} */}
                                Next
                            </button>
                        </div>
                    </div>
                </div>}

                {state.currentStep == 2 &&
                    <div className="bg-white rounded-md drop-shadow-lg">
                        <div className="p-5">
                            <div className="py-2 flex flex-wrap">
                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Asset Number</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="number"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Asset Name</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Alternate Asset Number</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="alt_number"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Parent Asset</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="parent.name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-[60%] py-2">
                                        <label className="font-semibold">Project</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="project.name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-[60%] py-2">
                                        <label className="font-semibold">Asset Type</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="model.type.name"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                </div>
                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Residual Value</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="management.residual_value"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Residual Value Percentage</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="name"
                                            type={"text"}
                                            label={""}
                                        />
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
                                        <InputField disabled={true}
                                            register={register}
                                            name="management.depreciation_rule"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Asset Lifetime</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="serial_no"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Asset Serial Number</label >
                                        <InputField disabled={true}
                                            register={register}
                                            name="serial_no"
                                            type={"text"}
                                            label={""}
                                        />
                                    </div>

                                </div>
                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">

                                    <div className="flex flex-col w-full py-2">

                                        <label className="font-semibold">Department</label >
                                        <Select
                                            placeholder="Select Department"
                                            onChange={(value) => {
                                                setSelectedDept(value ?? "");
                                                setSelectedEMP("");
                                                console.log(value);

                                            }}
                                            value={selectedDept ?? ""}
                                            data={departmentData?.departments.map((value) => value.name) ?? []}
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
                                            className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 p-0.5 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full py-2">
                                        <label className="font-semibold">Employee</label >
                                        <Select
                                            placeholder="Select Employee"
                                            onChange={(value) => {
                                                setSelectedEMP(value ?? "");
                                                console.log(employeeList);

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
                                            className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 p-0.5 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                        />
                                    </div>

                                </div>
                                <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                    <div className="flex flex-col w-[60%] py-2">
                                        <label className="font-semibold">Remarks</label >
                                        <textarea rows={6} onChange={(e) => setValue('remarks', e.currentTarget.value)} className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                                    </div>
                                </div>

                                <hr className="w-full"></hr>
                                <div className="flex w-full justify-between py-3">
                                    <button
                                        // type="submit"
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
                            </div>

                        </div>
                    </div>
                }
            </form>
        </div >
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