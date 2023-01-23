import React, { useEffect, useRef, useState } from "react"
import {
    useMinimizeStore,
    useDisposeAssetStore,
    useUpdateAssetStore,
} from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import Modal from "../../asset/Modal"
import { AssetType } from "../../../types/generic"
import { columns } from "../../../lib/table"
import { getProperty } from "../../../lib/functions"
import { navigations } from "../accordions/NavAccordion"
import { trpc } from "../../../utils/trpc"
import { useReactToPrint } from "react-to-print"
import JsBarcode from "jsbarcode"
import Link from "next/link"

const DisposeAssetDetailsModal = (props: {
    asset: AssetType | null
    openModalDesc: boolean
    setOpenModalDesc: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
    setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
}) => {

    // useEffect(() => {
    //   console.log(props.asset.addedBy)
    // }, [])

    const componentRef = useRef(null)
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })


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
            width: 1,

        })
    }

    useEffect(() => {
        if (!props.openModalDesc) {
            setGenBarcode(false)
        }
    }, [props.openModalDesc])

    const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()
    const { disposeAsset, setDisposeAsset } = useDisposeAssetStore()
    // const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

    // console.log("asset number: "+props.asset!.number!);
    return (
        <>
            <Modal
                size={13}
                isOpen={props.openModalDesc}
                setIsOpen={props.setOpenModalDesc}
            >
                <div className="px-8 py-6">
                    <div className="flex w-full text-sm text-light-primary">
                        <div className="w-[80%] flex flex-col gap-2">
                            {/* asset information */}
                            <section className="border-b pb-4">
                                <p className="font-medium text-neutral-600 text-base">Asset Information</p>
                                <div className="text-sm mt-4 flex flex-col gap-4">
                                    <section className="grid grid-cols-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Asset Number</p>
                                            <p className="font-medium">{props.asset?.number}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Alternate Asset No.</p>
                                            <p className="font-medium">
                                                {props.asset?.alt_number !== ""
                                                    ? props.asset?.alt_number
                                                    : "No Alternate Number"}
                                            </p>
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
                                            <p className="font-medium">{props.asset?.parentId !== 0 ? props.asset?.parent?.name : "--"}</p>
                                            <p className="text-[0.6rem] text-neutral-500 italic">{props.asset?.parentId !== 0 && props.asset?.parent?.number}</p>

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
                                    <section className="grid grid-cols-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Original Cost</p>
                                            <p className="font-medium">{props.asset?.management?.currency} {props.asset?.management?.original_cost ?? "no information"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Current Cost</p>
                                            <p className="font-medium">{props.asset?.management?.currency} {props.asset?.management?.current_cost ?? "no information"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Residual Value Cost</p>
                                            <p className="font-medium">{props.asset?.management?.currency} {props.asset?.management?.residual_value ?? "no information"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Residual Value Percentage</p>
                                            <p className="font-medium">{props.asset?.management?.residual_percentage ?? "no information"}%</p>
                                        </div>
                                    </section>
                                    <section className="grid grid-cols-4">

                                        <div className="col-span-1">
                                            <p className="font-light">Asset Lifetime</p>
                                            <p className="font-medium">{props.asset?.management?.asset_lifetime ? props.asset?.management?.asset_lifetime : "--"} Months</p>
                                        </div>
                                    </section>
                                    <section>
                                        <p className="font-light">Description</p>
                                        <p className="font-medium">{props.asset?.description ?? "--"}</p>
                                    </section>
                                </div>
                            </section>

                            <section className="border-b pb-4">
                                <p className="font-medium text-neutral-600 text-base">General Information</p>
                                <div className="text-sm mt-4 flex flex-col gap-4">
                                    <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Employee ID</p>
                                            <p className="font-medium">{props.asset?.custodian?.employee_id ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Name</p>
                                            <p className="font-medium">{props.asset?.custodian?.name ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Position</p>
                                            <p className="font-medium">{props.asset?.custodian?.position ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Team</p>
                                            <p className="font-medium">{props.asset?.department?.teams?.name}</p>
                                        </div>
                                    </section>
                                    <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Company</p>
                                            <p className="font-medium">{props.asset?.department?.company?.name !== "" ? props.asset?.department?.company?.name : "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Location</p>
                                            <p className="font-medium">{props.asset?.department?.location?.floor} floor</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Department</p>
                                            <p className="font-medium">{props.asset?.department?.name}</p>
                                        </div>
                                        <div className="col-span-1">
                                            {/* <p className="font-light">Currency</p>
                      <p className="font-medium">{props.asset?.management?.currency ?? "--"}</p> */}
                                        </div>
                                    </section><section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Asset Location</p>
                                            <p className="font-medium">{props.asset?.management?.asset_location}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Class</p>
                                            <p className="font-medium">{props.asset?.model?.classId ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Category</p>
                                            <p className="font-medium">{props.asset?.model?.categoryId ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Type</p>
                                            <p className="font-medium">{props.asset?.model?.typeId ?? "--"}</p>
                                        </div>
                                    </section>
                                    <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Currency</p>
                                            <p className="font-medium">{props.asset?.management?.currency}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Accounting Method</p>
                                            <p className="font-medium">{props.asset?.management?.accounting_method ?? "--"}</p>
                                        </div>

                                        <div className="col-span-1">
                                            <p className="font-light">Purchase Date</p>
                                            <p className="font-medium">{props.asset?.management?.purchase_date ? (props.asset?.management?.purchase_date?.toLocaleDateString()) : "--"}</p>
                                        </div>
                                    </section>
                                    <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Depreciation Method</p>
                                            <p className="font-medium">{props.asset?.management?.depreciation_rule}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Depreciation Start Date</p>
                                            <p className="font-medium">{props.asset?.management?.depreciation_start ? (props.asset?.management?.depreciation_start?.toLocaleDateString()) : "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Depreciation End Date</p>
                                            <p className="font-medium">{props.asset?.management?.depreciation_end ? (props.asset?.management?.depreciation_end?.toLocaleDateString()) : "--"}</p>
                                        </div>
                                    </section>
                                </div>
                            </section>
                            <section className="border-b pb-4">
                                <p className="font-medium text-neutral-600 text-base">Asset Usage</p>
                                <div className="text-sm mt-4 flex flex-col gap-4">
                                    <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Date of Usage</p>
                                            <p className="font-medium">{props.asset?.management?.depreciation_start ? (props.asset?.management?.depreciation_start?.toLocaleDateString()) : "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Period</p>
                                            <p className="font-medium">{props.asset?.management?.depreciation_period ?? "--"}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="font-light">Period</p>
                                            <p className="font-medium">{props.asset?.management?.asset_quantity ?? "--"}</p>
                                        </div>
                                    </section>
                                    <section className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <p className="font-light">Comments</p>
                                            <p className="font-medium">{props.asset?.management?.remarks ?? "--"}</p>
                                        </div>
                                    </section>
                                </div>
                            </section>
                            {/* <section className="pb-4">
                <p className="font-medium text-neutral-600 text-base">Depreciation Information</p>
                <div className="text-sm mt-4 flex flex-col gap-2">
                  <section className="grid grid-cols-4 gap-2">
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
                    <div className="col-span-1">
                      <p className="font-light">Asset Quantity</p>
                      <p className="font-medium">{props.asset?.management?.asset_quantity ? props.asset?.management?.asset_quantity : "--"}</p>
                    </div>
                  </section>
                  <section>
                    <p className="font-light">Remarks</p>
                    <p className="font-medium">{props.asset?.management?.remarks ?? "--"}</p>
                  </section>
                </div>
              </section> */}
                        </div>
                        <button
                            className="outline-none focus:outline-none"
                            onClick={() => props.setOpenModalDesc(false)}
                        >
                            {""}
                            <i className="fa-regular fa-circle-xmark fixed top-1 right-2 text-lg text-light-secondary" />
                        </button>
                        <div className="mt-4 flex flex-col justify-between border-l px-6">
                            <section className="relative">
                                <div className="flex-h relative h-[107.2px] w-[195.2px] border-2 border-tangerine-300 p-2">
                                    {!genBarcode && (
                                        <button
                                            onClick={genBar}
                                            className="absolute top-8 left-4 z-[10000] rounded-lg bg-tangerine-400 px-5 py-2 text-neutral-50 outline-none hover:bg-tangerine-500 focus:outline-none"
                                        >
                                            Generate Barcode
                                        </button>
                                    )}


                                    <div id="printSVG" ref={componentRef}>
                                        <svg id="barcode" />
                                    </div>
                                </div>
                                {genBarcode && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handlePrint()
                                            console.log("printing barcode")
                                        }}
                                        className="absolute bottom-3 right-2 flex items-center justify-center gap-2 rounded-full bg-tangerine-300 p-2 outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
                                    >
                                        {""} <i className="fa-solid fa-print" />
                                    </button>
                                )}
                                <div className="flex flex-col gap-4 p-2">
                                    <div className="">
                                        <p className="font-medium">Class</p>
                                        <p className="font-light">
                                            {props.asset?.model?.class
                                                ? props.asset?.model?.class?.name
                                                : "--"}
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="font-medium">Category</p>
                                        <p className="font-light">
                                            {props.asset?.model?.category
                                                ? props.asset?.model?.category?.name
                                                : "--"}
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="font-medium">Type</p>
                                        <p className="font-light">
                                            {props.asset?.model?.type
                                                ? props.asset?.model?.type?.name
                                                : "--"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                            <div className="space-y flex flex-col">
                                <nav className="relative my-2 flex flex-1 flex-col gap-2 ">
                                    <button
                                        onClick={() => {
                                            setDisposeAsset(selectedAsset)
                                            props.setOpenModalDesc(false)

                                            console.log("dispose btn clicked: " + selectedAsset?.number)
                                        }}
                                    >
                                        <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#e2e4e9] py-2 px-3 text-start text-sm outline-none hover:bg-slate-300 focus:outline-none xl:text-base">
                                            <i className={"fa-solid fa-pen-to-square"} />
                                            Dispose
                                        </div>
                                    </button>

                                    {/* {navigations[0]?.subType?.map((action, idx) => (

                  <button
                    key={idx}
                    className="flex items-center gap-2 rounded-md bg-[#F1F4F9] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base"
                  >
                    <i className={action.icon} />
                    {action.name}
                  </button>
                ))} */}
                                </nav>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

const DisposeAssetTable = (props: {
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

                        {/* <th scope="col" className="p-4 text-center">
              Action
            </th> */}
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
                                            console.log(row)
                                        }}
                                    >
                                        {getProperty(col.value, row)}
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
                  <i className="fa-light fa-trash-can text-red-500" />{" "}
                </button>
              </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

            <DisposeAssetDetailsModal
                asset={selectedAsset}
                openModalDesc={openModalDesc}
                setOpenModalDesc={setOpenModalDesc}
                setOpenModalDel={setOpenModalDel}
                setCheckboxes={props.setCheckboxes}
            />
        </div>
    )
}

export default DisposeAssetTable
