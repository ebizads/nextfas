import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  useEditableStore,
  useMinimizeStore,
  useUpdateAssetStore,
  useDisposeAssetStore,
  useRepairAssetStore,
  useIssuanceAssetStore,
  useTransferAssetStore,
} from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import Modal from "../../asset/Modal"
import { HistoryLogType } from "../../../types/generic"
import { historyLogColumns } from "../../../lib/table"
import { getProperty } from "../../../lib/functions"
import { trpc } from "../../../utils/trpc"
import { useReactToPrint } from "react-to-print"
import JsBarcode from "jsbarcode"
import Link from "next/link"
import { useSearchStore } from "../../../store/useStore"
import QRCode from "react-qr-code"

const HistoryLogsTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: HistoryLogType[]
  columns: ColumnType[]
  showCheckboxes?: boolean
  refetch: () => Promise<{ data?: any }>
}) => {
  const showCheckboxes = props.showCheckboxes ?? true
  //minimize screen toggle
  const { minimize } = useMinimizeStore()

  const [openModalDesc, setOpenModalDesc] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const { disposeAsset, setDisposeAsset } = useDisposeAssetStore()
  const { repairAsset, setRepairAsset } = useRepairAssetStore()
  const { transferAsset, setTransferAsset } = useTransferAssetStore()
  const { issuanceAsset, setIssuanceAsset } = useIssuanceAssetStore()
  // const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null)

  const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()

  const selectAllCheckboxes = () => {
    if (props.checkboxes.length === 0) {
      props.setCheckboxes(props.rows.map((row, idx) => row?.id ?? idx))
    } else {
      props.setCheckboxes([])
    }
  }

  const toggleCheckbox = async (id: number) => {
    if (props.checkboxes.includes(id)) {
      // removes id if not selected
      props.setCheckboxes((prev) => prev.filter((e) => e !== id))
      return
    }
    // adds id
    props.setCheckboxes((prev) => [...prev, id])
  }

  useEffect(() => {
    setIssuanceAsset(selectedAsset)
    setDisposeAsset(selectedAsset)
    setTransferAsset(selectedAsset)
    setRepairAsset(selectedAsset)
  }, [
    selectedAsset,
    setDisposeAsset,
    setIssuanceAsset,
    setRepairAsset,
    setTransferAsset,
  ])

  return (
    <div
      className={`max-h-[62vh] max-w-[90vw] overflow-x-auto ${minimize ? "xl:w-[88vw]" : "xl:w-full"
        } relative border shadow-md sm:rounded-lg`}
    >
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
          <tr>
            {showCheckboxes && (
              <th scope="col" className="py-1">
                <div className="flex items-center justify-center">
                  <Checkbox
                    color={"orange"}
                    onChange={selectAllCheckboxes}
                    checked={props.checkboxes.length > 0}
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </th>
            )}

            {props.columns.map((col) => (
              <th
                key={col.name}
                scope="col"
                className="max-w-[10rem] truncate px-6 py-4 duration-150"
              >
                {col.name}
              </th>
            ))}

            {/* <th scope="col" className="p-4 text-center">
              Action
            </th> */}
          </tr>
        </thead>
        <tbody>
          {props.rows
            .sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0))
            .map((row, idx) => (
              <tr
                key={row?.id ?? idx}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                {showCheckboxes && (
                  <td className="w-4 p-2">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        value={row?.id ?? idx}
                        color={"orange"}
                        onChange={(e) => toggleCheckbox(Number(e.target.value))}
                        checked={props.checkboxes.includes(row?.id ?? idx)}
                        classNames={{
                          input:
                            "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none outline-none",
                        }}
                      />
                    </div>
                  </td>
                )}

                {historyLogColumns
                  .filter((col) => props.filterBy.includes(col.value))
                  .map((col) => (
                    <td
                      key={col.value}
                      className={`max-w-[10rem] cursor-pointer truncate py-2 px-6 ${
                        col.value == "status" && "capitalize"
                      }`}
                    >
                      {col.value == "typeId"
                        ? row?.asset?.type?.name
                        : getProperty(col.value, row)}
                    </td>
                  ))}
                {/* <td className="max-w-[10rem] space-x-2 text-center">
                <Link href={"/assets/update"} onClick={() => {
                  setSelectedAsset(row)
                }}>
                  <i className="fa-light fa-pen-to-square" />
                </Link>
                <button
                  onClick={() => {
                    setOpenModalDel(true)
                    props.setCheckboxes([row?.id ?? idx])
                  }}
                >
                  <i className="fa-light fa-trash-can text-red-500" />
                </button>
              </td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryLogsTable;
