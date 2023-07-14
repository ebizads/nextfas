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
import { ExcelExportType } from "../../types/employee"
import { trpc } from "../../utils/trpc"
import DuplicateAccordion from "../atoms/accordions/DuplicateAccordion"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../server/db/client"
import { EmployeeEditInput } from "../../server/schemas/employee"
import { z } from "zod"
import EmployeeRecordsAccordion from "../atoms/accordions/EmployeeRecordsAccordion"
import Employee from "../../pages/employees"
import Modal from "../headless/modal/modal"
import { DropZoneModal } from "./DropZoneModal"
import moment from "moment"
import { env } from "../../env/client.mjs"
import { EmployeeType } from "../../types/generic"

export type Employee = z.infer<typeof EmployeeEditInput>
export default function DropZone({
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
  const [employeeRandomizer, setEmployeeRandomizer] = useState<string>("000001")
  const [lastNumber, setLastNumber] = useState<string>()
  const [importedData, setImportedData] = useState(false)
  const [checker, setChecker] = useState<string>("0000")
  const { data: allEmp } = trpc.employee.findAllNoLimit.useQuery()
  const { data: checkUnique } = trpc.employee.checkUnique.useQuery(checker)
  const { data: duplicates } = trpc.employee.checkDuplicates.useQuery(idList)
  const [duplicatedEmployees, setDuplicatedEmployees] = useState<
    ExcelExportType[]
  >([])
  const utils = trpc.useContext()

  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.createOrUpdate.useMutation({
    onSuccess(profile) {
      setCloseModal(true)
      // console.log("sample: ", profile)
      console.log("omsiman")
      utils.asset.findAll.invalidate()
      // invalidate query of asset id when mutations is successful
    },
    onError() {
      console.log(JSON.stringify(error))
    }
  })



  const parseEmployeesData = (data: unknown[]) => {
    //returns all id of parsed employees
    const id_list = data.map((employee) => {
      return Number((employee as number[])[0] as number)
    }) as number[]


    if (id_list) {
      setIdList(id_list)
      console.log("idlist:", duplicates)
    }
    //filters duplicated ID

    const dupEmployeeList = data.filter((employee) => {

      return id_list.includes(
        employee ? Number((employee as number[])[0] as number) : 0
      )
    }) as any[]

    function excelSerialDateToJSDate(serialDate: number) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const epoch = new Date('1899-12-31'); // Excel epoch (1900-01-01 in Excel is 1 as the serial date)

      const offset = (serialDate - 1) * millisecondsPerDay; // Subtracting 1 to account for the Excel epoch
      const jsDate = new Date(epoch.getTime() + offset);
      jsDate.setUTCHours(jsDate.getUTCHours() - 8);

      return jsDate;
    }

    const final_dupList = [] as ExcelExportType[]
    dupEmployeeList.forEach((emp) => {

      const data_structure = {
        id: (emp as (string | number | null)[])[0] as number,
        name: (emp as (string | number | null)[])[1] as string,
        position: (emp as (string | number | null)[])[2] as string,
        employee_id: (emp as (string | number | null)[])[3] as string,
        email: (emp as (string | number | null)[])[4] as string,
        teamId: (emp as (number | null)[])[5] as number,
        superviseeId: (emp as (number | null)[])[6] as number,
        createdAt: (emp[7] ? new Date(excelSerialDateToJSDate((emp as (string | number | null | boolean)[])[7] as number)) : null),
        updatedAt: (emp[8] ? new Date(excelSerialDateToJSDate((emp as (string | number | null | boolean)[])[8] as number)) : null),
        deleted: (emp as (string | number | null | boolean)[])[9] as boolean,
        deletedAt: (emp[10] ? new Date(excelSerialDateToJSDate((emp as (string | number | null | boolean)[])[10] as number)) : null),
        workMode: (emp as (string | null)[])[11] as string,
        workStation: (emp as (string | null)[])[12] as string,
        address: {
          id: (emp as (string | number | null)[])[14] as number,
          street: (emp as (string | number | null)[])[15] as string,
          city: (emp as (string | number | null)[])[16] as string,
          state: (emp as (string | number | null)[])[17] as string,
          country: (emp as (string | number | null)[])[18] as string,
          createdAt:
            (emp[24] ? new Date(excelSerialDateToJSDate((emp as (string | number | null | boolean)[])[24] as number)) : null),
          updatedAt:
            (emp[25] ? new Date(excelSerialDateToJSDate((emp as (string | number | null | boolean)[])[25] as number)) : null),
          //may laktaw po ito
          deleted: (emp as (string | number | null | boolean)[])[26] as boolean,
          deletedAt: (emp[28] ? new Date(excelSerialDateToJSDate((emp as (string | number | null | boolean)[])[27] as number)) : null),
          userId: (emp as (string | number | null)[])[19] as number,
          companyId: (emp as (number | string | null)[])[20] as number,
          vendorId: (emp as (string | number | null)[])[21] as number,
          employeeId: (emp as (string | number | null)[])[22] as number,
          zip: (emp as (string | number | null)[])[23] as number,

        },
        profile: {
          id: (emp as (string | number | null)[])[28] as number,
          first_name: (emp as (string | number)[])[29] as string,
          middle_name: (emp as (string | number | null)[])[30] as string,
          last_name: (emp as (string | number)[])[31] as string,
          suffix: (emp as (string | number | null)[])[32] as string,
          gender: (emp as (string | number | null)[])[33] as string,
          image: (emp as (string | number | null)[])[34] as string,
          date_of_birth: new Date(Math.round(((emp as (string | number | null | boolean)[])[35] as number - 25569) * 86400 * 1000)),
          userId: (emp as (string | number | null)[])[38] as number,
          employeeId: (emp as (string | number | null)[])[37] as number,
          phone_no: (emp as (string | number | null)[])[36] as string,
        },
      } as ExcelExportType
      console.log("checker: " + emp)
      console.log(data_structure)
      final_dupList.push(data_structure)
    })

    setDuplicatedEmployees(
      final_dupList.sort((a, b) => {
        // console.log(final_dupList)
        console.log("sort" + ((a.id ?? 0) - (b.id ?? 0)))
        return (a.id ?? 0) - (b.id ?? 0)
      })
    )
    // setDuplicatedEmployees(dupEmployees)
    // console.log(dupEmployees)

  }


  const checkDuplicated = async () => {
    for (let x = 0; x <= duplicatedEmployees.length; x++) {
      if (
        duplicatedEmployees[x]?.id == 0 ||
        duplicatedEmployees[x]?.id == null
      ) {

        duplicatedEmployees.splice(x, 1)
      }

    }
  }

  const onDiscard = () => {
    setIsVisible(false)
  }

  function generateEmployeeId(length: number, employee: EmployeeType[]) {
    const numberArray: string[] = []
    for (let x = 0, y = 0; x <= (allEmp?.employees ? allEmp?.employees?.length : 0) + 1;) {
      if ((employee.some((item) => item?.employee_id?.includes(String(x + 1).padStart(4, '0')))) || (numberArray?.includes(String(x + 1).padStart(4, '0')))) {
        x++
      } else {
        numberArray.push(String(x + 1).padStart(4, '0'))
        x = 0
        y++
      }
      if (y >= length) {
        break;
      }


    }
    console.log("Chk: " + JSON.stringify(numberArray))

    return numberArray

  }

  useEffect(() => {
    setChecker(employeeRandomizer);
  }, [employeeRandomizer])

  const OnSubmitUpdate = async () => {
    // Register function
    const employeesAll: EmployeeType[] = allEmp?.employees as EmployeeType[];
    const employeeId: string[] = generateEmployeeId(duplicatedEmployees.length, employeesAll)
    // setChecker(employeeRandomizer)
    for (let i = 0; i < duplicatedEmployees.length; i++) {


      mutate({
        id: duplicatedEmployees[i]?.id ?? 0,
        name: duplicatedEmployees[i]?.name ?? "",
        position: duplicatedEmployees[i]?.position,
        employee_id: String(duplicatedEmployees[i]?.teamId) + employeeId[i],
        email: duplicatedEmployees[i]?.email,
        teamId: duplicatedEmployees[i]?.teamId ?? 0,
        superviseeId: duplicatedEmployees[i]?.superviseeId ?? null,
        // createdAt: duplicatedEmployees[i]?.createdAt,
        // updatedAt: duplicatedEmployees[i]?.updatedAt?,
        deleted: duplicatedEmployees[i]?.deleted ?? false,
        deletedAt: duplicatedEmployees[i]?.deletedAt,
        workMode: duplicatedEmployees[i]?.workMode,
        workStation: duplicatedEmployees[i]?.workStation,
        address: {
          // id: duplicatedEmployees[i]?.address?.id ?? 0,
          street: duplicatedEmployees[i]?.address?.street,
          city: duplicatedEmployees[i]?.address?.city,
          state: duplicatedEmployees[i]?.address?.state,
          zip: duplicatedEmployees[i]?.address?.zip,
          country: duplicatedEmployees[i]?.address?.country,
          // createdAt: duplicatedEmployees[i]?.address?.createdAt,
          // updatedAt: duplicatedEmployees[i]?.address?.updatedAt,
          //may laktaw po ito
          // deleted: duplicatedEmployees[i]?.address?.deleted,
          // deletedAt: duplicatedEmployees[i]?.address?.deletedAt,
          // userId: duplicatedEmployees[i]?.address?.userId ?? 0,
          // companyId: duplicatedEmployees[i]?.address?.companyId,
          // vendorId: duplicatedEmployees[i]?.address?.vendorId,
          // employeeId: duplicatedEmployees[i]?.address?.employeeId,
        },
        profile: {
          // id: duplicatedEmployees[i]?.profile?.id,
          first_name: duplicatedEmployees[i]?.profile?.first_name ?? "",
          middle_name: duplicatedEmployees[i]?.profile?.middle_name,
          last_name: duplicatedEmployees[i]?.profile?.last_name ?? "",
          suffix: duplicatedEmployees[i]?.profile?.suffix,
          gender: duplicatedEmployees[i]?.profile?.gender,
          image: duplicatedEmployees[i]?.profile?.image,
          date_of_birth: duplicatedEmployees[i]?.profile?.date_of_birth,
          // userId: duplicatedEmployees[i]?.profile?.userId,
          // employeeId: duplicatedEmployees[i]?.profile?.employeeId,
          phone_no: duplicatedEmployees[i]?.profile?.phone_no,
        },
      });

    }
  }
  checkDuplicated()
  return (
    <div>
      {/* {"DUPLICATES: " + JSON.stringify(duplicates)} */}
      {importedData ? (
        duplicates?.length === 0 ||
          duplicates === null ||
          duplicates === undefined ||
          duplicates[0]?.id === 0 ? (
          duplicatedEmployees.length === 0 ||
            duplicatedEmployees === null ||
            duplicatedEmployees === undefined ? (
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

                          parseEmployeesData(data)
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

              <EmployeeRecordsAccordion incomingChanges={duplicatedEmployees} />

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  className="px-4 py-2 font-medium underline"
                  onClick={() => onDiscard()}
                >
                  Discard Changes
                </button>
                <button
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={OnSubmitUpdate}
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
                incomingChanges={duplicatedEmployees}

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
                onClick={OnSubmitUpdate}
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

                      parseEmployeesData(data)
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
