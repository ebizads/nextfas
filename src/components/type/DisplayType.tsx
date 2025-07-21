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
// import DropZone from "../dropzone/DropZone"
import { trpc } from "../../utils/trpc"
import { useSearchStore } from "../../store/useStore"

type Type = {
  id: number
  name: string
  description: string | null
}

const DisplayTypes = (props: {
  total: number
  types: AssetType[]
  sampleTypes: AssetType[]
  typePage: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
  const utils = trpc.useContext()

  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [openAddPopover, setOpenAddPopover] = useState<boolean>(false)
  const [openUpdatePopover, setOpenUpdatePopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [filterBy, setFilterBy] = useState<string[]>(
    columns.map((i) => i.value)
  )
  const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false)

  const [typeId, setTypeId] = useState("")
  const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<Type>({
    id: 0,
    name: "",
    description: "",
  })

  const { mutate: updateMutate, isLoading: isLoadingUpdate } =
    trpc.assetType.update.useMutation({
      onSuccess: () => {
        utils.assetType.findAll.invalidate()

        console.log("success")
        setIsSuccessVisible(true)
      },
    })
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setSearch } = useSearchStore()

  useEffect(() => {
    setSearch("")
  }, [setSearch])

  useEffect(() => {
    if (selectedType.id !== 0) {
      setOpenUpdatePopover(true)
    }
  }, [selectedType])

  //   useEffect(() => {
  //     if (!openUpdatePopover) {
  //       setOpenUpdatePopover(true)
  //     }
  //   }, [openUpdatePopover])

  useEffect(() => {
    if (addSingleRecord) {
      setSelectedType({ id: 0, name: "", description: "" })
    }
  }, [addSingleRecord])

  const [showConfirm, setShowConfirm] = useState(false)

  const { mutate, isLoading: isDeleting } =
    trpc.assetType.deleteMany.useMutation({
      onSuccess: () => {
        utils.assetType.findAll.invalidate()
      },
      onError: (error) => {
        console.error("Failed to delete types:", error)
      },
    })

  const handleSubmitUpdate = (data: Type) => {
    if (data) {
      updateMutate({
        id: data.id,
        name: data.name,
        description: data.description ? data.description : undefined,
      })
    }
  }

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
                    className="w-64 rounded border-2 border-gray-400 py-[0.25rem] pl-2 pr-10"
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
                  columns={columns}
                />
              </div>
              {checkboxes.length > 0 && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className={`flex gap-2 rounded-md p-2 text-xs font-medium text-red-500 underline underline-offset-4 outline-none focus:outline-none ${
                    isDeleting ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={isDeleting}
                >
                  {isDeleting
                    ? "Deleting..."
                    : checkboxes.includes(-1)
                    ? `Delete all record/s (${props.types.length}) ?`
                    : `Delete selected record/s (${checkboxes.length})`}
                </button>
              )}
            </div>
            {/* Add your download template and download types buttons here if needed */}
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
            columns={columns.filter((col) => filterBy.includes(col.value))}
            setSelectedType={setSelectedType}
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
          total={props.typePage}
          classNames={{
            item: "bg-transparent selected-page:bg-tangerine-500 border-none",
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
          setIsSuccessVisible={setIsSuccessVisible}
          isSuccessVisible={isSuccessVisible}
        />
      </Modal>

      <Modal
        title="Edit Type"
        isVisible={openUpdatePopover}
        setIsVisible={setOpenUpdatePopover}
        className="max-w-4xl"
      >
        <CreateType
          setIsVisible={setOpenUpdatePopover}
          selectedType={selectedType}
          setIsSuccessVisible={setIsSuccessVisible}
          isSuccessVisible={isSuccessVisible}
          onSubmit={handleSubmitUpdate}
          isUpdating={isLoadingUpdate}
        />
      </Modal>

      {/* <Modal
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
      </Modal> */}

      <Modal
        title="Confirm Deletion"
        isVisible={showConfirm}
        setIsVisible={setShowConfirm}
        className="max-w-md"
      >
        <div className="p-4">
          <p>
            Are you sure you want to delete{" "}
            {checkboxes.includes(-1) ? "all" : checkboxes.length} type(s)?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                mutate(checkboxes)
                setCheckboxes([])
                setShowConfirm(false)
              }}
              className="rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DisplayTypes
