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
  const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value));

  const [actionTypeId, setActionTypeId] = useState("");
  const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false);
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const utils = trpc.useContext();
  const { setSearch } = useSearchStore();

  useEffect(() => {
    setSearch("");
  }, [setSearch]);

  const { mutate, isLoading: isDeleting } = trpc.assetActionType.deleteMany.useMutation({
    onSuccess: () => {
      utils.assetActionType.findAll.invalidate();
    },
    onError: (error) => {
      console.error("Failed to delete action types:", error);
    }
  });

  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
            <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
              <div className="flex w-fit items-center gap-2">
                <div className="relative w-fit">
                  <input
                    type="text"
                    className="border-gray-400 border-2 rounded pl-2 pr-10 py-[0.25rem] w-64"
                    placeholder="Search Action Type"
                    onChange={(e) => setSearch(e.currentTarget.value)}
                  />
                  <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
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
                  onClick={() => setShowConfirm(true)}
                  className={`flex gap-2 rounded-md p-2 text-xs font-medium text-red-500 underline underline-offset-4 outline-none focus:outline-none ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 
                    checkboxes.includes(-1)
                      ? `Delete all record/s (${props.actionTypes.length}) ?`
                      : `Delete selected record/s (${checkboxes.length})`
                  }
                </button>
              )}
            </div>
            {/* Add your download template and download action types buttons here if needed */}
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

        <div className="w-full overflow-x-auto rounded-lg shadow-md">
          <ActionTypeTable
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            rows={props.actionTypes}
            filterBy={filterBy}
            columns={columns.filter((col) => filterBy.includes(col.value))}
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
          <p>entries</p>
        </div>
        <Pagination
          page={props.page}
          onChange={props.setPage}
          total={props.actionTypePage}
          classNames={{
            item: "bg-transparent selected-page:bg-tangerine-500 border-none"
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

      <Modal
        title="Confirm Deletion"
        isVisible={showConfirm}
        setIsVisible={setShowConfirm}
        className="max-w-md"
      >
        <div className="p-4">
          <p>Are you sure you want to delete {checkboxes.includes(-1) ? 'all' : checkboxes.length} action type(s)?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button 
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                mutate(checkboxes);
                setCheckboxes([]);
                setShowConfirm(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DisplayActionTypes;