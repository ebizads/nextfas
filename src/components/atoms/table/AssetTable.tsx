import React, { useEffect, useMemo, useRef, useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox, Loader } from "@mantine/core"
import Modal from "../../asset/Modal"
import { AssetType } from "../../../types/generic"
import { asset_information, columns } from "../../../lib/table"
import { getProperty } from "../../../lib/functions"
import { navigations } from "../accordions/NavAccordion"
import { trpc } from "../../../utils/trpc"
import { useReactToPrint } from "react-to-print"
import JsBarcode from "jsbarcode"

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

  useEffect(() => {
    console.log(props.asset)
  }, [])

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [genBarcode, setGenBarcode] = useState(false)
  const genBar = () => {
    setGenBarcode(true)
    JsBarcode("#barcode", props.asset ? props.asset!.number! : "No data", {
      textAlign: "left",
      textPosition: "bottom",
      fontOptions: "",
      fontSize: 12,
      textMargin: 6,
      height: 50,
      width: 1
    })
  }

  useEffect(() => {
    if (!props.openModalDesc) {
      setGenBarcode(false)
    }
  }, [props.openModalDesc])


  return (
    <Modal
      size={13}
      isOpen={props.openModalDesc}
      setIsOpen={props.setOpenModalDesc}
    >
      <div className="px-8 py-6">
        <div className="flex w-full text-light-primary text-sm">
          <div className="w-[80%] flex flex-col gap-2">
            <section className="border-b pb-4">
              <p className="font-medium text-neutral-600 text-base">Asset Information</p>
              <div className="text-sm mt-4 flex flex-col gap-4">
                <section className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <p className="font-light">Asset Number</p>
                    <p className="font-medium">{props.asset?.number}</p>
                    <p className="text-[0.6rem] text-neutral-500 italic">{props.asset?.alt_number !== "" ? props.asset?.alt_number : "no alternate number"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Name</p>
                    <p className="font-medium">{props.asset?.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Serial No.</p>
                    <p className="font-medium">{props.asset?.serial_no !== "" ? props.asset?.serial_no : "--"}</p>
                  </div>
                </section>
                <section className="grid grid-cols-4">
                  <div className="col-span-1">
                    <p className="font-light">Parent Asset</p>
                    <p className="font-medium">{props.asset?.parentId !== 0 ? props.asset?.parentId : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Model Name</p>
                    <p className="font-medium">{props.asset?.model?.name ? props.asset?.model?.name : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Model Brand</p>
                    <p className="font-medium">{props.asset?.model?.brand ? props.asset?.model?.brand : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Model Number</p>
                    <p className="font-medium">{props.asset?.model?.number ? props.asset?.model?.number : "--"}</p>
                  </div>
                </section>
                <section>
                  <p className="font-light">Description</p>
                  <p className="font-medium">{props.asset?.description ?? "--"}</p>
                </section>
              </div>
            </section>
            <section className="border-b pb-4">
              <p className="font-medium text-neutral-600 text-base">Custodian Information</p>
              <div className="text-sm mt-4">
                <section className="grid grid-cols-4 gap-2 space-y-2">
                  <div className="col-span-1">
                    <p className="font-light">Employee ID</p>
                    <p className="font-medium">{props.asset?.custodian?.employee_id}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Name</p>
                    <p className="font-medium">{props.asset?.custodian?.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Position</p>
                    <p className="font-medium">{props.asset?.custodian?.position}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Team</p>
                    <p className="font-medium">{props.asset?.department?.teams?.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Location</p>
                    <p className="font-medium">{props.asset?.department?.location?.floor}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Department</p>
                    <p className="font-medium">{props.asset?.department?.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Company</p>
                    <p className="font-medium">{props.asset?.department?.company?.name !== "" ? props.asset?.department?.company?.name : "--"}</p>
                  </div>
                </section>
              </div>
            </section>
            <section className="border-b pb-4">
              <p className="font-medium text-neutral-600 text-base">Accounting Information</p>
              <div className="text-sm mt-4">
                <section className="grid grid-cols-4 gap-2 space-y-2">
                  <div className="col-span-1">
                    <p className="font-light">Currency</p>
                    <p className="font-medium">{props.asset?.management?.currency ?? "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Method</p>
                    <p className="font-medium">{props.asset?.management?.accounting_method ?? "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Original Cost</p>
                    <p className="font-medium">{props.asset?.management?.original_cost ?? "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Current Cost</p>
                    <p className="font-medium">{props.asset?.management?.current_cost ?? "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Purchased Date</p>
                    <p className="font-medium">{props.asset?.management?.purchase_date ? (props.asset?.management?.purchase_date?.toLocaleDateString()) : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Purchased From</p>
                    <p className="font-medium">{props.asset?.vendor?.id !== 0 ? props.asset?.vendor?.name : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Purchased By</p>
                    <p className="font-medium">Arvae (to add)</p>
                  </div>
                </section>
              </div>
            </section>
            <section className="pb-4">
              <p className="font-medium text-neutral-600 text-base">Depreciation Information</p>
              <div className="text-sm mt-4 flex flex-col gap-2">
                <section className="grid grid-cols-4 gap-2 space-y-2">
                  <div className="col-span-1">
                    <p className="font-light">Start Date</p>
                    <p className="font-medium">{props.asset?.management?.depreciation_start ? props.asset?.management?.depreciation_start?.toLocaleDateString() : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">End Date</p>
                    <p className="font-medium">{props.asset?.management?.depreciation_end ? props.asset?.management?.depreciation_end?.toLocaleDateString() : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Residual Value</p>
                    <p className="font-medium">{props.asset?.management?.residual_value ? props.asset?.management?.residual_value : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Period</p>
                    <p className="font-medium">{props.asset?.management?.depreciation_period ? props.asset?.management?.depreciation_period : "--"}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-light">Method</p>
                    <p className="font-medium">{props.asset?.management?.depreciation_rule ? props.asset?.management?.depreciation_rule : "--"}</p>
                  </div>
                </section>
                <section>
                  <p className="font-light">Remarks</p>
                  <p className="font-medium">{props.asset?.description ?? "--"}</p>
                </section>
              </div>
            </section>
          </div>
          <div className="mt-4 px-6 border-l">
            <section className="relative">
              <div className="p-2 border-2 w-[195.2px] h-[107.2px] border-tangerine-300 relative">
                {
                  !genBarcode && <button onClick={genBar} className="absolute top-8 left-4 z-[10000] outline-none focus:outline-none text-neutral-50 bg-tangerine-400 hover:bg-tangerine-500 rounded-lg px-5 py-2">
                    Generate Barcode
                  </button>
                }

                <div id="printSVG" ref={componentRef}>
                  <svg id="barcode" />
                </div>
              </div>
              {
                genBarcode && <button
                  type="button"
                  onClick={() => { handlePrint(); console.log("printing barcode") }}
                  className="disabled:cursor-not-allowed flex gap-2 justify-center items-center disabled:bg-tangerine-200 outline-none focus:outline-none p-2 rounded-full absolute bottom-3 right-2 bg-tangerine-300 hover:bg-tangerine-400">
                  {""} <i className="fa-solid fa-print" />
                </button>}
            </section>
            <section className="flex flex-col gap-2 p-2">

              <div className="">
                <p className="font-medium">Class</p>
                <p className="font-light">{props.asset?.model?.class ? props.asset?.model?.class?.name : "--"}</p>
              </div>
              <div className="">
                <p className="font-medium">Category</p>
                <p className="font-light">{props.asset?.model?.category ? props.asset?.model?.category?.name : "--"}</p>
              </div>
              <div className="">
                <p className="font-medium">Type</p>
                <p className="font-light">{props.asset?.model?.type ? props.asset?.model?.type?.name : "--"}</p>
              </div>
            </section>
            <nav className="relative my-2 flex flex-1 flex-col gap-2 ">
              <button
                className="outline-none focus:outline-none"
                onClick={() => props.setOpenModalDesc(false)}
              >
                {""}
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
      <div className="m-4 flex flex-col ">
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
                className={`fa-solid ${showList ? " fa-caret-up" : " fa-caret-down"
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
                    {asset?.number ?? "--"}
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
            // disabled={isLoading}
            >
              Yes, delete record/s
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
      className={`max-h-[62vh] max-w-[90vw] overflow-x-auto ${minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
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
                  {" "}
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
