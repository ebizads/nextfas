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
import { currentValue, downloadExcel, downloadExcel_assets } from "../../lib/functions"
import { UserType } from "../../types/generic"
import { ExcelExportType } from "../../types/employee"
import { ExcelExportAssetType } from "../../types/asset"
import { trpc } from "../../utils/trpc"
import Modal from "../headless/modal/modal"
import DropZone from "../dropzone/DropZone"
import AddAssetPopOver from "../atoms/popover/AddAssetPopOver"

const DisplayAssets = (props: {
  user: UserType
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
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [openAddPopover, setOpenAddPopover] = useState<boolean>(false)

  const [firstLogin, setFirstLogin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value))
  console.log(search)
  const { data } = trpc.asset.findAll.useQuery({
  })

  useEffect(
    () => {
      setSearch("");

    },
    [setSearch]

  );
  const [assets, setAssets] = useState<AssetType[]>([])

  useEffect(() => {
    //get and parse all data
    console.log("sample ", data, search)
    if (data) {
      setAssets(data.assets as AssetType[])
    }
  }, [data, search])
  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
                <input type="text" className="border-gray-400 border-2 rounded p-[0.1rem]" placeholder="Search Asset Name" onChange={(e) => setSearch(e.currentTarget.value)}>
                </input>
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
            <button onClick={() => {

              const downloadableAssets = props.assets.map((assets) => {
                if (assets?.['management'] && assets?.['department'] && assets?.['model']) { // && assets?.['model'] && assets?.model?.['category'] && assets?.model?.['class'] && assets?.model?.['type']
                  const { model, department, management, ...rest } = assets //project, parent, vendor, subsidiary, addedBy, custodian,
                  return {
                    ...rest,

                    ...management,
                    department_name: department.name,
                    ...department,
                    model_name: model.name,
                    model_no: model.number,
                    model_brand: model.brand,
                    model_class: model.class?.name ?? "",
                    model_category: model.category.name,
                    model_type: model.type.name,
                    // model_name: model.name ?? "",
                    // class_name: model?.class.name,
                    // category_name: model?.category.name,
                    // type_name: model?.type.name,
                    // parent_id: parent.id,
                    // ...parent,
                    // vendor_id: vendor.id,
                    // ...vendor,
                    // subsidiary_id: subsidiary.id,
                    // ...subsidiary,
                    // addedBy_id: addedBy.id,
                    // ...addedBy,
                    // custodian_id: custodian.id,
                    // ...custodian,
                    // project_id: project.id,
                    // ...project,
                    name: rest.name,
                    id: rest.id
                  }
                }
              }) as ExcelExportAssetType[]
              console.log("TEST: " + JSON.stringify(downloadableAssets))

              downloadExcel_assets(downloadableAssets)
            }} className="flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
              <i className="fa-solid fa-print text-xs" />
              Print Asset
            </button>
            {/* <Link href={"/assets/create"}>
              <div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
                <i className="fa-regular fa-plus text-xs" />
                <p>Add New</p>
              </div>
            </Link> */}
            <AddAssetPopOver
              openPopover={openAddPopover}
              setOpenPopover={setOpenAddPopover}
              // setAddSingleRecord={setAddSingleRecord}
              setAddBulkRecord={setAddBulkRecord}
            />
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
      <Modal
        title="Add Bulk Record of Assets"
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
