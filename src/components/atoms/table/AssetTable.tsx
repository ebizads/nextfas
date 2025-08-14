import React, { useEffect, useRef, useState } from "react"
import { useMinimizeStore, useUpdateAssetStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import Modal from "../../asset/Modal"
import { Asset } from "../../../types/generic"
import { columns } from "../../../lib/table"
import { getProperty } from "../../../lib/functions"
import { trpc } from "../../../utils/trpc"
import { useReactToPrint } from "react-to-print"
import JsBarcode from "jsbarcode"
import Link from "next/link"
import { useSearchStore } from "../../../store/useStore"
import QRCode from "react-qr-code"
import { useSession } from "next-auth/react"

const AssetDetailsModal = (props: {
  asset: Asset | null
  openModalDesc: boolean
  setOpenModalDesc: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  refetch: () => Promise<{ data?: any }>
}) => {
  // useEffect(() => {
  //   console.log(props.asset.addedBy)
  // }, [])

  // const { editable, setEditable } = useEditableStore()
  const barcodeRef = useRef(null)
  const qrcodeRef = useRef(null)
  const [divOpacity, setDivOpacity] = useState(50)

  const handleBarPrint = useReactToPrint({
    content: () => barcodeRef.current,
    // onBeforeGetContent: () => {
    //   setDivOpacity("");

    // },
    onBeforePrint: () => {
      setDivOpacity(50)
    },

    onAfterPrint: () => {
      setDivOpacity(50)
    },
  })
  const handleQRPrint = useReactToPrint({
    content: () => qrcodeRef.current,
  })

  const emp = trpc.employee.findOne.useQuery(props.asset?.custodianId ?? 0)

  const [validateModal, setValidateModal] = useState<boolean>(false)
  const [validateString, setValidateString] = useState<string>("")
  const [statusToUpdate, setStatusToUpdate] = useState<string>("")
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false)

  const [genBarcode, setGenBarcode] = useState(false)
  const genBar = () => {
    setGenBarcode(true)
    // JsBarcode("#barcode", props.asset ? props.asset!.number! : "No data", {
    //   textAlign: "left",
    //   textPosition: "bottom",
    //   fontOptions: "",
    //   fontSize: 12,
    //   textMargin: 9,
    //   height: 50,
    //   width: 1,
    // }),
    JsBarcode("#barcode-show", props.asset ? props.asset!.number! : "No data", {
      textAlign: "left",
      textPosition: "bottom",
      fontOptions: "",
      fontSize: 12,
      textMargin: 6,
      height: 50,
      width: 1,
    })
  }

  // const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()
  // const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  const jsonData = {
    asset_no: props.asset?.number,
    asset_name: props.asset?.name,
    asset_serial: props.asset?.serial_no,
  }
  const stringifiedData = JSON.stringify(jsonData)

  const [genQRcode, setGenQRcode] = useState(false)
  const genQR = () => {
    setGenQRcode(true)
  }

  useEffect(() => {
    if (!props.openModalDesc) {
      setGenBarcode(false)
      setGenQRcode(false)
    }
  }, [props.openModalDesc])

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj)
  }

  const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()

  const {
    mutate: changeStatus,
    isLoading,
    error,
  } = trpc.asset.changeStatus.useMutation({
    onSuccess() {
      setStatusToUpdate("")
      setConfirmationModalOpen(false)
      props.setOpenModalDesc(false)
      props.refetch()
      console.log("status successfully changed")
    },
    onError(error) {
      console.error("Error changing status", error)
    },
  })

  const onConfirm = () => {
    changeStatus({
      id: props.asset?.id ?? 0,
      status: statusToUpdate,
    })
  }

  // const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  return (
    <>
      <Modal
        size={13}
        isOpen={props.openModalDesc}
        setIsOpen={props.setOpenModalDesc}
        preventClose={confirmationModalOpen}
        className={""}
      >
        <div className="h px-8 py-6 ">
          <div className="flex w-full text-sm text-light-primary">
            <div className="flex h-full  w-[80%] flex-col justify-between">
              {/* asset information */}
              <section className="h-[30vh] pb-4">
                <p className="text-base font-medium text-neutral-600">
                  Asset Information
                </p>
                <div className="mt-4 flex flex-col gap-4 text-sm">
                  <section className="grid grid-cols-3">
                    <div className="col-span-1">
                      <p className="font-light">Asset ID</p>
                      <p className="font-medium">{props.asset?.number}</p>
                    </div>

                    <div className="col-span-1">
                      <p className="font-light">Name</p>
                      <p className="font-medium">{props.asset?.name}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-light">Firearm Serial Number</p>
                      <p className="font-medium">
                        {props.asset?.serial_no !== ""
                          ? props.asset?.serial_no
                          : "--"}
                      </p>
                    </div>
                    {/* <div className="col-span-1">
                      <p className="font-light">RFID/ Barcode ID</p>
                      <p className="font-medium">
                        {props.asset?.barcode !== ""
                          ? props.asset?.barcode
                          : "--"}
                      </p>
                    </div> */}
                  </section>
                  <section className="grid grid-cols-3">
                    <div className="col-span-1">
                      <p className="font-light">Brand</p>
                      <p className="font-medium">
                        {props.asset?.brand !== "" ? props.asset?.brand : "--"}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-light">Model</p>
                      <p className="font-medium">
                        {props.asset?.models !== ""
                          ? props.asset?.models
                          : "--"}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-light">Caliber</p>
                      <p className="font-medium">
                        {props.asset?.caliber ?? "--"}
                      </p>
                    </div>
                  </section>
                  <section className="grid grid-cols-3">
                    <div className="col-span-1">
                      <p className="font-light">Type</p>
                      <p className="font-medium">
                        {props.asset?.type?.name
                          ? props.asset?.type?.name
                          : "--"}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-light">Action Type</p>
                      <p className="font-medium">
                        {props.asset?.actionType?.name ?? "--"}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-light">Description</p>
                      <p className="font-medium">
                        {props.asset?.description ?? "--"}
                      </p>
                    </div>
                  </section>
                  {/* <section className="grid grid-cols-3">
                    
                  </section> */}
                </div>
              </section>
              <section className="space-y flex flex-col ">
                <button
                  className="outline-none focus:outline-none"
                  onClick={() => props.setOpenModalDesc(false)}
                >
                  {""}
                  <i className="fa-regular fa-circle-xmark fixed top-1 right-2 text-lg text-light-secondary" />
                </button>
                <p className="font-medium xl:text-lg">Asset Options</p>
                <nav className="relative my-2 flex flex-1 gap-2 ">
                  {/* {props.asset?.status === "issued" && (
                    <button
                      onClick={() => {
                        setStatusToUpdate("in")
                        setConfirmationModalOpen(true)
                      }}
                    >
                      <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                        <i className={"fa-solid fa-hand-holding-box"} />
                        In
                      </div>
                    </button>
                  )} */}

                  {/* //TODO:  Fix this when we have Asset Issuance READY */}
                  {/* {props.asset?.status === null && (
                    <button onClick={() => {
                      setStatusToUpdate("out")
                      setConfirmationModalOpen(true)
                    }}>
                      <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                        <i className={"fa-solid fa-arrow-right-arrow-left"} />
                        Out
                      </div>
                    </button>
                  )} */}

                  {props.asset?.status === "in" && (
                    <button
                      onClick={() => {
                        setStatusToUpdate("issued")
                        setConfirmationModalOpen(true)
                      }}
                    >
                      <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                        <i className={"fa-solid fa-arrow-right-arrow-left"} />
                        Issue
                      </div>
                    </button>
                  )}

                  <Link href="/assets/update">
                    <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                      <i className={"fa-solid fa-pen-to-square"} />
                      Edit
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      props.setOpenModalDel(true)
                      props.setCheckboxes([props.asset?.id ?? -1])
                    }}
                    className="flex items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base"
                  >
                    <i className={"fa-solid fa-trash-can-xmark text-red-500"} />
                    Delete
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
              </section>
            </div>
            <button
              className="outline-none focus:outline-none"
              onClick={() => props.setOpenModalDesc(false)}
            >
              <i className="fa-regular fa-circle-xmark fixed top-1 right-2 text-lg text-light-secondary" />
            </button>
            <div className="mt-4 flex flex-col justify-between border-l pl-6">
              <section>
                <section className="relative">
                  <div className="relative h-[107.2px] w-[195.2px] border-2 border-tangerine-300 p-2">
                    {!genBarcode && (
                      <button
                        onClick={genBar}
                        className="absolute top-8 left-4 z-[10000] rounded-lg bg-tangerine-400 px-5 py-2 text-neutral-50 outline-none hover:bg-tangerine-500 focus:outline-none"
                      >
                        Generate Barcode
                      </button>
                    )}

                    {/* <div id="printSVG" className="relative z-20">
                      <svg id="barcode-show" />
                    </div> */}
                    <div ref={barcodeRef}>
                      <svg
                        id="barcode-show"
                        className={
                          "pointer-events-none absolute top-0 z-0 " +
                          `w-[${divOpacity}%]`
                        }
                      />
                    </div>
                  </div>
                  {genBarcode && (
                    <button
                      type="button"
                      onClick={() => {
                        handleBarPrint()
                        console.log(
                          "printing barcode",
                          "comporef: ",
                          barcodeRef
                        )
                      }}
                      className="absolute bottom-3 right-2 z-20 flex items-center justify-center gap-2 rounded-full bg-tangerine-300 p-2 outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
                    >
                      <i className="fa-solid fa-print" />
                    </button>
                  )}
                </section>
                <br></br>
                <section className="relative">
                  <div className="relative flex h-[185.14px] w-[195.2px] flex-col justify-center border-2 border-tangerine-300 p-2">
                    {!genQRcode && (
                      <button
                        onClick={genQR}
                        className=" z-[10000] rounded-lg bg-tangerine-400 px-5 py-2 text-neutral-50 outline-none hover:bg-tangerine-500 focus:outline-none"
                      >
                        Generate QR code
                      </button>
                    )}

                    {genQRcode && (
                      <div
                        id="printSVG1"
                        ref={qrcodeRef}
                        className="mb-3 -ml-2 mt-3 flex items-center justify-center"
                      >
                        <QRCode
                          className="h-auto w-[80%]"
                          value={stringifiedData ?? "--"}
                        />
                      </div>
                    )}
                  </div>
                  {genQRcode && (
                    <button
                      type="button"
                      onClick={() => {
                        handleQRPrint()
                        console.log("printing QR code", "comporef: ", qrcodeRef)
                      }}
                      className="absolute bottom-3 right-2 flex items-center justify-center gap-2 rounded-full bg-tangerine-300 p-2 outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
                    >
                      <i className="fa-solid fa-print" />
                    </button>
                  )}
                </section>
              </section>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        size={8}
        className="max-w-lg"
        isOpen={validateModal}
        setIsOpen={setValidateModal}
      >
        <div className="py-2">
          <p className=" text-center text-lg font-semibold">{validateString}</p>
        </div>
      </Modal>
      <Modal
        size={6}
        isOpen={confirmationModalOpen}
        setIsOpen={setConfirmationModalOpen}
      >
        <div className="flex flex-col items-center gap-5 px-8 py-4">
          <p>
            Set asset status to{" "}
            <span className={`capitalize text-red-500`}>
              &quot;{statusToUpdate}&quot;
            </span>
            ?
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setConfirmationModalOpen(false)
              }}
            >
              <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                <i className={"fa-solid fa-xmark"} />
                Cancel
              </div>
            </button>
            <button
              onClick={() => {
                onConfirm()
              }}
            >
              <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                <i className={"fa-solid fa-check"} />
                Confirm
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const AssetDeleteModal = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  openModalDel: boolean
  assets: Asset[]
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
          <div className="flex">
            This action will permanently delete&nbsp;
            <p className=" border-tangerine-600 text-tangerine-600  ">
              {props.checkboxes.length}
              {props.checkboxes.length > 1 ? " records" : " record"}
            </p>
            . Continue?
          </div>
          {/* {showList && props.assets && (
            <ul className="min-h-10 flex max-h-20 w-fit flex-col overflow-y-auto px-4">
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
          )} */}
          <p className="text-neutral-500">
            <i className="fa-regular fa-circle-exclamation" /> This action is
            irrevokable, please carefully review the action.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-sm bg-gray-300 px-5 py-1 hover:bg-gray-400"
              onClick={() => {
                props.setOpenModalDel(false)
                props.setCheckboxes([])
              }}
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
  rows: Asset[]
  columns: ColumnType[]
  showCheckboxes?: boolean
  refetch: () => Promise<{ data?: any }>
}) => {
  const showCheckboxes = props.showCheckboxes ?? true
  //minimize screen toggle
  const { minimize } = useMinimizeStore()

  const [openModalDesc, setOpenModalDesc] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  // const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null)

  const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()
  const { data: session } = useSession()
  const utils = trpc.useContext()

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

  const { mutate: addViewer } = trpc.asset.updateViewerList.useMutation({
    onSuccess(viewer) {
      utils.asset.findAll.invalidate()
      console.log(viewer)
    },
    onError(error) {
      console.error("Error highlighting", error)
    },
  })

  return (
    <div
      className={`max-h-[62vh] max-w-[90vw] overflow-x-auto ${
        minimize ? "xl:w-[88vw]" : "xl:w-full"
      } relative border shadow-md sm:rounded-lg`}
    >
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 ">
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
                className={`border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600 ${
                  !row?.ViewerList.some((user) => user.id == session?.user?.id)
                    ? "bg-[#F7F6FE] font-semibold text-black"
                    : "bg-white dark:bg-gray-800"
                }`}
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

                {columns
                  .filter((col) => props.filterBy.includes(col.value))
                  .map((col) => (
                    <td
                      key={col.value}
                      className={`max-w-[10rem] cursor-pointer truncate py-2 px-6 ${
                        col.value == "status" && "capitalize"
                      }`}
                      onClick={() => {
                        setOpenModalDesc(true)
                        setSelectedAsset(null)
                        setSelectedAsset(row)
                        addViewer({
                          assetId: row?.id ?? 0,
                          userId: session?.user?.id ?? 0,
                        })
                      }}
                    >
                      {col.value == "typeId"
                        ? row?.type?.name
                        : col.value == "actionTypeId"
                        ? row?.actionType?.name
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

      <AssetDetailsModal
        asset={selectedAsset}
        openModalDesc={openModalDesc}
        setOpenModalDesc={setOpenModalDesc}
        setOpenModalDel={setOpenModalDel}
        setCheckboxes={props.setCheckboxes}
        refetch={props.refetch}
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
