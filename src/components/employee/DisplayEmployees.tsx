import React, { useState, useEffect } from "react"
import { Select, Pagination } from "@mantine/core"
import EmployeeTable from "../atoms/table/EmployeeTable"
import { EmployeeType } from "../../types/generic"
import { columns } from "../../lib/employeeTable"
import { ImageJSON } from "../../types/table"
import Modal from "../headless/modal/modal"
import { CreateEmployeeModal } from "./CreateEmployeeModal"
import { downloadExcel, downloadExcel_template } from "../../lib/functions"
import { ExcelExportType } from "../../types/employee"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import { employeeColumns } from "../../lib/table"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import AddEmployeePopOver from "../atoms/popover/AddEmployeePopOver"
import DropZone from "../dropzone/DropZone"
import { trpc } from "../../utils/trpc"
import { useSearchStore } from "../../store/useStore"
import { filter } from "lodash"

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

const DisplayEmployees = (props: {
  total: number
  employees: EmployeeType[]
  sampleEmployee: EmployeeType[]
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
  const [filterBy, setFilterBy] = useState<string[]>(
    employeeColumns.map((i) => i.value)
  )

  const [employeeId, setEmployeeId] = useState("")

  const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false)
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)

  const [date, setDate] = useState<Date>(new Date())
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const utils = trpc.useContext()
  const { search, setSearch } = useSearchStore()

  console.log("asdasd", filterBy)

  console.log(search)
  useEffect(() => {
    setSearch("")
  }, [setSearch])

  const { mutate } = trpc.employee.deleteMany.useMutation({
    onSuccess: () => {
      utils.employee.findAll.invalidate()
    },
  })

  return (
    <div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="rounded border-2 border-gray-400 p-[0.1rem]"
                  placeholder="Search Employee"
                  onChange={(e) => setSearch(e.currentTarget.value)}
                ></input>
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
              <button
                className="-md flex gap-2 p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none"
                onClick={() => {
                  mutate(checkboxes)
                  setCheckboxes([])
                }}
              >
                {checkboxes.includes(-1)
                  ? `Delete all record/s ( ${props.employees.length} ) ?`
                  : `Delete selected record/s ( ${checkboxes.length} )`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const downloadableEmployees = props.sampleEmployee.map(
                  (employee) => {
                    if (employee?.["address"] && employee?.["profile"]) {
                      const { address, profile, ...rest } = employee
                      return {
                        ...rest,
                        address_id: address.id,
                        ...address,
                        address_createdAt: address.createdAt,
                        address_updatedAt: address.updatedAt,
                        address_deleted: address.deleted,
                        address_deletedAt: address.deletedAt,
                        profile_id: profile.id,
                        ...profile,
                        profile_employeeId: profile.employeeId,
                        profile_userId: profile.userId,
                        deleted: rest.deleted,
                        deletedAt: rest.deletedAt,
                        id: rest.id,
                      }
                    }
                  }
                ) as ExcelExportType[]
                downloadExcel_template(downloadableEmployees)
              }}
              className="-md flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
            >
              <i className="fa-solid fa-print text-xs" />
              Download Template
            </button>
            <button
              onClick={() => {
                const downloadableEmployees = props.employees.map(
                  (employee) => {
                    if (employee?.["address"] && employee?.["profile"]) {
                      const { address, profile, ...rest } = employee
                      return {
                        ...rest,
                        address_id: address.id,
                        ...address,
                        address_createdAt: address.createdAt,
                        address_updatedAt: address.updatedAt,
                        address_deleted: address.deleted,
                        address_deletedAt: address.deletedAt,
                        profile_id: profile.id,
                        ...profile,
                        profile_employeeId: profile.employeeId,
                        profile_userId: profile.userId,
                        deleted: rest.deleted,
                        deletedAt: rest.deletedAt,
                        id: rest.id,
                      }
                    }
                  }
                ) as ExcelExportType[]
                console.log(downloadableEmployees)
                downloadExcel(downloadableEmployees)
              }}
              className="-md flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
            >
              <i className="fa-solid fa-print text-xs" />
              Download Employees
            </button>
            <AddEmployeePopOver
              openPopover={openAddPopover}
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              setOpenPopover={setOpenAddPopover}
              setAddSingleRecord={setAddSingleRecord}
              setAddBulkRecord={setAddBulkRecord}
            />
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
          generateId={employeeId}
        />
      </Modal>
      <Modal
        title="Add Bulk Record of Employees"
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
}

export default DisplayEmployees
