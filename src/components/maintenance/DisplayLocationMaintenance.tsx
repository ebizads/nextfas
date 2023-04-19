import React, { useState, useEffect } from "react"
import { Select, Pagination } from "@mantine/core"
import LocationTable from "../atoms/table/LocationTable"
import { LocationType } from "../../types/generic"
import { locationColumn } from "../../lib/employeeTable"
import { ImageJSON } from "../../types/table"
import Modal from "../headless/modal/modal"
import { CreateLocationModal } from "./CreateLocationModal"
import { downloadExcel } from "../../lib/functions"
import { ExcelExportType } from "../../types/employee"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import { employeeColumns } from "../../lib/table"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import AddEmployeePopOver from "../atoms/popover/AddEmployeePopOver"
import DropZone from "../dropzone/DropZone"
import { trpc } from "../../utils/trpc"
import { useSearchStore } from "../../store/useStore"
import { filter } from "lodash"



const DisplayLocationMaintenance = (props: {
  total: number
  location: LocationType[]
  locationPage: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [openAddPopover, setOpenAddPopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [filterBy, setFilterBy] = useState<string[]>(employeeColumns.map((i) => i.value))

  const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false)
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)

  const [date, setDate] = useState<Date>(new Date())
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const utils = trpc.useContext();
  const { search, setSearch } = useSearchStore()


  console.log("asdasd", filterBy);

  console.log(search)
  useEffect(
    () => {
      setSearch("");

    },
    [setSearch]
  
  );
  const { mutate } = trpc.employee.deleteMany.useMutation({
    onSuccess: () => {
      utils.employee.findAll.invalidate();
    }
  })

  return (
    <div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
              <input type="text" className="border-gray-400 border-2 rounded p-[0.1rem]" placeholder="Search Employee" onChange={(e) => setSearch(e.currentTarget.value)}>
                </input>
              </div>
              <FilterPopOver
                openPopover={openPopover}
                setOpenPopover={setOpenPopover}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                columns={employeeColumns}
              />
            </div>
            {checkboxes.length > 0 && (
              <button className="-md flex gap-2 p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none" onClick={() => { mutate(checkboxes); setCheckboxes([]) }}>
                {checkboxes.includes(-1)
                  ? `Delete all record/s ( ${props.location.length} ) ?`
                  : `Delete selected record/s ( ${checkboxes.length} )`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AddEmployeePopOver openPopover={openAddPopover} setOpenPopover={setOpenAddPopover} setAddSingleRecord={setAddSingleRecord} setAddBulkRecord={setAddBulkRecord} />
          </div>
        </div>

        <LocationTable
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          rows={props.location}
          filterBy={filterBy}
          columns={locationColumn.filter((col) => filterBy.includes(col.value))}
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
          total={props.locationPage}
          classNames={{
            item: "bg-transparent selected-page:bg-tangerine-500 border-none",
          }}
        />
      </section>

      <Modal
        title="Add Location Record"
        isVisible={addSingleRecord}
        setIsVisible={setAddSingleRecord}
        className="max-w-4xl"
      >
        <CreateLocationModal
          date={date}
          setDate={setDate}
          setImage={setImage}
          images={images}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setIsVisible={setAddSingleRecord}
        />
      </Modal>
      <Modal
        title="Add Bulk Record of Employees"
        isVisible={addBulkRecord}
        setIsVisible={setAddBulkRecord}
        className="max-w-6xl"
      >
        <DropZone file_type="xlsx" acceptingMany={false} loading={isLoading} setIsLoading={setIsLoading} />
      </Modal>
    </div>
  )
}

export default DisplayLocationMaintenance
