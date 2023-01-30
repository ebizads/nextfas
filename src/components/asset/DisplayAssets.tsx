import React, { useState, useEffect } from "react"
import { Pagination } from "@mantine/core"
import AssetTable, { AssetDeleteModal } from "../atoms/table/AssetTable"
import Link from "next/link"
import { AssetType } from "../../types/generic"
import { columns } from "../../lib/table"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import Search from "../atoms/search/Search"
import { useSearchStore } from "../../store/useStore"
import InputField from "../atoms/forms/InputField"
import { currentValue } from "../../lib/functions"



const DisplayAssets = (props: {
  total: number
  assets: AssetType[]
  accessiblePage: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {

  const { search, setSearch } = useSearchStore()
  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value))
  console.log(search)

  useEffect(
    () => {
      setSearch("");
    },
    [setSearch]

  );
  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
                <input type="text" className="border-gray-400 border-2 rounded p-[0.1rem]" placeholder="Search Asset" onChange={(e) => setSearch(e.currentTarget.value)}>
                </input>
                {/* <Search
                  data={[
                    ...props.assets?.map((obj) => {
                      return {
                        value: obj ? obj.id.toString() : "",
                        label: obj ? obj.name.toString() : "",
                      }
                    }),
                  ]}

                /> */}
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
                onClick={() => setOpenModalDel(true)}
                className="flex gap-2 rounded-md p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none"
              >
                {checkboxes.includes(-1)
                  ? `Delete all record/s ( ${props.assets.length} ) ?`
                  : `Delete selected record/s ( ${checkboxes.length} )`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
              <i className="fa-solid fa-print text-xs" />
              Print CVs
            </button>
            <Link href={"/assets/create"}>
              <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
                <i className="fa-regular fa-plus text-xs" />
                <p>Add New</p>
              </div>
            </Link>
          </div>
        </div>
      </section >
      <AssetTable
        checkboxes={checkboxes}
        setCheckboxes={setCheckboxes}
        rows={props.assets}
        filterBy={filterBy}
        columns={columns.filter((col) => filterBy.includes(col.value))}
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
      <AssetDeleteModal
        checkboxes={checkboxes}
        setCheckboxes={setCheckboxes}
        assets={props.assets}
        openModalDel={openModalDel}
        setOpenModalDel={setOpenModalDel}
      />
    </div >
  )
}

export default DisplayAssets
