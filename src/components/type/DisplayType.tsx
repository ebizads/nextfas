import React, { useState, useEffect } from "react"
import { Pagination } from "@mantine/core"
import TypeTable from "../atoms/table/TypeTable"
import { AssetType } from "../../types/generic"
import { columns } from "../../lib/typeTable"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import AddTypePopOver from "../atoms/popover/AddTypePopOver"
import Modal from "../headless/modal/modal"
import { CreateType } from "./CreateType"
import DropZone from "../dropzone/DropZone"
import { trpc } from "../../utils/trpc"
import { useSearchStore } from "../../store/useStore"
// import {
//   downloadActionTypes,
//   downloadActionTypesTemplate,
// } from "../../lib/functions";

const DisplayTypes = (props: {
    total: number;
    types: AssetType[];
    sampleTypes: AssetType[];
    typePage: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [checkboxes, setCheckboxes] = useState<number[]>([]);
    const [openPopover, setOpenPopover] = useState<boolean>(false);
    const [openAddPopover, setOpenAddPopover] = useState<boolean>(false);
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false);
    const [filterBy, setFilterBy] = useState<string[]>(
        columns.map((i) => i.value)
    );

    const [typeId, setTypeId] = useState("");
    const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false);
    const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const utils = trpc.useContext();
    const { search, setSearch } = useSearchStore();

    useEffect(() => {
        setSearch("");
    }, [setSearch]);

    const { mutate } = trpc.assetType.deleteMany.useMutation({
        onSuccess: () => {
            utils.assetType.findAll.invalidate();
        }
    });

    return (
        <div>
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex w-fit items-center gap-2">
                            <input
                                type="text"
                                className="rounded border-2 border-gray-400 p-[0.1rem]"
                                placeholder="Search Type"
                                onChange={(e) => setSearch(e.currentTarget.value)}
                            />
                            <FilterPopOver
                                openPopover={openPopover}
                                setOpenPopover={setOpenPopover}
                                filterBy={filterBy}
                                setFilterBy={setFilterBy}
                                columns={columns}
                            />
                        </div>
                        {checkboxes.length > 0 && (
                            <button
                                className="-md flex gap-2 p-2 text-xs font-medium text-red-500 underline-offset-4"
                                onClick={() => {
                                    mutate(checkboxes);
                                    setCheckboxes([]);
                                }}
                            >
                                {checkboxes.includes(-1)
                                    ? `Delete all record/s (${props.types.length}) ?`
                                    : `Delete selected record/s (${checkboxes.length})`
                                }
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <button
                            className="-md flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 hover:bg-tangerine-600"
                            onClick={() => {
                                downloadActionTypesTemplate(props.sampleActionTypes);
                            }}
                        >
                            <i className="fa-solid fa-print text-xs" />
                            Download Template
                        </button>
                        <button
                            className="-md flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 hover:bg-tangerine-600"
                            onClick={() => {
                                downloadActionTypes(props.actionTypes);
                            }}
                        >
                            <i className="fa-solid fa-print text-xs" />
                            Download Action Types
                        </button> */}
                        <AddTypePopOver
                            openPopover={openAddPopover}
                            setOpenPopover={setOpenAddPopover}
                            typeId={typeId}
                            setTypeId={setTypeId}
                            setAddSingleRecord={setAddSingleRecord}
                            setAddBulkRecord={setAddBulkRecord}
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-lg shadow-md">
                    <TypeTable
                        checkboxes={checkboxes}
                        setCheckboxes={setCheckboxes}
                        rows={props.types}
                        filterBy={filterBy}
                        columns={columns.filter((col) =>
                            filterBy.includes(col.value)
                        )}
                    />
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
                    total={props.typePage}
                    classNames={{
                        item: "bg-transparent selected-page:bg-tangerine-500 border-none"
                    }}
                />
            </section>

            <Modal
                title="Add Type"
                isVisible={addSingleRecord}
                setIsVisible={setAddSingleRecord}
                className="max-w-4xl"
            >
                <CreateType
                    setIsVisible={setAddSingleRecord}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    typeId={typeId}
                />
            </Modal>

            <Modal
                title="Add Bulk Types"
                isVisible={addBulkRecord}
                setIsVisible={setAddBulkRecord}
                className="max-w-6xl"
            >
                <DropZone
                    file_type="xlsx"
                    acceptingMany={false}
                    loading={isLoading}
                    setIsLoading={setIsLoading}
                    setIsVisible={setAddBulkRecord}
                />
            </Modal>
        </div>
    )
};

export default DisplayTypes;