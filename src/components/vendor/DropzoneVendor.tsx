import React, { useEffect, useState } from "react"
import { Group, Text } from "@mantine/core"
import { IconUpload, IconX } from "@tabler/icons"
import {
    Dropzone,
    IMAGE_MIME_TYPE,
    MS_EXCEL_MIME_TYPE,
} from "@mantine/dropzone"
import { ImageJSON } from "../../types/table"
import Image from "next/image"
import * as XLSX from "xlsx"
import { trpc } from "../../utils/trpc"
import DuplicateAccordion from "../atoms/accordions/DuplicateAccordion"
import { update } from "lodash"
import { EmployeeEditInput } from "../../server/schemas/employee"
import { z } from "zod"
import EmployeeRecordsAccordion from "../atoms/accordions/EmployeeRecordsAccordion"
import Employee from "../../pages/employees"
import Modal from "../headless/modal/modal"
import { DropZoneModal } from "../dropzone/DropZoneModal"
import { VendorEditInput } from "../../server/schemas/vendor"
import { ExcelExportTypeVendor } from "../../types/vendors"
import VendorRecordsAccordion from "../atoms/accordions/VendorRecordsAccordion"
import DuplicateAccordionVendor from "../atoms/accordions/DuplicateAccordionVendor"

export type Vendor = z.infer<typeof VendorEditInput>
export default function DropzoneVendor({
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
    const [idList, setIdList] = useState<number[]>([])
    const [importedData, setImportedData] = useState(false)
    const { data: duplicates } = trpc.vendor.checkDuplicates.useQuery(idList)
    const [duplicatedVendors, setDuplicatedVendors] = useState<
        ExcelExportTypeVendor[]
    >([])

    const {
        mutate,
        isLoading: vendorLoading,
        error,
    } = trpc.vendor.createOrUpdate.useMutation({
        onSuccess() {
            setCloseModal(true)
            console.log("omsiman")

            // invalidate query of asset id when mutations is successful
        },
    })



    const parseVendorData = (data: unknown[]) => {
        //returns all id of parsed vendors
        const id_list = data.map((vendor) => {
            return Number((vendor as number[])[0] as number)
        }) as number[]

        if (id_list) {
            setIdList(id_list)
        }

        //filters duplicated ID

        function excelSerialDateToJSDate(serialDate: number) {
            const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
            const epoch = new Date('1899-12-31'); // Excel epoch (1900-01-01 in Excel is 1 as the serial date)

            const offset = (serialDate - 1) * millisecondsPerDay; // Subtracting 1 to account for the Excel epoch
            const jsDate = new Date(epoch.getTime() + offset);
            jsDate.setUTCHours(jsDate.getUTCHours() - 8);

            return jsDate;
        }

        const dupVendorList = data.filter((vendor) => {

            return id_list.includes(
                vendor ? Number((vendor as number[])[0] as number) : 0
            )
        }) as any[]

        const final_dupList = [] as ExcelExportTypeVendor[]
        dupVendorList.forEach((ven) => {
            const data_structure = {
                id: (ven as (string | number | null)[])[0] as number,
                name: (ven as (string | number | null)[])[1] as string,
                phone_no: (ven as (string | number | null)[])[2] as string,
                email: (ven as (string | number | null)[])[3] as string,
                website: (ven as (string | number | null)[])[4] as string,
                remarks: (ven as (string | number | null)[])[5] as string,
                image: (ven as (string | number | null)[])[6] as string,
                fax_no: (ven as (string | number | null)[])[7] as string,
                type: (ven as (string | number | null)[])[8] as string,
                createdAt: (ven[9] ? new Date(excelSerialDateToJSDate((ven as (string | number | null | boolean)[])[9] as number)) : null),
                updatedAt: (ven[10] ? new Date(excelSerialDateToJSDate((ven as (string | number | null | boolean)[])[10] as number)) : null),
                deletedAt: (ven[11] ? new Date(excelSerialDateToJSDate((ven as (string | number | null | boolean)[])[11] as number)) : null),
                deleted: (ven as (string | number | null | boolean)[])[12] as boolean,
                address: {
                    id: (ven as (string | number | null)[])[13] as number,
                    street: (ven as (string | number | null)[])[14] as string,
                    city: (ven as (string | number | null)[])[15] as string,
                    state: (ven as (string | number | null)[])[16] as string,
                    country: (ven as (string | number | null)[])[17] as string,
                    createdAt: (ven[23] ? new Date(excelSerialDateToJSDate((ven as (string | number | null | boolean)[])[23] as number)) : null),
                    updatedAt: (ven[24] ? new Date(excelSerialDateToJSDate((ven as (string | number | null | boolean)[])[24] as number)) : null),
                    //may laktaw po ito
                    deleted: (ven as (string | number | null | boolean)[])[25] as boolean,
                    deletedAt: (ven[26] ? new Date(excelSerialDateToJSDate((ven as (string | number | null | boolean)[])[26] as number)) : null),
                    userId: (ven as (string | number | null)[])[18] as number,
                    companyId: (ven as (number | string | null)[])[19] as number,
                    vendorId: (ven as (string | number | null)[])[20] as number,
                    employeeId: (ven as (string | number | null)[])[21] as number,
                    zip: (ven as (string | number | null)[])[22] as number,
                },
            } as unknown as ExcelExportTypeVendor
            final_dupList.push(data_structure)
        })

        setDuplicatedVendors(
            final_dupList.sort((a, b) => {
                // console.log("TEST: " + JSON.stringify(final_dupList))
                console.log("sort" + ((a?.id ?? 0) - (b?.id ?? 0)))
                return (a?.id ?? 0) - (b?.id ?? 0)
            })
        )

        // setDuplicatedVendors(dupEmployees)
        // console.log(dupEmployees)
    }


    const checkDuplicated = () => {
        for (let x = 0; x <= duplicatedVendors.length; x++) {
            if (
                duplicatedVendors[x]?.id == 0 ||
                duplicatedVendors[x]?.id == null
            ) {
                console.log("SPLICE" + duplicatedVendors[x]?.id)

                duplicatedVendors.splice(x, 1)
            }
        }
    }

    const onDiscard = () => {
        setIsVisible(false)
    }

    const onSubmitUpdate = () => {
        // Register function
        try {
            for (let i = 0; i < duplicatedVendors.length; i++) {
                mutate({
                    id: duplicatedVendors[i]?.id ?? 0,
                    name: duplicatedVendors[i]?.name ?? "",
                    phone_no: duplicatedVendors[i]?.phone_no ?? [("")],
                    email: duplicatedVendors[i]?.email,
                    website: duplicatedVendors[i]?.website ?? "",
                    remarks: duplicatedVendors[i]?.remarks ?? "",
                    fax_no: duplicatedVendors[i]?.fax_no ?? "",
                    type: duplicatedVendors[i]?.type ?? "",
                    // createdAt: duplicatedVendors[i]?.createdAt,
                    // updatedAt: duplicatedVendors[i]?.updatedAt,
                    // deleted: duplicatedVendors[i]?.deleted,
                    // deletedAt: duplicatedVendors[i]?.deletedAt,
                    address: {
                        // id: duplicatedVendors[i]?.address?.id ?? 0,
                        street: duplicatedVendors[i]?.address?.street,
                        city: duplicatedVendors[i]?.address?.city,
                        state: duplicatedVendors[i]?.address?.state,
                        zip: duplicatedVendors[i]?.address?.zip,
                        country: duplicatedVendors[i]?.address?.country,
                        // createdAt: duplicatedVendors[i]?.address?.createdAt,
                        // updatedAt: duplicatedVendors[i]?.address?.updatedAt,
                        //may laktaw po ito
                        // deleted: duplicatedVendors[i]?.address?.deleted,
                        // deletedAt: duplicatedVendors[i]?.address?.deletedAt,
                        // userId: duplicatedVendors[i]?.address?.userId ?? 0,
                        // companyId: duplicatedVendors[i]?.address?.companyId,
                        // vendorId: duplicatedVendors[i]?.address?.vendorId,
                        // employeeId: duplicatedVendors[i]?.address?.employeeId,
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
                    duplicatedVendors.length == 0 ||
                        duplicatedVendors == null ||
                        duplicatedVendors == undefined ? (
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

                                                    parseVendorData(data)
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

                            <VendorRecordsAccordion incomingChanges={duplicatedVendors} />

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
                                    disabled={vendorLoading}
                                >
                                    {vendorLoading ? "Loading..." : "Accept Import"}
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
                            <DuplicateAccordionVendor
                                currentRecords={duplicates?.sort(
                                    (a: { id: number }, b: { id: number }) => a.id - b.id
                                )}
                                incomingChanges={duplicatedVendors}

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
                                disabled={vendorLoading}
                            >
                                {vendorLoading ? "Loading..." : "Accept All Changes"}
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

                                            parseVendorData(data)
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
