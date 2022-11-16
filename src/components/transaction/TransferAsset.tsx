import React from "react"
import { useStepper } from "headless-stepper";
import { ArrowsExchange, Check, Checks, Circle1, Circle2, Circle3, Search, } from "tabler-icons-react";
import { Accordion } from "@mantine/core";


const Transfer = () => {

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


            {state.currentStep === 0 &&
                <div>
                    <div className="w-full py-4">
                        <div className="flex flex-row bg-[#F2F2F2] w-80 border border-[#F2F2F2] rounded-sm px-4 py-2">
                            <input type="text" placeholder="Search/Input Asset Number" className="bg-transparent w-[100%] outline-none focus:outline-none text-sm" />
                            <button><Search className="bg-transparent outline-none focus:outline-none" /></button>
                        </div>
                    </div>
                    <div className="bg-white rounded-md drop-shadow-lg">
                        <div className="p-5">
                            <Accordion defaultValue="transfer">
                                <Accordion.Item value="Asset Details">
                                    <Accordion.Control><div className="flex flex-row"><Circle1 className="w-7 h-7" color="gold"></Circle1> <p className="font-semibold px-2 text-transparent text-xl bg-clip-text bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 uppercase font-sans">Asset Details</p></div></Accordion.Control>
                                    <Accordion.Panel>
                                        <div className="py-2 flex flex-wrap">
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Asset Serial Number</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Asset Name</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Alternate Asset Number</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Parent Asset</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-[60%] py-2">
                                                    <label className="font-semibold">Project</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-[60%] py-2">
                                                    <label className="font-semibold">Asset Type</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Residual Value</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Residual Value Percentage</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-[60%] py-2">
                                                    <label className="font-semibold">Asset Description</label >
                                                    <textarea className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Accounting Method</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Asset Lifetime</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Generate Asset Number</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
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
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Currency</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Custodian</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-[60%] py-2">
                                                    <label className="font-semibold">Purchase Date</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Physical Location</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>

                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Department</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Class</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Location</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
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
                                                    <label className="font-semibold">Date</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Period</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                                <div className="flex flex-col w-full py-2">
                                                    <label className="font-semibold">Unit Head</label >
                                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                                </div>
                                            </div>
                                            <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                                <div className="flex flex-col w-[60%] py-2">
                                                    <label className="font-semibold">Comments</label >
                                                    <textarea rows={6} className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
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
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>
                            <div className="flex flex-col w-full py-2">
                                <label className="font-semibold">Employee</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>
                            <div className="flex flex-col w-full py-2">
                                <label className="font-semibold">Supervisor</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>
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

            {state.currentStep == 2 && <div className="bg-white rounded-md drop-shadow-lg">
                <div className="p-5">
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">

                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Asset Serial Number</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Asset Name</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Alternate Asset Number</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                    </div>
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Parent Asset</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-[60%] py-2">
                            <label className="font-semibold">Project</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-[60%] py-2">
                            <label className="font-semibold">Asset Type</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                    </div>
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Residual Value</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Residual Value Percentage</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                    </div>
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-[60%] py-2">
                            <label className="font-semibold">Asset Description</label >
                            <textarea className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                        </div>
                    </div>
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Accounting Method</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Asset Lifetime</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Generate Asset Number</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                    </div>
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Department</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Employee</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full py-2">
                            <label className="font-semibold">Supervisor</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                    </div>
                    <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-[60%] py-2">
                            <label className="font-semibold">Remarks</label >
                            <textarea rows={6} className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
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
            </div>
            }
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