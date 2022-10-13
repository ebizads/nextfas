import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import Modal from "../../asset/Modal"
import { AssetType } from "../../../types/assets"
import { asset_information, columns } from "../../../lib/table"
import { navigations } from "../../nav/NavAccordion"
import { getProperty } from "../../../lib/functions"

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
  asset: AssetType
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
                        value={getProperty(detail.type, props.asset)}
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
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null)

  const selectAllCheckboxes = () => {
    if (props.checkboxes.length === 0) {
      props.setCheckboxes([-1])
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
                className="max-w-[10rem] truncate px-6 duration-150"
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
          {props.rows.map((row) => (
            <tr
              key={row.id}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-2">
                <div className="flex items-center justify-center">
                  <Checkbox
                    value={row.id}
                    color={"orange"}
                    onChange={(e) => {
                      toggleCheckbox(Number(e.target.value))
                    }}
                    checked={
                      props.checkboxes.includes(row.id) ||
                      props.checkboxes.includes(-1)
                    }
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
                <i className="fa-light fa-pen-to-square" />
                <i className="fa-light fa-trash-can text-red-500" />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AssetDetailsModal
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        asset={selectedAsset!}
        openModalDesc={openModalDesc}
        setOpenModalDesc={setOpenModalDesc}
      />
    </div>
  )
}

export default AssetTable
