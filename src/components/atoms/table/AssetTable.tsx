import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import Modal from "../../asset/Modal"
import { AssetType } from "../../../types/assets"
import { asset_information, columns } from "../../../lib/table"
import { getProperty } from "../../../lib/functions"
import { navigations } from "../../nav/NavAccordion"
import { trpc } from "../../../utils/trpc"

const Detail = (props: {
  key?: number
  className?: string
  label: string
  value: string
}) => {
  return (
    <div className={props.className}>
      <p className="font-medium">{props.label}</p>
      <p className="truncate text-light-secondary">{props.value}</p>
    </div>
  )
}

const info_names = [
  "Asset Information",
  "Vendor Information",
  "Manufacturer Information",
  "Purchase Information",
]

const AssetDetailsModal = (props: {
  asset: AssetType | null
  openModalDesc: boolean
  setOpenModalDesc: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Modal
      size={13}
      isOpen={props.openModalDesc}
      setIsOpen={props.setOpenModalDesc}
    >
      <div className="m-4 ">
        <div className="flex w-full">
          <div className="w-[80%]">
            {asset_information.map((info, idx) => (
              <section
                key={idx}
                className={`flex flex-col gap-2 ${
                  idx === 0 ? "" : "border-t"
                } py-4 text-light-primary`}
              >
                <h3 className="font-medium xl:text-lg">{info_names[idx]}</h3>
                {props.asset && (
                  <div className="grid grid-cols-4 gap-4 pl-2 text-xs xl:text-sm">
                    {info.map((detail, idx) => (
                      <Detail
                        key={idx}
                        className=""
                        label={detail.label}
                        value={
                          props.asset
                            ? getProperty(detail.type, props.asset)
                            : ""
                        }
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
          <nav className="relative my-2 flex flex-1 flex-col gap-2 border-l pl-2 text-light-primary">
            <button
              className="outline-none focus:outline-none"
              onClick={() => props.setOpenModalDesc(false)}
            >
              <i className="fa-regular fa-circle-xmark fixed top-1 right-2 text-lg text-light-secondary" />
            </button>
            <p className="font-medium xl:text-lg">Asset Transactions</p>
            {navigations[0]?.subType?.map((action, idx) => (
              <button
                key={idx}
                className="flex items-center gap-2 rounded-md bg-[#F1F4F9] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base"
              >
                <i className={action.icon} />
                {action.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </Modal>
  )
}

export const AssetDeleteModal = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  openModalDel: boolean
  assets: AssetType[]
  setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [showList, setShowList] = useState<boolean>(false)

  //trpc utils for delete
  const utils = trpc.useContext()
  const { mutate, isLoading } = trpc.asset.deleteMany.useMutation({
    onSuccess() {
      utils.asset.findAll.invalidate()
    },
  })
  const handleDelete = () => {
    const id_array = [...props.checkboxes]
    //delete function
    mutate([...id_array])
    props.setCheckboxes([])
    props.setOpenModalDel(false)
  }

  return (
    <Modal
      size={8}
      isOpen={props.openModalDel}
      setIsOpen={props.setOpenModalDel}
    >
      <div className="m-4 flex flex-col text-light-primary">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            You are about to permanently delete{" "}
            <button
              className="border-b border-tangerine-600 text-tangerine-600 hover:bg-tangerine-100"
              onClick={() => {
                setShowList(!showList)
              }}
            >
              {props.checkboxes.length}{" "}
              {props.checkboxes.length > 1 ? "records" : "record"}{" "}
              <i
                className={`fa-solid ${
                  showList ? " fa-caret-up" : " fa-caret-down"
                }`}
              />
            </button>{" "}
            from <span className="text-tangerine-600">Assets Table</span>.
          </div>
          {showList && props.assets && (
            <ul className="min-h-10 flex h-fit max-h-20 w-fit flex-col ">
              {props.assets
                .filter((asset) => props.checkboxes.includes(asset?.id ?? 0))
                .map((asset, idx) => (
                  <li
                    key={asset?.id ?? idx}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <i className="fa-solid fa-circle text-xs" />
                    {asset?.serial_number ?? "asset[serial_number]"}
                  </li>
                ))}
            </ul>
          )}
          <p className="text-neutral-500">
            This action is irrevokable, please carefully review the action.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-sm bg-gray-300 px-5 py-1 hover:bg-gray-400"
              onClick={() => props.setOpenModalDel(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-sm bg-red-500 px-5 py-1 text-neutral-50 hover:bg-red-600"
              onClick={() => handleDelete()}
              disabled={isLoading}
            >
              Yes, delete records
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
const AssetTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  filterBy: string[]
  rows: AssetType[]
  columns: ColumnType[]
}) => {
  //minimize screen toggle
  const { minimize } = useMinimizeStore()

  const [openModalDesc, setOpenModalDesc] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null)

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

  return (
    <div
      className={`max-h-[62vh] max-w-[90vw] overflow-x-auto ${
        minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
      } relative border shadow-md sm:rounded-lg`}
    >
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
          <tr>
            <th scope="col" className="py-1">
              <div className="flex items-center justify-center">
                <Checkbox
                  color={"orange"}
                  onChange={() => {
                    selectAllCheckboxes()
                  }}
                  checked={props.checkboxes.length > 0 ? true : false}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                  }}
                />
              </div>
            </th>
            {props.columns.map((col) => (
              <th
                key={col.name}
                scope="col"
                className="px-6 duration-150 max-w-[10rem] truncate"
              >
                {col.name}
              </th>
            ))}

            <th scope="col" className="p-4 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, idx) => (
            <tr
              key={row?.id ?? idx}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-2">
                <div className="flex items-center justify-center">
                  <Checkbox
                    value={row?.id ?? idx}
                    color={"orange"}
                    onChange={(e) => {
                      toggleCheckbox(Number(e.target.value))
                    }}
                    checked={props.checkboxes.includes(row?.id ?? idx)}
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </td>
              {columns
                .filter((col) => props.filterBy.includes(col.value))
                .map((col) => (
                  <td
                    key={col.value}
                    className="max-w-[10rem] cursor-pointer truncate py-2 px-6"
                    onClick={() => {
                      setOpenModalDesc(true)
                      setSelectedAsset(row)
                    }}
                  >
                    {getProperty(col.value, row)}
                    </td>
                ))}
              <td className="max-w-[10rem] space-x-2 text-center">
                <button>
                  <i className="fa-light fa-pen-to-square" />
                </button>
                <button
                  onClick={() => {
                    setOpenModalDel(true)
                    props.setCheckboxes([row?.id ?? idx])
                  }}
                >
                  <i className="fa-light fa-trash-can text-red-500" />{" "}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AssetDetailsModal
        asset={selectedAsset}
        openModalDesc={openModalDesc}
        setOpenModalDesc={setOpenModalDesc}
      />
      <AssetDeleteModal
        checkboxes={props.checkboxes}
        setCheckboxes={props.setCheckboxes}
        assets={props.rows}
        openModalDel={openModalDel}
        setOpenModalDel={setOpenModalDel}
      />
    </div>
  )
}

export default AssetTable
