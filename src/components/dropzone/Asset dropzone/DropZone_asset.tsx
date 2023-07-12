import React, { useEffect, useMemo, useState } from "react"
import { Group, Text } from "@mantine/core"
import { IconUpload, IconX } from "@tabler/icons"
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
} from "@mantine/dropzone"
import { ImageJSON } from "../../../types/table"
import Image from "next/image"
import * as XLSX from "xlsx"
import { ExcelExportType } from "../../../types/employee"
import { trpc } from "../../../utils/trpc"
import DuplicateAccordion_asset from "../../atoms/accordions/DuplicateAccordion_asset"
import { update } from "lodash"
import { EmployeeEditInput } from "../../../server/schemas/employee"
import { z } from "zod"
import EmployeeRecordsAccordion from "../../atoms/accordions/EmployeeRecordsAccordion"
import Employee from "../../../pages/employees"
import Modal from "../../headless/modal/modal"
import { DropZoneModal } from "../DropZoneModal"
import { AssetTransformInput } from "../../../server/schemas/asset"
import { ExcelExportAssetType } from "../../../types/asset"
import CreateAssetAccordion from "../../atoms/accordions/CreateAssetAccordion"
import AssetRecordsAccordion from "../../atoms/accordions/AssetRecordsAccordion"
import moment from "moment"

