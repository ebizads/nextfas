import React, { useState, useEffect } from "react";
import { Pagination } from "@mantine/core";
import ActionTypeTable from "../atoms/table/ActionTypeTable";
import { AssetActionType } from "../../types/generic";
import { columns } from "../../lib/actionTypeTable";
import FilterPopOver from "../atoms/popover/FilterPopOver";
import PaginationPopOver from "../atoms/popover/PaginationPopOver";
import AddActionTypePopOver from "../atoms/popover/AddActionTypePopOver";
import Modal from "../headless/modal/modal";
import { CreateActionType } from "./CreateActionType";
import DropZone from "../dropzone/DropZone";
import { trpc } from "../../utils/trpc";
import { useSearchStore } from "../../store/useStore";
// import {
//   downloadActionTypes,
//   downloadActionTypesTemplate,
// } from "../../lib/functions";

const DisplayActionTypes = (props: {
  total: number;
  actionTypes: AssetActionType[];
  sampleActionTypes: AssetActionType[];
  actionTypePage: number;
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

  const [actionTypeId, setActionTypeId] = useState("");
  const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false);
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useContext();
  const { search, setSearch } = useSearchStore();

  useEffect(() => {
    setSearch("");
  }, [setSearch]);

  const { mutate } = trpc.assetActionType.deleteMany.useMutation({
    onSuccess: () => {
      utils.assetActionType.findAll.invalidate();
    },
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
                placeholder="Search Action Type"
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
                className="-md flex gap-2 p-2 text-xs font-medium text-red-500 underline underline-offset-4"
                onClick={() => {
                  mutate(checkboxes);
                  setCheckboxes([]);
                }}
              >
                {checkboxes.includes(-1)
                  ? `Delete all record/s (${props.actionTypes.length}) ?`
                  : `Delete selected record/s (${checkboxes.length})`}
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
            <AddActionTypePopOver
              openPopover={openAddPopover}
              setOpenPopover={setOpenAddPopover}
              actionTypeId={actionTypeId}
              setActionTypeId={setActionTypeId}
              setAddSingleRecord={setAddSingleRecord}
              setAddBulkRecord={setAddBulkRecord}
            />
          </div>
        </div>

        <ActionTypeTable
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          rows={props.actionTypes}
          filterBy={filterBy}
          columns={columns.filter((col) =>
            filterBy.includes(col.value)
          )}
        />

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
          total={props.actionTypePage}
          classNames={{
            item: "bg-transparent selected-page:bg-tangerine-500 border-none",
          }}
        />
      </section>

      <Modal
        title="Add Action Type"
        isVisible={addSingleRecord}
        setIsVisible={setAddSingleRecord}
        className="max-w-4xl"
      >
        <CreateActionType
          setIsVisible={setAddSingleRecord}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          actionTypeId={actionTypeId}
        />
      </Modal>
      <Modal
        title="Add Bulk Action Types"
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
  );
};

export default DisplayActionTypes;
