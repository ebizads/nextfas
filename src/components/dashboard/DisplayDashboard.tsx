import React, { useState, useEffect } from "react"
import { Pagination } from "@mantine/core"
import AssetTable, { AssetDeleteModal } from "../atoms/table/AssetTable"
import { AssetType } from "../../types/generic"
import { columns } from "../../lib/table"
import PaginationPopOver from "../atoms/popover/PaginationPopOver"
import FilterPopOver from "../atoms/popover/FilterPopOver"
import { useSearchStore } from "../../store/useStore"
import { downloadExcel_assets, downloadExcel_templateAssets } from "../../lib/functions"
import { UserType } from "../../types/generic"
import { ExcelExportAssetType } from "../../types/asset"
import { trpc } from "../../utils/trpc"
import Modal from "../headless/modal/modal"
import DropZone from "../dropzone/DropZone"
import AddAssetPopOver from "../atoms/popover/AddAssetPopOver"
import DropZone_asset from "../dropzone/Asset dropzone/DropZone_asset"

const DisplayDashboard = (props: {
  user: UserType
  total: number
  assets: AssetType[]
  assetsSample: AssetType[]
  accessiblePage: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {

  const { setSearch } = useSearchStore()
  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [openAddPopover, setOpenAddPopover] = useState<boolean>(false)

  const [firstLogin, setFirstLogin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [addBulkRecord, setAddBulkRecord] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value))
  console.log("check", filterBy)


  useEffect(() => {
    setSearch("")
  }, [setSearch])

  return (
    <div className="space-y-4">
      <section className="space-y-4">
      </section >
      <AssetTable
        checkboxes={checkboxes}
        setCheckboxes={setCheckboxes}
        rows={props.assets}
        filterBy={filterBy}
        columns={columns.filter((col) => filterBy.includes(col.value))}
      />
      <section className="flex justify-between px-4">
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
        <DropZone_asset
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

export default DisplayDashboard
