import { Pagination, Select, Tabs } from "@mantine/core";
import Link from "next/link";
import React, { useState, useEffect } from "react"
//import { downloadExcel } from "../../lib/functions";
import { issuanceColumn } from "../../../lib/table";
//import { ExcelExportType } from "../../types/employee";
import FilterPopOver from "../../atoms/popover/FilterPopOver";
import PaginationPopOver from "../../atoms/popover/PaginationPopOver";
import { IssuanceType } from "../../../types/generic";
import { useIssuanceStatusStore } from "../../../store/useStore";
import IssuanceTable from "../../atoms/table/IssuanceTable";

const Issuance = (props: {
    total: number
    assets: IssuanceType[]
    accessiblePage: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    limit: number
    setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false)

    const [filterBy] = useState<string[]>(issuanceColumn.map((i) => i.value))
    const [activeTab, setActiveTab] = useState<string | null>("pending")

    const { setStatus } = useIssuanceStatusStore()
    useEffect(() => {
        setStatus(activeTab ?? "pending")
    }, [activeTab, setStatus])


    return (
        <div className="space-y-4">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex w-fit items-center gap-2">

                        </div>
                        {/* {checkboxes.length > 0 && (
                            <button className="-md flex gap-2 p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none">
                                {checkboxes.includes(-1)
                                    ? `Delete all record/s ( ${props.asset.length} ) ?`
                                    : `Delete selected record/s ( ${checkboxes.length} )`}
                            </button>
                        )} */}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <button
                            className="-md flex gap-2 bg-tangerine-500 py-2 px-4 text-xs rounded-md text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
                        >
                            <i className="fa-solid fa-print text-xs" />
                            Generate CVs
                        </button> */}
                        {/* <Link href={"/transactions/disposal/create"}>
                            <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">

                                <i className="fa-regular fa-plus text-xs" />
                                <p>Add New</p>

                            </div>
                        </Link> */}
                    </div>
                </div>

                <div className="bg-white rounded-md drop-shadow-lg w-full">
                    <div className="px-4">
                        <Tabs value={activeTab} onTabChange={setActiveTab} color="yellow">
                            <Tabs.List>
                                <Tabs.Tab value="pending">
                                    <div className="flex w-full flex-row">
                                        <p
                                            className={
                                                "py-2 px-4 text-lg uppercase " +
                                                `${activeTab === "pending"
                                                    ? "font-semibold text-tangerine-500"
                                                    : "font-semibold text-[#8F8F8F] "
                                                }`
                                            }
                                        >
                                            Pending
                                        </p>{" "}
                                    </div>
                                </Tabs.Tab>
                                <Tabs.Tab value="approved">
                                    <div className="flex w-full flex-row">
                                        <p
                                            className={
                                                "py-2 px-4 text-lg uppercase " +
                                                `${activeTab === "approved"
                                                    ? "font-semibold text-tangerine-500"
                                                    : "font-semibold text-[#8F8F8F] "
                                                }`
                                            }
                                        >
                                            Approved
                                        </p>{" "}
                                    </div>
                                </Tabs.Tab>
                                <Tabs.Tab value="rejected">
                                    <div className="flex w-full flex-row">
                                        <p
                                            className={
                                                "py-2 px-4 text-lg uppercase " +
                                                `${activeTab === "rejected"
                                                    ? "font-semibold text-tangerine-500"
                                                    : "font-semibold text-[#8F8F8F] "
                                                }`
                                            }
                                        >
                                            Rejected
                                        </p>{" "}
                                    </div>
                                </Tabs.Tab>
                                <Tabs.Tab value="cancelled">
                                    <div className="flex w-full flex-row">
                                        <p
                                            className={
                                                "py-2 px-4 text-lg uppercase " +
                                                `${activeTab === "cancelled"
                                                    ? "font-semibold text-tangerine-500"
                                                    : "font-semibold text-[#8F8F8F] "
                                                }`
                                            }
                                        >
                                            Cancelled
                                        </p>{" "}
                                    </div>
                                </Tabs.Tab>
                                <Tabs.Tab value="done">
                                    <div className="flex w-full flex-row">
                                        <p
                                            className={
                                                "py-2 px-4 text-lg uppercase " +
                                                `${activeTab === "done"
                                                    ? "font-semibold text-tangerine-500"
                                                    : "font-semibold text-[#8F8F8F] "
                                                }`
                                            }
                                        >
                                            Completed
                                        </p>{" "}
                                    </div>
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs>
                        <div className="py-4">
                            <IssuanceTable
                                // checkboxes={checkboxes}
                                // setCheckboxes={setCheckboxes}
                                rows={props.assets}
                                filterBy={filterBy}
                                columns={issuanceColumn.filter((col) => filterBy.includes(col.value))}
                            // status={activeTab ?? "pending"}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-8 flex justify-between px-4">
                <div className="flex items-center gap-2">
                    <p>Showing up to </p>
                    <PaginationPopOver
                        paginationPopover={paginationPopover}
                        setPaginationPopover={setPaginationPopover}
                        page={props.page}
                        setPage={props.setPage}
                        limit={props.limit}
                        setLimit={props.setLimit}
                    />
                    <p> entries</p>
                </div>
                <Pagination
                    page={props.page}
                    onChange={props.setPage}
                    total={props.accessiblePage}
                    classNames={{
                        item: "bg-transparent selected-page:bg-tangerine-500 border-none",
                    }}
                />
            </section>
        </div>
    )

}
export default Issuance