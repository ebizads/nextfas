import { Select } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

const DisposeNew = () => {
    return (
        <DashboardLayout>
            <div className="rounded-lg p-8 m-2 bg-white">
                <h1> DISPOSAL </h1>
                <form>
                    <div className="py-2 flex flex-wrap px-2">
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Method of Disposal</label >
                                <Select
                                    placeholder="Pick one"

                                    value={"OPO"}
                                    data={["Throw Away", "Sell", "Trade"]}
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
                                    className="w-full rounded-md border-2 my-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                />
                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Asset Number</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Department Code</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>

                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Asset Description</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">

                                <div className="flex flex-col w-full">
                                    <label className="font-semibold">Disposal Item</label >
                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-full">
                                    <label className="font-semibold">Disposal Date</label >
                                    <DatePicker
                                        dropdownType="modal"
                                        placeholder="Pick Date"
                                        size="sm"
                                        variant="unstyled"
                                        className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Asset Disposal Authorize By</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Job Title</label >
                                <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                            </div>

                        </div>
                        {/* <div className="py-2 flex flex-row justify-between w-full gap-7">
                        <div className="flex flex-col w-full">
                            <label className="font-semibold">Sales Amount</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="font-semibold">Sales Invoice</label >
                            <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                        </div>

                    </div> */}
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Customer Name</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Sales Invoice Number</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">

                                <div className="flex flex-col w-full">
                                    <label className="font-semibold">AP Invoice Number</label >
                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Agreed Price</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Disposal Cost</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Date Completed</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">CUFS Code String</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Job Title</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold">Telephone Number</label >
                                        <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="py-2 flex flex-row justify-between w-full gap-7">

                                <div className="flex flex-col w-full">
                                    <label className="font-semibold">Email Address</label >
                                    <input className="rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></input>
                                </div>

                            </div>
                        </div>


                    </div>
                    <hr className="py-2" />
                    <div className="flex w-full justify-end">
                        <button
                            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"

                        >
                            Dispose
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default DisposeNew