import React, { useEffect, useState } from "react"
import { Select, Pagination } from "@mantine/core"
import UserTable from "../../components/user/UserTable"
import { userColumns } from "../../lib/table"
import { columnsuser } from "../../lib/employeeTable"
import { ImageJSON } from "../../types/table"
import Modal from "../../components/headless/modal/modal"
import { downloadExcel } from "../../lib/functions"
import { ExcelExportType, ExcelExportTypeUser } from "../../types/employee"
import { employeeColumns } from "../../lib/table"
import { trpc } from "../../utils/trpc"
import { UserType } from "../../types/generic"
import PaginationPopOver from "../../components/atoms/popover/PaginationPopOver"
import FilterPopOver from "../../components/atoms/popover/FilterPopOver"
import { redirect } from "next/dist/server/api-utils"
import Link from "next/link"

type SearchType = {
  value: string
  label: string
}



const DisplayUsers = (props: {
  total: number
  users: UserType[]
  userPage: number
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
  const [users, setUsers] = useState<UserType[]>([])
  const [page, setPage] = useState(props.page)
  const [limit, setLimit] = useState(props.limit)
  const [addSingleRecord, setAddSingleRecord] = useState<boolean>(false)
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)

  const [date, setDate] = useState<Date>(new Date())
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")

  const utils = trpc.useContext()

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

  // useEffect(() => {
  //   if (data) {
  //     setUsers(data.user as UserType[])
  //   }
  // }, [data])

  const { mutate } = trpc.user.deleteMany.useMutation({
    onSuccess: () => {
      utils.user.findAll.invalidate()
    },
  })

  return (
    <div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
                <input type="text" className="border-gray-400 border-2 rounded p-[0.1rem]" placeholder="Search User Name" onChange={(e) => setSearch(e.currentTarget.value)}>
                </input>
              </div>
              <FilterPopOver
                openPopover={openPopover}
                setOpenPopover={setOpenPopover}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                columns={userColumns}
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
                  ? `Delete all record/s ( ${props.users.length} ) ?`
                  : `Delete selected record/s ( ${checkboxes.length} )`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* <button
              onClick={() => {
                const downloadableUsers = props.users.map((user) => {
                  if (user?.['address'] && user?.['profile']) {
                    const { address, profile, ...rest } = user
                    return {
                      ...rest,
                      address_id: address.id,
                      ...address,
                      address_deleted: address.deleted,
                      address_deletedAt: address.deletedAt,
                      profile_id: profile.id,
                      ...profile,
                      profile_employeeId: profile.employeeId,
                      id: rest.id
                    }
                  }
                }) as ExcelExportTypeUser[]
                downloadExcel(downloadableUsers)
              }}
              className="-md flex gap-2 bg-tangerine-500 py-2 px-4 text-xs rounded-md text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
            >
              <i className="fa-solid fa-print text-xs" />
              Generate CVs
            </button> */}
            <Link href={"/auth/registerDashboard"}>
              <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
                <i className="fa-regular fa-plus text-xs" />
                <p>Register</p>
              </div>
            </Link>
          </div>
        </div>

        <UserTable
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          rows={props.users}
          filterBy={filterBy}
          columns={columnsuser.filter((col) => filterBy.includes(col.value))}
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
          total={props.userPage}
          classNames={{
            item: "bg-transparent selected-page:bg-tangerine-500 border-none",
          }}
        />
      </section>
    </div>
  )
}

export default DisplayUsers