export type Asset = z.infer<typeof AssetTransformInput>
export default function DropZone_asset({
  setImage,
  loading,
  setIsLoading,
  file_type,
  acceptingMany,
  setIsVisible,
}: {
  setImage?: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  loading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  file_type: string
  acceptingMany?: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [closeModal, setCloseModal] = useState(false)
  const [idList, setIdList] = useState<string[]>([])
  const [importedData, setImportedData] = useState(false)
  const { data: duplicates } = trpc.asset.checkTableDuplicates.useQuery(idList)
  const [assetId, setAssetId] = useState<string>(
    `-${moment().format("YYMDhms")}`
  )
  const [duplicatedAssets, setDuplicatedAssets] = useState<
    ExcelExportAssetType[]
  >([])

  const utils = trpc.useContext()

  const {
    mutate,
    isLoading: assetLoading,
    error,
  } = trpc.asset.createOrUpdate.useMutation({
    onSuccess(rest: any) {
      setCloseModal(true)
      utils.asset.findAll.invalidate()

      console.log("omsiman: " + JSON.stringify(rest))

      // invalidate query of asset id when mutations is successful
    },
    onError() {
      console.log("TRY: " + error)
    }
  })



  const parseAssetsData = (data: unknown[]) => {

    //returns all id of parsed assets
    const id_list = data.map((asset) => {
      return String((asset as string[])[2] as string)
    }) as string[]

    if (id_list) {
      setIdList(id_list)
    }

    //filters duplicated ID

    const dupAssetList = data.filter((asset) => {
      console.log("TEST: " + JSON.stringify(data))

      return id_list.includes(
        asset && Number((asset as number[])[2] as number) !== 999999 ? String((asset as string[])[2] as string) : ""
      )
    }) as any[]

    function excelSerialDateToJSDate(serialDate: number) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const epoch = new Date('1899-12-31');

      const offset = (serialDate - 1) * millisecondsPerDay;
      const jsDate = new Date(epoch.getTime() + offset);
      jsDate.setUTCHours(jsDate.getUTCHours() - 8);

      return jsDate;
    }
    console.log("idlist: ", id_list)

    const final_dupList = [] as ExcelExportAssetType[]

    const parseId = (id: string | null) => {
      console.log("id: " + id)
      if (!id) {
        return "00"
      }
      if (id?.length === 1) {
        return "0" + id
      } else {
        return id
      }
    }

    const transformNumber = (id: string | number) => {
      return id?.toString()
    }

    dupAssetList.forEach((ast) => {
      const data_structure = {
        id: (ast as (string | number | null)[])[0] as number,
        name: (ast as (string | number | null)[])[1] as string,
        number: (ast[2] ? (ast as (string | number | null)[])[2] as string : (parseId(transformNumber((ast as (string | number | null)[])[13] as number)) + parseId(transformNumber((ast as (string | number | null)[])[63] as number)) + assetId as string)),
        alt_number: (ast as (string | number | null)[])[3] as string,
        serial_number: (ast as (string | number | null)[])[4] as string,
        barcode: (ast as (string | number | null)[])[5] as string,
        description: (ast as (number | null | string)[])[6] as string,
        remarks: (ast as (number | null | string)[])[7] as string,
        parentId: (ast as (string | number | null)[])[8] as number,
        modelId: (ast as (number | string | null)[])[9] as number,
        custodianId: (ast as (string | number | null)[])[10] as number,
        vendorId: (ast as (string | number | null)[])[11] as number,
        assetProjId: (ast as (string | number | null)[])[12] as number,
        createdAt: (ast[38] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[38] as number)) : null),
        updatedAt: (ast[39] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[39] as number)) : null),
        deletedAt: (ast[40] !== null ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[40] as number)) : null),
        deleted: (ast as (null | boolean)[])[41] as boolean,
        departmentId: (ast as (string | number | null)[])[13] as number,
        subsidiaryId: (ast as (string | number | null)[])[14] as number,
        addedById: (ast as (string | number | null)[])[15] as number,
        status: (ast as (string | null)[])[16] as string,
        userArchiveId: (ast as (string | number | null)[])[17] as number,
        category: (ast as (string | number | null)[])[18] as number,
        invoiceNum: (ast as (string | number | null)[])[19] as string,
        purchaseOrder: (ast as (string | number | null)[])[20] as string,
        deployment_status: (ast as (string | null)[])[21] as string,
        management: {
          id: (ast as (number | null)[])[27] as number,
          currency: (ast as (string | null)[])[28] as string,
          original_cost: (ast as (string | number | null)[])[29] as number,
          current_cost: (ast as (string | number | null)[])[30] as number,
          residual_value: (ast as (string | number | null)[])[31] as number,
          purchase_date: (ast[32] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[32] as number)) : null),
          depreciation_start: (ast[33] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[33] as number)) : null),
          depreciation_end: (ast[34] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[34] as number)) : null),
          depreciation_status: (ast as (string | null)[])[35] as string,
          depreciation_period: (ast as (number | null)[])[36] as number,
          depreciation_rule: (ast as (string | null)[])[37] as string,
          createdAt: (ast[49] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[49] as number)) : null),
          updatedAt: (ast[50] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[50] as number)) : null),
          deletedAt: (ast[51] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[51] as number)) : null),
          deleted: (ast as (null | boolean)[])[52] as boolean,
          assetId: (ast as (number | null)[])[42] as number,
          accounting_method: (ast as (string | null)[])[43] as string,
          depreciation_lifetime: (ast as (string | number | null)[])[44] as number,
          remarks: (ast as (string | null)[])[53] as string,
          residual_percentage: (ast as (string | number | null)[])[45] as number,
          asset_location: (ast as (string | null)[])[46] as string,
          asset_quantity: (ast as (string | number | null)[])[47] as number,
          asset_lifetime: (ast as (string | number | null)[])[48] as number,
        },
        model: {
          id: (ast as (string | number | null)[])[54] as number,
          name: (ast as (string | null)[])[55] as string,
          brand: (ast as (string | number | null)[])[61] as string,
          number: (ast as (string | number | null)[])[56] as string,
          classId: (ast as (string | number | null)[])[62] as number,
          typeId: (ast as (string | number | null)[])[63] as number,
          categoryId: (ast as (string | number | null)[])[64] as number,
          createdAt: (ast[57] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[57] as number)) : null),
          updatedAt: (ast[58] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[58] as number)) : null),
          deletedAt: (ast[59] ? new Date(excelSerialDateToJSDate((ast as (string | number | null | boolean)[])[59] as number)) : null),
          deleted: (ast as (boolean | null)[])[60] as boolean,
        }


      } as ExcelExportAssetType
      final_dupList.push(data_structure)

      // console.log(data_structure)

    })

    setDuplicatedAssets(
      final_dupList.sort((a, b) => {
        console.log("try: " + JSON.stringify(final_dupList))
        console.log("sort" + ((a.id ?? 0) - (b.id ?? 0)))
        return (a.id ?? 0) - (b.id ?? 0)
      })
    )

  }

  const checkDuplicated = () => {
    for (let x = 0; x <= duplicatedAssets.length; x++) {
      if (
        duplicatedAssets[x]?.id == 0 ||
        duplicatedAssets[x]?.id == null
      ) {
        console.log("SPLICE" + duplicatedAssets[x]?.id)

        duplicatedAssets.splice(x, 1)
      }
    }
  }

  const onDiscard = () => {
    setIsVisible(false)
  }





  const onSubmitUpdate = () => {
    // Register function
    try {
      for (let i = 0; i < duplicatedAssets.length; i++) {
        console.log("assets: " + JSON.stringify(duplicatedAssets[i]?.number))
        mutate({
          id: duplicatedAssets[i]?.id ?? 0,
          name: duplicatedAssets[i]?.name ?? "",
          number: duplicatedAssets[i]?.number ?? "",
          alt_number: duplicatedAssets[i]?.alt_number,
          serial_no: duplicatedAssets[i]?.serial_no ?? "",
          barcode: duplicatedAssets[i]?.barcode,
          description: duplicatedAssets[i]?.description ?? "",
          remarks: duplicatedAssets[i]?.remarks ?? "",
          parentId: duplicatedAssets[i]?.parentId ?? 0,
          modelId: duplicatedAssets[i]?.modelId ?? 0,
          custodianId: duplicatedAssets[i]?.custodianId ?? 0,
          vendorId: duplicatedAssets[i]?.vendorId ?? 0,
          assetProjectId: duplicatedAssets[i]?.assetProjectId ?? 0,
          // createdAt: duplicatedAssets[i]?.createdAt ?? new Date(),
          // updatedAt: duplicatedAssets[i]?.updatedAt ?? new Date(),
          deletedAt: duplicatedAssets[i]?.deletedAt ?? null,
          deleted: duplicatedAssets[i]?.deleted ?? false,
          departmentId: duplicatedAssets[i]?.departmentId ?? 0,
          subsidiaryId: duplicatedAssets[i]?.subsidiaryId ?? 0,
          invoiceNum: duplicatedAssets[i]?.invoiceNum ?? "",
          purchaseOrder: duplicatedAssets[i]?.purchaseOrder ?? "",
          deployment_status: duplicatedAssets[i]?.deployment_status ?? "",
          status: duplicatedAssets[i]?.status ?? "",
          management: {
            currency: duplicatedAssets[i]?.management?.currency ?? "",
            original_cost: duplicatedAssets[i]?.management?.original_cost ?? 0,
            current_cost: duplicatedAssets[i]?.management?.current_cost ?? 0,
            residual_value: duplicatedAssets[i]?.management?.residual_value ?? 0,
            purchase_date: duplicatedAssets[i]?.management?.purchase_date,
            depreciation_start: duplicatedAssets[i]?.management?.depreciation_start,
            depreciation_end: duplicatedAssets[i]?.management?.depreciation_end,
            depreciation_status: duplicatedAssets[i]?.management?.depreciation_status ?? "",
            depreciation_period: duplicatedAssets[i]?.management?.id ?? 0,
            depreciation_rule: duplicatedAssets[i]?.management?.depreciation_rule ?? "",
            // assetId: duplicatedAssets[i]?.id ?? 0,
            accounting_method: duplicatedAssets[i]?.management?.accounting_method ?? "",
            depreciation_lifetime: duplicatedAssets[i]?.management?.depreciation_lifetime ?? 0,
            residual_percentage: duplicatedAssets[i]?.management?.residual_percentage ?? 0,
            asset_location: duplicatedAssets[i]?.management?.asset_location ?? "",
            asset_quantity: duplicatedAssets[i]?.management?.asset_quantity ?? 1,
            asset_lifetime: duplicatedAssets[i]?.management?.asset_lifetime ?? 0,
            id: duplicatedAssets[i]?.management?.id ?? 0
          },
          model: {
            id: duplicatedAssets[i]?.model?.id ?? 0,
            name: duplicatedAssets[i]?.model?.name ?? "",
            brand: duplicatedAssets[i]?.model?.brand ?? "",
            number: duplicatedAssets[i]?.model?.number ?? "",
            classId: duplicatedAssets[i]?.model?.classId ?? 0,
            typeId: duplicatedAssets[i]?.model?.typeId ?? 0,
            categoryId: duplicatedAssets[i]?.model?.categoryId ?? 0,
            // class: {
            //   name: duplicatedAssets[i]?.model?.class?.name ?? "",
            // }
            // createdAt: duplicatedAssets[i]?.model?.createdAt ?? new Date(),
            // updatedAt: duplicatedAssets[i]?.model?.updatedAt ?? new Date(),
            deletedAt: duplicatedAssets[i]?.model?.deletedAt ?? null,
            deleted: duplicatedAssets[i]?.model?.deleted ?? false,
          }

        })
      }
    } catch { }
  }
  checkDuplicated()
  return (
    <div>
      {/* {"DUPLICATES: " + duplicates?.length} */}
      {importedData ? (
        duplicates?.length == 0 ||
          duplicates == null ||
          duplicates == undefined ? (
          duplicatedAssets.length == 0 ||
            duplicatedAssets == null ||
            duplicatedAssets == undefined ? (
            <div className="flex flex-col gap-2 px-4 py-2">
              <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
                <i className="fa-regular fa-circle-exclamation" />
                <p>Imported EXCEL file is empty, please try again.</p>
              </div>
              <Dropzone
                onDrop={(files) => {
                  setIsLoading(true)

                  if (file_type === "image") {
                    if (acceptingMany) {
                      for (let i = 0; i < files.length; i++) {
                        if (files[i]) {
                          const file_to_append = {
                            name: files[i]?.name ?? "",
                            size: files[i]?.size ?? 0,
                            //file fall back if null
                            file: files[i]
                              ? URL.createObjectURL(files[i] ?? new Blob())
                              : "",
                          }
                          if (setImage) {
                            setImage((prev) => [...prev, file_to_append])
                          }
                        }
                      }
                    } else {
                      if (files[0]) {
                        const file_to_append = {
                          name: files[0]?.name ?? "",
                          size: files[0]?.size ?? 0,
                          //file fall back if null
                          file: files[0]
                            ? URL.createObjectURL(files[0] ?? new Blob())
                            : "",
                        }
                        if (setImage) {
                          setImage([file_to_append])
                        }
                      }
                    }
                  } else {
                    //file reader
                    const reader = new FileReader()

                    reader.onload = async (evt: any) => {
                      const bstr = evt.target.result
                      const wb = XLSX.read(bstr, { type: "binary" })
                      //strictly one worksheet should be found
                      if (wb.SheetNames.length === 1) {
                        const wsname = wb.SheetNames.toString()

                        const ws = wb.Sheets[wsname]
                        if (ws) {
                          const raw_data = XLSX.utils.sheet_to_json(ws, {
                            header: 1,
                            defval: null,
                          })
                          console.log("RAW:", raw_data)
                          raw_data.shift()

                          const data = raw_data
                          // do something here
                          // const headers = data.shift()

                          parseAssetsData(data)
                          setImportedData(true)
                        }
                      } else {
                        console.log("Contains too many sheets")
                      }
                    }

                    reader.readAsBinaryString(files[0] as Blob)
                  }
                  setTimeout(function () {
                    setIsLoading(false)
                  }, 2000)
                }}
                loading={loading}
                onReject={(files) => console.log("rejected files", files)}
                accept={
                  file_type === "image" ? IMAGE_MIME_TYPE : MS_EXCEL_MIME_TYPE
                }
              >
                <Group
                  position="center"
                  spacing="xl"
                  style={{ minHeight: 135, pointerEvents: "none" }}
                  className=""
                >
                  <div className="flex flex-col">
                    <Dropzone.Accept>
                      <IconUpload
                        size={50}
                        stroke={1.5}
                        color={"green"}
                        className="self-center"
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        size={50}
                        stroke={1.5}
                        color={"red"}
                        className="self-center"
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      {file_type === "image" && (
                        <Image
                          src="/UploadIcon.svg"
                          alt="An SVG of an eye"
                          height={50}
                          width={50}
                          className="self-center"
                        />
                      )}
                    </Dropzone.Idle>

                    <Text size="lg" className="text-center" inline>
                      Drag and drop{" "}
                      <span className="text-orange-400">
                        {file_type === "image" ? "images" : "files"}
                      </span>
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      or{" "}
                      <span className="text-orange-400 underline">browse</span>{" "}
                      on your computer.
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  className="px-4 py-2 font-medium underline"
                  onClick={() => onDiscard()}
                >
                  Cancel Import
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-4 py-2">
              <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
                <i className="fa-regular fa-circle-exclamation" />
                <p>
                  All records are new and does not exists in the current
                  database.
                </p>
              </div>

              <AssetRecordsAccordion incomingChanges={duplicatedAssets} />

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  className="px-4 py-2 font-medium underline"
                  onClick={() => onDiscard()}
                >
                  Discard Changes
                </button>
                <button
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={onSubmitUpdate}
                  disabled={assetLoading}
                >
                  {assetLoading ? "Loading..." : "Accept Import"}
                  {/* Accept All Changes */}
                </button>
              </div>

              {/* <pre>{JSON.stringify(duplicates, null, 2)}</pre> */}
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2 px-4 py-2">
            <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
              <i className="fa-regular fa-circle-exclamation" />
              <p>
                Our database has found existing records, please resolve record
                conflicts before proceeding.
              </p>
            </div>
            {duplicates != null ? (
              <DuplicateAccordion_asset
                currentRecords={duplicates?.sort(
                  (a: { id: number }, b: { id: number }) => a.id - b.id
                )}
                incomingChanges={duplicatedAssets}

              />
            ) : (
              <></>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 font-medium underline"
                onClick={() => onDiscard()}
              >
                Discard Changes
              </button>
              <button
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={onSubmitUpdate}
                disabled={assetLoading}
              >
                {assetLoading ? "Loading..." : "Accept All Changes"}
                {/* Accept All Changes */}
              </button>
            </div>

            {/* <pre>{JSON.stringify(duplicates, null, 2)}</pre> */}
          </div>
        )
      ) : (
        <>
          <Dropzone
            onDrop={(files) => {
              setIsLoading(true)

              if (file_type === "image") {
                if (acceptingMany) {
                  for (let i = 0; i < files.length; i++) {
                    if (files[i]) {
                      const file_to_append = {
                        name: files[i]?.name ?? "",
                        size: files[i]?.size ?? 0,
                        //file fall back if null
                        file: files[i]
                          ? URL.createObjectURL(files[i] ?? new Blob())
                          : "",
                      }
                      if (setImage) {
                        setImage((prev) => [...prev, file_to_append])
                      }
                    }
                  }
                } else {
                  if (files[0]) {
                    const file_to_append = {
                      name: files[0]?.name ?? "",
                      size: files[0]?.size ?? 0,
                      //file fall back if null
                      file: files[0]
                        ? URL.createObjectURL(files[0] ?? new Blob())
                        : "",
                    }
                    if (setImage) {
                      setImage([file_to_append])
                    }
                  }
                }
              } else {
                //file reader
                const reader = new FileReader()

                reader.onload = async (evt: any) => {
                  const bstr = evt.target.result
                  const wb = XLSX.read(bstr, { type: "binary" })
                  //strictly one worksheet should be found
                  if (wb.SheetNames.length === 1) {
                    const wsname = wb.SheetNames.toString()

                    const ws = wb.Sheets[wsname]
                    if (ws) {
                      const raw_data = XLSX.utils.sheet_to_json(ws, {
                        header: 1,
                        defval: null,
                      })
                      console.log("RAW:", raw_data)
                      raw_data.shift()

                      const data = raw_data
                      // do something here
                      // const headers = data.shift()

                      parseAssetsData(data)
                      setImportedData(true)
                    }
                  } else {
                    console.log("Contains too many sheets")
                  }
                }

                reader.readAsBinaryString(files[0] as Blob)
              }
              setTimeout(function () {
                setIsLoading(false)
              }, 2000)
            }}
            loading={loading}
            onReject={(files) => console.log("rejected files", files)}
            accept={
              file_type === "image" ? IMAGE_MIME_TYPE : MS_EXCEL_MIME_TYPE
            }
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 135, pointerEvents: "none" }}
              className=""
            >
              <div className="flex flex-col">
                <Dropzone.Accept>
                  <IconUpload
                    size={50}
                    stroke={1.5}
                    color={"green"}
                    className="self-center"
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={50}
                    stroke={1.5}
                    color={"red"}
                    className="self-center"
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  {file_type === "image" && (
                    <Image
                      src="/UploadIcon.svg"
                      alt="An SVG of an eye"
                      height={50}
                      width={50}
                      className="self-center"
                    />
                  )}
                </Dropzone.Idle>

                <Text size="lg" className="text-center" inline>
                  Drag and drop{" "}
                  <span className="text-orange-400">
                    {file_type === "image" ? "images" : "files"}
                  </span>
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  or <span className="text-orange-400 underline">browse</span>{" "}
                  on your computer.
                </Text>
              </div>
            </Group>
          </Dropzone>

        </>
      )}
      <DropZoneModal
        closeModal={closeModal}
        setCloseModal={setCloseModal}
        setIsVisible={setIsVisible}
      ></DropZoneModal>
    </div>
  )
}
