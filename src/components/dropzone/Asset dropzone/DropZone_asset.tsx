import React, { useEffect, useState } from "react"
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
  const { data: duplicates } = trpc.asset.checkDuplicates.useQuery(idList)
  const [duplicatedAssets, setDuplicatedAssets] = useState<
    ExcelExportAssetType[]
  >([])

  const {
    mutate,
    isLoading: assetLoading,
    error,
  } = trpc.asset.createOrUpdate.useMutation({
    onSuccess() {
      setCloseModal(true)
      console.log("omsiman")

      // invalidate query of asset id when mutations is successful
    },
  })



  const parseAssetsData = (data: unknown[]) => {
    //returns all id of parsed employees
    const id_list = data.map((asset) => {
      return String((asset as string[])[4] as string)
    }) as string[]

    if (id_list) {
      setIdList(id_list)
    }

    //filters duplicated ID

    const dupAssetList = data.filter((asset) => {

      return id_list.includes(
        asset ? String((asset as string[])[4] as string) : ""
      )
    }) as any[]

    const final_dupList = [] as ExcelExportAssetType[]
    dupAssetList.forEach((ast) => {
      const data_structure = {
        id: (ast as (string | number | null)[])[0] as number,
        name: (ast as (string | number | null)[])[1] as string,
        number: (ast as (string | number | null)[])[2] as string,
        alt_number: (ast as (string | number | null)[])[3] as string,
        ser_number: (ast as (string | number | null)[])[4] as string,
        barcode: (ast as (string | number | null)[])[5] as string,
        desc: (ast as (number | null | string)[])[6] as string,
        remarks: (ast as (number | null | string)[])[7] as string,
        parentId: (ast as (string | number | null)[])[8] as number,
        modelId: (ast as (number | string | null)[])[9] as number,
        custodianId: (ast as (string | number | null)[])[10] as number,
        vendorId: (ast as (string | number | null)[])[11] as number,
        assetProjId: (ast as (string | number | null)[])[12] as number,
        createdAt: new Date((ast as (string | number | null)[])[13] as string),
        updatedAt: new Date((ast as (string | number | null)[])[14] as string),
        deletedAt: new Date(
          (ast as (string | number | null | boolean)[])[15] as string
        ),
        deleted: (ast as (string | number | null | boolean)[])[16] as boolean,
        deptId: (ast as (string | number | null)[])[17] as number,
        subsidId: (ast as (string | number | null)[])[18] as number,
        addedById: (ast as (string | number | null)[])[19] as number,
        status: (ast as (string | null)[])[20] as string,
        user_archiveID: (ast as (string | number | null)[])[21] as number,
        category: (ast as (string | number | null)[])[22] as number,
        invoiceNum: (ast as (string | number | null)[])[23] as number,
        purchaseOrder: (ast as (string | number | null)[])[24] as number,
        deployment_status: (ast as (string | null)[])[25] as string,
        parent: (ast as (string | null)[])[26] as string,
        custodian: (ast as (string | null)[])[27] as string,
        vendor: (ast as (string | null)[])[28] as string,
        addedBy: (ast as (string | null)[])[29] as string,
        management: {
          currency: (ast as (string | null)[])[30] as string,
          original_cost: (ast as (string | number | null)[])[31] as number,
          current_cost: (ast as (string | number | null)[])[32] as number,
          residual_value: (ast as (string | number | null)[])[33] as number,
          purchase_date: (ast as (string | null)[])[34] as string,
          depreciation_start: (ast as (string | null)[])[35] as string,
          depreciation_end: (ast as (string | null)[])[36] as string,
          depreciation_status: (ast as (string | null)[])[7] as string,
          depreciation_period: (ast as (string | null)[])[38] as string,
          depreciation_rule: (ast as (string | null)[])[39] as string,
          assetId: (ast as (string | null)[])[40] as string,
          accounting_method: (ast as (string | null)[])[41] as string,
          depreciation_lifetime: (ast as (string | number | null)[])[42] as number,
          residual_percentage: (ast as (string | number | null)[])[43] as number,
          asset_location: (ast as (string | null)[])[44] as string,
          asset_quantity: (ast as (string | number | null)[])[45] as number,
          asset_lifetime: (ast as (string | number | null)[])[46] as number,
        },
        model: {
          model_name: (ast as (string | null)[])[47] as string,
          model_no: (ast as (string | null)[])[48] as string,
          model_brand: (ast as (string | null)[])[49] as string,
          model_classID: (ast as (string | number | null)[])[50] as number,
          model_categoryID: (ast as (string | number | null)[])[51] as number,
          model_typeID: (ast as (string | number | null)[])[52] as number
        },
      } as unknown as ExcelExportAssetType
      final_dupList.push(data_structure)
    })

    setDuplicatedAssets(
      final_dupList.sort((a, b) => {
        // console.log(final_dupList)
        console.log("sort" + ((a.id ?? 0) - (b.id ?? 0)))
        return (a.id ?? 0) - (b.id ?? 0)
      })
    )

    // setduplicatedAssets(dupEmployees)
    // console.log(dupEmployees)
  }
  // const updateDate = duplicatedAssets.map((row) => {
  //   const {id, name, hired_date, position, employee_id,}
  // })

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
          // createdAt: duplicatedAssets[i]?.id ?? 0,
          // updatedAt: duplicatedAssets[i]?.id ?? 0,
          // deletedAt: duplicatedAssets[i]?.id ?? 0,
          // deleted: duplicatedAssets[i]?.id ?? 0,
          departmentId: duplicatedAssets[i]?.departmentId ?? 0,
          subsidiaryId: duplicatedAssets[i]?.subsidiaryId ?? 0,
          // user: duplicatedAssets[i]?.id ?? 0,
          // : duplicatedAssets[i]?.id ?? 0,
          // cus: duplicatedAssets[i]?.id ?? 0,
          // ven: duplicatedAssets[i]?.id ?? 0,
          // added
          // : duplicatedAssets[i]?.id ?? 0,
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
            name: duplicatedAssets[i]?.model?.name ?? "",
            number: duplicatedAssets[i]?.model?.number ?? "",
            brand: duplicatedAssets[i]?.model?.brand ?? "",
            classId: duplicatedAssets[i]?.model?.classId ?? 0,
            categoryId: duplicatedAssets[i]?.model?.categoryId ?? 0,
            typeId: duplicatedAssets[i]?.model?.typeId ?? 0,
            id: duplicatedAssets[i]?.model?.id ?? 0
          },
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
                  onClick={() => onSubmitUpdate}
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
