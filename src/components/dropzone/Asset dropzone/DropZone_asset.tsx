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
import { trpc } from "../../../utils/trpc"
import DuplicateAccordion_asset from "../../atoms/accordions/DuplicateAccordion_asset"

import { z } from "zod"
import { DropZoneModal } from "../DropZoneModal"
import { AssetTransformInput } from "../../../server/schemas/asset"
import { ExcelAssetCheckerType } from "../../../types/asset"
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
  // const [idList, setIdList] = useState<string[]>([])
  const [importedData, setImportedData] = useState(false)
  // const { data: duplicates, isLoading: tableLoading } =
  //   trpc.asset.checkTableDuplicates.useQuery(idList)
  const [assetId, setAssetId] = useState<string>(
    `-${moment().format("YYMDhms")}`
  )
  const [error, setError] = useState<string | null>(null)
  const [duplicatedAssets, setDuplicatedAssets] = useState<
    ExcelAssetCheckerType[]
  >([])

  const utils = trpc.useContext()

  const { mutateAsync, isLoading: assetLoading } =
    trpc.asset.createOrUpdate.useMutation({
      onSuccess(rest: any) {
        utils.asset.findAll.invalidate()

        // invalidate query of asset id when mutations is successful
      },
      onError() {
        console.log("TRY: " + error)
      },
    })

  const parseAssetsData = async (data: (string | number)[][]) => {
    //returns all id of parsed assets
    setIsLoading(true)

    const checker = data.some((asset) => asset.length !== 8)
    if (checker) {
      setError(
        "An entry does not match the number of columns. Please check the template and try again."
      )
      setIsLoading(false)

      return
    }
    //filters duplicated ID

    const dupAssetList = data

    function excelSerialDateToJSDate(serialDate: number) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000
      const epoch = new Date("1899-12-31")

      const offset = (serialDate - 1) * millisecondsPerDay
      const jsDate = new Date(epoch.getTime() + offset)
      jsDate.setUTCHours(jsDate.getUTCHours() - 8)

      return jsDate
    }

    const final_dupList = [] as ExcelAssetCheckerType[]

    const parseId = (id: string | null) => {
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
        name: ((ast as (string | null)[])[0] as string).toString(),
        serial_no: ((ast as (string | null)[])[1] as string).toString(),
        brand: ((ast as (string | null)[])[2] as string).toString(),
        type: ((ast as (string | null)[])[3] as string).toString(),
        caliber: ((ast as (null | string)[])[4] as string).toString(),
        models: ((ast as (null | string)[])[5] as string).toString(),
        action_type: ((ast as (null | string)[])[6] as string).toString(),
        description: ((ast as (null | string)[])[7] as string).toString(),
      } as ExcelAssetCheckerType
      final_dupList.push(data_structure)
    })

    console.log(final_dupList)

    setDuplicatedAssets(final_dupList)
  }

  useEffect(() => {
    if (duplicatedAssets.length > 0) setIsLoading(false)
  }, [duplicatedAssets])

  const checkDuplicated = () => {
    for (let x = 0; x <= duplicatedAssets.length; x++) {
      if (
        duplicatedAssets[x]?.asset_number == undefined ||
        duplicatedAssets[x]?.asset_number == null
      ) {
        duplicatedAssets.splice(x, 1)
      }
    }
  }

  const onDiscard = () => {
    setIsVisible(false)
  }

  const onSubmitUpdate = async () => {
    try {
      for (const asset of duplicatedAssets) {
        await mutateAsync({
          name: asset?.name ?? "",
          serial_no: asset?.serial_no ?? "",
          brand: asset?.brand ?? "",
          type: asset?.type ?? "",
          caliber: asset?.caliber ?? "",
          models: asset?.models ?? "",
          action_type: asset?.action_type ?? "",
          description: asset?.description ?? "",
        })
      }
      setCloseModal(true)
    } catch (error) {
      console.error("Error updating asset:", error)
    }
  }
  // checkDuplicated()
  return (
    <div>
      {/* {"DUPLICATES: " + duplicates?.length} */}
      {importedData ? (
        duplicatedAssets.length == 0 ||
        duplicatedAssets == null ||
        duplicatedAssets == undefined ? (
          <div className="flex flex-col gap-2 px-4 py-2">
            <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
              <i className="fa-regular fa-circle-exclamation" />
              {error ? (
                <p>{error}</p>
              ) : (
                <p>Imported EXCEL file is empty, please try again. </p>
              )}
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
                        raw_data.shift()

                        const data = raw_data
                        // do something here
                        // const headers = data.shift()
                        // setIdList([])
                        setDuplicatedAssets([])
                        parseAssetsData(data as (string | number)[][])
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
                }, 200)
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
            {/* <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
              <i className="fa-regular fa-circle-exclamation" />
              <p>
                  All records are new and does not exists in the current
                  database.
                </p>
            </div> */}

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
        // ) : (
        //   <div className="flex flex-col gap-2 px-4 py-2">
        //     <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
        //       <i className="fa-regular fa-circle-exclamation" />
        //       <p>
        //         Our database has found existing records, please resolve record
        //         conflicts before proceeding.
        //       </p>
        //     </div>
        //     {duplicates != null ? (
        //       <DuplicateAccordion_asset
        //         currentRecords={duplicates?.sort(
        //           (a: { id: number }, b: { id: number }) => a.id - b.id
        //         )}
        //         incomingChanges={duplicatedAssets}
        //       />
        //     ) : (
        //       <></>
        //     )}
        //     <div className="mt-4 flex items-center justify-end gap-2">
        //       <button
        //         className="px-4 py-2 font-medium underline"
        //         onClick={() => onDiscard()}
        //       >
        //         Discard Changes
        //       </button>
        //       <button
        //         className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
        //         onClick={onSubmitUpdate}
        //         disabled={assetLoading}
        //       >
        //         {assetLoading ? "Loading..." : "Accept All Changes"}
        //         {/* Accept All Changes */}
        //       </button>
        //     </div>

        //     {/* <pre>{JSON.stringify(duplicates, null, 2)}</pre> */}
        //   </div>
        // )
        <div className="flex flex-col gap-2">
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
                      raw_data.shift()

                      const data = raw_data
                      // do something here
                      // const headers = data.shift()

                      parseAssetsData(data as (string | number)[][])
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
        </div>
      )}
      <DropZoneModal
        closeModal={closeModal}
        setCloseModal={setCloseModal}
        setIsVisible={setIsVisible}
      ></DropZoneModal>
    </div>
  )
}
