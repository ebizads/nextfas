import React, { useState } from "react"
import { Select, Pagination } from "@mantine/core"
import EmployeeTable from "../atoms/table/EmployeeTable"
import { EmployeeType } from "../../types/generic"
import { columns } from "../../lib/employeeTable"
import { ImageJSON } from "../../types/table"
import Modal from "../headless/modal/modal"
import { CreateEmployeeModal } from "./CreateEmployeeModal"
import { downloadExcel } from "../../lib/functions"
import { ExcelExportType } from "../../types/employee"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import { employeeColumns } from "../../lib/table"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import AddEmployeePopOver from "../atoms/popover/AddEmployeePopOver"
import DropZone from "../dropzone/DropZone"

type SearchType = {
  value: string
  label: string
}

const Search = (props: { data: SearchType[] }) => {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Select
      value={value}
      placeholder="Search"
      searchable
      nothingFound={`Cannot find option`}
      onChange={setValue}
      clearable
      data={[...props.data]}
      icon={<i className="fa-solid fa-magnifying-glass text-xs"></i>}
    />
  )
}

const DisplayEmployees = (props: {
  total: number
  employees: EmployeeType[]
  employeePage: number
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
  return (
    <div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
                <Search
                  data={[
                    ...props.employees?.map((obj) => {
                      return {
                        value: obj?.id.toString() ?? "",
                        label: obj?.name.toString() ?? "",
                      }
                    }),
                  ]}
                />
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
              <button className="-md flex gap-2 p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none">
                {checkboxes.includes(-1)
                  ? `Delete all record/s ( ${props.employees.length} ) ?`
                  : `Delete selected record/s ( ${checkboxes.length} )`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const downloadableEmployees = props.employees.map((employee) => {
                  if (employee?.['address'] && employee?.['profile']) {

                    const { address, profile, ...rest } = employee
                    return { ...rest, ...address, ...profile, id: rest.id }
                  }

                }) as ExcelExportType[]
                downloadExcel(downloadableEmployees)
              }}
              className="-md flex gap-2 bg-tangerine-500 py-2 px-4 text-xs rounded-md text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
            >
              <i className="fa-solid fa-print text-xs" />
              Generate CVs
            </button>
            <AddEmployeePopOver openPopover={openAddPopover} setOpenPopover={setOpenAddPopover} setAddSingleRecord={setAddSingleRecord} setAddBulkRecord={setAddBulkRecord} />
          </div>
        </div>

        <EmployeeTable
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          rows={props.employees}
          filterBy={filterBy}
          columns={columns.filter((col) => filterBy.includes(col.value))}
        />
      </section>
      <section className="mt-8 flex justify-between px-4">
        <div className="flex items-center gap-2">
          <p>Showing </p>
          <PaginationPopOver
            paginationPopover={paginationPopover}
            setPaginationPopover={setPaginationPopover}
            page={props.page}
            setPage={props.setPage}
            limit={props.limit}
            setLimit={props.setLimit}
          />
          <p> of {props.total ?? 0} entries</p>
        </div>
        <Pagination
          page={props.page}
          onChange={props.setPage}
          total={props.employeePage}
          classNames={{
            item: "bg-transparent selected-page:bg-tangerine-500 border-none",
          }}
        />
      </section>

      <Modal
        title="Add Employee Record"
        isVisible={addSingleRecord}
        setIsVisible={setAddSingleRecord}
        className="max-w-4xl"
      >
        <CreateEmployeeModal
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

export default DisplayEmployees
