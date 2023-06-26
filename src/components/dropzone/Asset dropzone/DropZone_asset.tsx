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
import DuplicateAccordion from "../../atoms/accordions/DuplicateAccordion"
import { update } from "lodash"
import { EmployeeEditInput } from "../../../server/schemas/employee"
import { z } from "zod"
import EmployeeRecordsAccordion from "../../atoms/accordions/EmployeeRecordsAccordion"
import Employee from "../../../pages/employees"
import Modal from "../../headless/modal/modal"
import { DropZoneModal } from "../DropZoneModal"
import { AssetEditInput } from "../../../server/schemas/asset"
import { ExcelExportAssetType } from "../../../types/asset"
import CreateAssetAccordion from "../../atoms/accordions/CreateAssetAccordion"

export type Asset = z.infer<typeof AssetEditInput>
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
    isLoading: employeeLoading,
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
        category: (ast as (string | number | null)[])[21] as number,

        invoiceNum: (ast as (string | number | null)[])[22] as number,
        purchaseOrder: (ast as (string | number | null)[])[23] as number,
        deployment_status: (ast as (string | null)[])[24] as string,
        parent: (ast as (string | null)[])[25] as string,
        custodian: (ast as (string | null)[])[26] as string,
        vendor: (ast as (string | null)[])[27] as string,
        addedBy: (ast as (string | null)[])[28] as string,
        address: {
          id: (ast as (string | number | null)[])[15] as number,
          street: (ast as (string | number | null)[])[16] as string,
          city: (ast as (string | number | null)[])[17] as string,
          state: (ast as (string | number | null)[])[18] as string,
          country: (ast as (string | number | null)[])[19] as string,
          createdAt: new Date(
            (ast as (string | number | null | boolean)[])[20] as string
          ) ?? null,
          updatedAt: new Date(
            (ast as (string | number | null | boolean)[])[26] as string
          ) ?? null,
          //may laktaw po ito
          deleted: (ast as (string | number | null | boolean)[])[25] as boolean,
          deletedAt: new Date(
            (ast as (string | number | null | boolean)[])[26] as string
          ),

          zip: (ast as (string | number | null)[])[24] as number,
        },
        profile: {
          id: (ast as (string | number | null)[])[27] as number,
          first_name: (ast as (string | number)[])[28] as string,
          middle_name: (ast as (string | number | null)[])[29] as string,
          last_name: (ast as (string | number)[])[30] as string,
          suffix: (ast as (string | number | null)[])[31] as string,
          gender: (ast as (string | number | null)[])[32] as string,
          image: (ast as (string | number | null)[])[33] as string,
          date_of_birth: new Date(
            (ast as (string | number | null | boolean)[])[34] as string
          ),
          userId: (ast as (string | number | null)[])[37] as number,
          astloyeeId: (ast as (string | number | null)[])[36] as number,
          phone_no: (ast as (string | number | null)[])[35] as string,
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
          hired_date: duplicatedAssets[i]?.hired_date,
          position: duplicatedAssets[i]?.position,
          employee_id: duplicatedAssets[i]?.employee_id,
          email: duplicatedAssets[i]?.email,
          teamId: duplicatedAssets[i]?.teamId ?? 0,
          superviseeId: duplicatedAssets[i]?.superviseeId ?? 0,
          // createdAt: duplicatedAssets[i]?.createdAt,
          // updatedAt: duplicatedAssets[i]?.updatedAt,
          // deleted: duplicatedAssets[i]?.deleted,
          // deletedAt: duplicatedAssets[i]?.deletedAt,
          workMode: duplicatedAssets[i]?.workMode,
          workStation: duplicatedAssets[i]?.workStation,
          address: {
            // id: duplicatedAssets[i]?.address?.id ?? 0,
            street: duplicatedAssets[i]?.address?.street,
            city: duplicatedAssets[i]?.address?.city,
            state: duplicatedAssets[i]?.address?.state,
            zip: duplicatedAssets[i]?.address?.zip,
            country: duplicatedAssets[i]?.address?.country,
            // createdAt: duplicatedAssets[i]?.address?.createdAt,
            // updatedAt: duplicatedAssets[i]?.address?.updatedAt,
            //may laktaw po ito
            // deleted: duplicatedAssets[i]?.address?.deleted,
            // deletedAt: duplicatedAssets[i]?.address?.deletedAt,
            // userId: duplicatedAssets[i]?.address?.userId ?? 0,
            // companyId: duplicatedAssets[i]?.address?.companyId,
            // vendorId: duplicatedAssets[i]?.address?.vendorId,
            // employeeId: duplicatedAssets[i]?.address?.employeeId,
          },
          profile: {
            // id: duplicatedAssets[i]?.profile?.id,
            first_name: duplicatedAssets[i]?.profile?.first_name ?? "",
            middle_name: duplicatedAssets[i]?.profile?.middle_name,
            last_name: duplicatedAssets[i]?.profile?.last_name ?? "",
            suffix: duplicatedAssets[i]?.profile?.suffix,
            gender: duplicatedAssets[i]?.profile?.gender,
            image: duplicatedAssets[i]?.profile?.image,
            date_of_birth: duplicatedAssets[i]?.profile?.date_of_birth,
            // userId: duplicatedAssets[i]?.profile?.userId,
            // employeeId: duplicatedAssets[i]?.profile?.employeeId,
            phone_no: duplicatedAssets[i]?.profile?.phone_no,
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

              <CreateAssetAccordion incomingChanges={duplicatedAssets} />

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
                  disabled={employeeLoading}
                >
                  {employeeLoading ? "Loading..." : "Accept Import"}
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
              <DuplicateAccordion
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
                disabled={employeeLoading}
              >
                {employeeLoading ? "Loading..." : "Accept All Changes"}
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
