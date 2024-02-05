import React, { useEffect, useState } from "react"
import { Pagination, Tooltip } from "@mantine/core"
import AssetTable, { AssetDeleteModal } from "../../atoms/table/AssetTable"
import Link from "next/link"
import { AssetType } from "../../../types/generic"
import { columns } from "../../../lib/table"
import PaginationPopOver from "../../atoms/popover/PaginationPopOver"
// import FilterPopOver from '../../atoms/popover/FilterPopOver';
import DisposeAssetTable from "../../atoms/table/DisposeAssetTable"
import Modal from "../../headless/modal/modal"
import { Search } from "tabler-icons-react"
import { trpc } from "../../../utils/trpc"
import {
  useDisposeAssetStore,
  useSearchStore,
  useGenerateStore,
  useIssuanceAssetStore,
} from "../../../store/useStore"
// import IssuanceTable from '../../atoms/table/IssuanceTable';
// import { number } from 'zod';

const DisplayIssuanceAsset = (props: {
  total: number
  assets: AssetType[]
  accessiblePage: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
  // const [checkboxes, setCheckboxes] = useState<number[]>([]);
  // const [ openPopover, setOpenPopover ] = useState<boolean>(false);
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)

  const [filterBy] = useState<string[]>(columns.map((i) => i.value))

  const [assetNumber, setAssetNumber] = useState<string>("")
  const [validateString, setValidateString] = useState<string>("")

  const [assetId] = useState<number>(0)

  const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase())

  const [searchModal, setSearchModal] = useState<boolean>(false)
  const [validateModal, setValidateModal] = useState<boolean>(false)

  const { setIssuanceAsset } = useIssuanceAssetStore()
  const { setSearch } = useSearchStore()
  const { generate, setGenerate } = useGenerateStore()

  // useEffect(
  // 	() => {
  // 		setDisposeAsset(asset as AssetType);
  // 	},
  // 	[setDisposeAsset, asset]
  // );

  useEffect(() => {
    if (assetNumber !== "") {
      if (asset === null || asset?.deleted === true) {
        setSearchModal(true)
        setAssetNumber("")
      } else if (asset?.status === "disposal") {
        setValidateString("The asset is in for disposal")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.status === "repair") {
        setValidateString("The asset is in for repair.")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.status === "transfer") {
        setValidateString("The asset is being transferred.")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.AssetIssuance?.issuanceStatus === "issued") {
        setValidateString("The asset is already issued.")
        setValidateModal(true)
        setAssetNumber("")
      } else {
        setIssuanceAsset(asset as AssetType)
      }
    }
    // setGenerate(false);
    setSearch("")
  }, [asset, assetNumber, assetId, setSearch, setIssuanceAsset])

  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex w-fit items-center gap-2">
              <div className="flex-1">
                <div className="w-full py-4">
                  <div className="flex w-80 flex-row rounded-sm border border-[#F2F2F2] bg-[#F2F2F2]  py-2">
                    <input
                      type="text"
                      className="rounded border-2 border-gray-400 p-[0.1rem]"
                      placeholder="Search Asset"
                      onChange={(e) => setSearch(e.currentTarget.value)}
                    ></input>
                  </div>
                </div>

                <Modal
                  className="max-w-lg"
                  isVisible={searchModal}
                  setIsVisible={setSearchModal}
                  title="NOTICE!"
                >
                  <div className="py-2">
                    <p className="text-center text-lg font-semibold">
                      No Data Found!
                    </p>
                  </div>
                </Modal>
                <Modal
                  className="max-w-lg"
                  isVisible={validateModal}
                  setIsVisible={setValidateModal}
                  title="NOTICE!"
                >
                  <div className="py-2">
                    <p className="text-center text-lg font-semibold">
                      {validateString}
                    </p>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </section>
      {/* <IssuanceTable
                // checkboxes={checkboxes}
                // setCheckboxes={setCheckboxes}
                rows={props.assets}
                filterBy={filterBy}
                columns={columns.filter((col) => filterBy.includes(col.value))}
            /> */}
      <section className="mt-8 flex justify-between px-2">
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
        <div className="flex flex-row">
          <Tooltip
            label={!generate ? "Show all assets" : "Show only available assets"}
            withArrow
          >
            <button
              className="mx-2 py-1 font-medium text-gray-700 duration-150 hover:underline  disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                setGenerate(true)
              }}
            >
              {!generate ? "Show all" : "Show less"}
            </button>
          </Tooltip>
          <Pagination
            page={props.page}
            onChange={props.setPage}
            total={props.accessiblePage}
            classNames={{
              item: "bg-transparent selected-page:bg-tangerine-500 border-none",
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default DisplayIssuanceAsset
