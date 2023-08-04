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
    assetPage: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    limit: number
    setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false)

    const [filterBy] = useState<string[]>(issuanceColumn.map((i) => i.value))
    const [activeTab, setActiveTab] = useState<string | null>("notissued")

    const { setStatus } = useIssuanceStatusStore()
    useEffect(() => {
        setStatus(activeTab ?? "notissued")
    }, [activeTab, setStatus]
    )

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
                        <Link href={"/transactions/disposal/create"}>
                            <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">

                                <i className="fa-regular fa-plus text-xs" />
                                <p>Add New</p>

                            </div>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-md drop-shadow-lg w-full">
                    <div className="px-4">
                        <Tabs value={activeTab} onTabChange={setActiveTab} color="yellow">
                            <Tabs.List>
                                <Tabs.Tab value="notissued"><div className="w-full flex flex-row"><p className={"text-lg uppercase py-2 px-4 " + `${activeTab === 'notissued' ? "text-tangerine-500 font-semibold" : "text-[#8F8F8F] font-semibold "}`}>Not Issued</p></div></Tabs.Tab>
                                <Tabs.Tab value="issued"><div className="w-full flex flex-row"><p className={"text-lg uppercase py-2 px-4 " + `${activeTab === 'issued' ? "text-tangerine-500 font-semibold" : "text-[#8F8F8F] font-semibold "}`}>Issued</p></div></Tabs.Tab>

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
                    total={props.assetPage}
                    classNames={{
                        item: "bg-transparent selected-page:bg-tangerine-500 border-none",
                    }}
                />
            </section>
        </div>
    )

}
export default Issuance