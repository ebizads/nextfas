import { Pagination, Tabs } from "@mantine/core"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import PaginationPopOver from "../../atoms/popover/PaginationPopOver"
import TransferAssetTable_new from "../../atoms/table/TransferAssetTable_new"
import { transferColumn } from "../../../lib/table"
import { AssetTransferType } from "../../../types/generic"
import { useTranferStatusStore } from "../../../store/useStore"

// type SearchType = {
//   value: string
//   label: string
// }

// const Search = (props: { data: SearchType[] }) => {
//   const [value, setValue] = useState<string | null>(null)
//   return (
//     <Select
//       value={value}
//       placeholder="Search"
//       searchable
//       nothingFound={`Cannot find option`}
//       onChange={setValue}
//       clearable
//       data={[...props.data]}
//       icon={<i className="fa-solid fa-magnifying-glass text-xs"></i>}
//     />
//   )
// }

const DisplayTransferAsset_new = (props: {
    total: number
    assets: AssetTransferType[]
    accessiblePage: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    limit: number
    setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
    // const [checkboxes, setCheckboxes] = useState<number[]>([])
    // const [openPopover, setOpenPopover] = useState<boolean>(false)
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
    const [filterBy, setFilterBy] = useState<string[]>(
        transferColumn.map((i) => i.value)
    )
    // const [assets, setAssets] = useState<AssetType[]>([]);
    // const [accessiblePage, setAccessiblePage] = useState<number>(0);

    const [activeTab, setActiveTab] = useState<string | null>("pending")
    const { status, setStatus } = useTranferStatusStore()

    useEffect(() => {
        setStatus(activeTab ?? "pending")
    }, [activeTab, setStatus])

    useEffect(() => {
        console.log(
            "page: " + props.page,
            "limit: " + props.limit,
            "total: " + props.accessiblePage
        )
    })

    return (
        <div className="space-y-4">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* {checkboxes.length > 0 && (
              <button className="-md flex gap-2 p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none">
                {checkboxes.includes(-1)
                  ? `Delete all record/s ( ${props.asset.length} ) ?`
                  : `Delete selected record/s ( ${checkboxes.length} )`}
              </button>
            )} */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={"/transactions/repair/create"}>
                            <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
                                <i className="fa-regular fa-plus text-xs" />
                                <p>Add New</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="w-full rounded-md bg-white drop-shadow-lg">
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
                            <TransferAssetTable_new
                                // checkboxes={checkboxes}
                                // setCheckboxes={setCheckboxes}
                                rows={props.assets}
                                filterBy={filterBy}
                                columns={transferColumn.filter((col) =>
                                    filterBy.includes(col.value)
                                )}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-8 flex justify-between px-4">
                <div className="flex items-center gap-2">
                    <p>Showing up to</p>
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

export default DisplayTransferAsset_new
