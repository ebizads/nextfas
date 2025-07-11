import React, { useState, useEffect } from "react"
import { Pagination } from "@mantine/core"
import { HistoryLogType } from "../../types/generic"
import { historyLogColumns } from "../../lib/table"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import { useSearchStore } from "../../store/useStore"
import {
    downloadExcel_assets,
    downloadExcel_templateAssets,
} from "../../lib/functions"
import { UserType } from "../../types/generic"
import { ExcelExportAssetType } from "../../types/asset"
import { trpc } from "../../utils/trpc"
import Modal from "../headless/modal/modal"
import DropZone from "../dropzone/DropZone"
import AddAssetPopOver from "../atoms/popover/AddAssetPopOver"
import DropZone_asset from "../dropzone/Asset dropzone/DropZone_asset"
import HistoryLogsTable from "../atoms/table/HistoryLogsTable"

const DisplayHistoryLogs = (props: {
    user: UserType
    total: number
    historyLogs: HistoryLogType[]
    accessiblePage: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    limit: number
    setLimit: React.Dispatch<React.SetStateAction<number>>
    refetch: () => Promise<{ data?: any }>
}) => {
    const { setSearch } = useSearchStore()
    const [checkboxes, setCheckboxes] = useState<number[]>([])
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
    const [openModalDel, setOpenModalDel] = useState<boolean>(false)
    const [openPopover, setOpenPopover] = useState<boolean>(false)
    const [openAddPopover, setOpenAddPopover] = useState<boolean>(false)

    const [firstLogin, setFirstLogin] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)

    const [filterBy, setFilterBy] = useState<string[]>(
        historyLogColumns.map((i) => i.value)
    )

    useEffect(() => {
        setSearch("")
    }, [setSearch])

    return (
        <div className="space-y-4">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                            <div className="flex w-fit items-center gap-2">
                                <div className="relative w-fit">
                                    <input
                                        type="text"
                                        className="w-64 rounded border-2 border-gray-400 py-[0.25rem] pl-2 pr-10 "
                                        placeholder="Search"
                                        onChange={(e) => setSearch(e.currentTarget.value)}
                                    />
                                    <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                                <FilterPopOver
                                    openPopover={openPopover}
                                    setOpenPopover={setOpenPopover}
                                    filterBy={filterBy}
                                    setFilterBy={setFilterBy}
                                    columns={historyLogColumns}
                                />
                            </div>
                            {checkboxes.length > 0 && (
                                <button
                                    onClick={() => setOpenModalDel(true)}
                                    className="flex gap-2 rounded-md p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none"
                                >
                                    {checkboxes.includes(-1)
                                        ? `Delete all record/s ( ${props.historyLogs.length} ) ?`
                                        : `Delete selected record/s ( ${checkboxes.length} )`}
                                </button>
                            )}
                        </div>

                        {/* <button
                            title="Download Template"
                            onClick={() => {
                                const downloadableAssets = props.historyLogs.map((historyLogs) => {
                                    if (historyLogs) {
                                        // && historyLogs?.['model'] && historyLogs?.model?.['category'] && historyLogs?.model?.['class'] && historyLogs?.model?.['type']
                                        const {
                                            createdAt,
                                            updatedAt,
                                            deleted,
                                            deletedAt,
                                            ...rest
                                        } = historyLogs //project, parent, vendor, subsidiary, addedBy, custodian,

                                        return {
                                            ...rest,
                                            // remarks: rest?.remarks,
                                            id: rest.id,
                                            // number: rest.number,
                                            createdAt: createdAt,
                                            updatedAt: updatedAt,
                                            deletedAt: deletedAt,
                                            deleted: deleted,
                                        }
                                    }
                                }) as ExcelExportAssetType[]

                                downloadExcel_templateAssets(downloadableAssets)
                            }}
                            className="flex gap-2 rounded-md border-2 border-tangerine-500 bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:border-tangerine-600 hover:bg-tangerine-600 focus:outline-none"
                        >
                            <i className="fa-solid fa-file-lines text-xs" />
                        </button> */}
                        {/* <button
                            title="Download Assets"
                            onClick={() => {
                                const downloadableAssets = props.historyLogs.map((historyLogs) => {
                                    if (historyLogs) {
                                        // && historyLogs?.['model'] && historyLogs?.model?.['category'] && historyLogs?.model?.['class'] && historyLogs?.model?.['type']

                                        return {
                                            id: historyLogs.id,
                                            name: historyLogs.name,
                                            asset_number: historyLogs?.number,
                                            serial_no: historyLogs.serial_no,
                                            barcode: historyLogs.barcode,
                                            brand: historyLogs.brand,
                                            type: historyLogs.type?.name,
                                            caliber: historyLogs.caliber,
                                            models: historyLogs.models,
                                            action_type: historyLogs?.actionType?.name,
                                            description: historyLogs.description,
                                        }
                                    }
                                }) as ExcelExportAssetType[]

                                downloadExcel_historyLogs(downloadableAssets)
                            }}
                            className="flex gap-2 rounded-md border-2 border-tangerine-500 bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:border-tangerine-600 hover:bg-tangerine-600 focus:outline-none"
                        >
                            <i className="fa-solid fa-file-arrow-down text-xs" />
                        </button> */}
                        {/* <Link href={"/historyLogs/create"}>
              <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
                <i className="fa-regular fa-plus text-xs" />
                <p>Add New</p>
              </div>
            </Link> */}
                        <AddAssetPopOver
                            openPopover={openAddPopover}
                            setOpenPopover={setOpenAddPopover}
                            // setAddSingleRecord={setAddSingleRecord}
                            setAddBulkRecord={setAddBulkRecord}
                        />
                    </div>
                </div>
            </section>
            <HistoryLogsTable
                checkboxes={checkboxes}
                setCheckboxes={setCheckboxes}
                rows={props.historyLogs}
                filterBy={filterBy}
                columns={historyLogColumns.filter((col) => filterBy.includes(col.value))}
                refetch={props.refetch}
            />
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
            <Modal
                title="Add Bulk Record of Assets"
                isVisible={addBulkRecord}
                setIsVisible={setAddBulkRecord}
                className="max-w-6xl"
            >
                <DropZone_asset
                    file_type="xlsx"
                    acceptingMany={false}
                    loading={isLoading}
                    setIsLoading={setIsLoading}
                    setIsVisible={setAddBulkRecord}
                />
            </Modal>
        </div>
    )
}

export default DisplayHistoryLogs
