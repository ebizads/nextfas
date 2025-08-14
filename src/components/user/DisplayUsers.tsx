import React, { useState } from "react"
import { Pagination } from "@mantine/core"
import UserTable from "./UserTable"
import { userColumns } from "../../lib/table"
import { columnsuser } from "../../lib/employeeTable"
import { employeeColumns } from "../../lib/table"
import { trpc } from "../../utils/trpc"
import { UserType } from "../../types/generic"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import Link from "next/link"
import { useSearchStore } from "../../store/useStore"

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
  // const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [filterBy, setFilterBy] = useState<string[]>(
    employeeColumns.map((i) => i.value)
  )

  const { setSearch } = useSearchStore()
  const utils = trpc.useContext()

  const { mutate } = trpc.user.deleteMany.useMutation({
    onSuccess: () => {
      utils.user.findAll.invalidate()
    },
  })

  return (
    <div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              <div className="flex w-fit items-center gap-2">
                <div className="relative w-fit">
                  <input
                    type="text"
                    className="w-64 rounded border-2 border-gray-400 py-[0.25rem] pl-2 pr-10 "
                    placeholder="Search User"
                    onChange={(e) => setSearch(e.currentTarget.value)}
                  ></input>
                </div>
                {/* <FilterPopOver
                  openPopover={openPopover}
                  setOpenPopover={setOpenPopover}
                  filterBy={filterBy}
                  setFilterBy={setFilterBy}
                  columns={userColumns}
                /> */}
              </div>
              {/* {checkboxes.length > 0 && ( */}
              <button
                onClick={() => {
                  mutate(checkboxes)
                  setCheckboxes([])
                }}
                className={`flex items-center gap-2 rounded-md border-2 py-2 px-4 text-xs font-medium text-white outline-none ${
                  checkboxes.length <= 0
                    ? "cursor-not-allowed border-gray-300 bg-gray-300"
                    : "border-tangerine-500 bg-tangerine-500 hover:border-tangerine-600 hover:bg-tangerine-600 focus:outline-none"
                }`}
                disabled={checkboxes.length <= 0}
              >
                <i className="fa-solid fa-trash h-full text-xs text-white" />

                {/* {checkboxes.includes(-1)
                    ? `Delete all record/s ( ${props.users.length} ) ?`
                    : `Delete selected record/s ( ${checkboxes.length} )`} */}
              </button>
              {/* )} */}
            </div>
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
            <Link href={"/UserManagement/register"}>
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
