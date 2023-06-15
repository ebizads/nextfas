import React, { useState } from "react"
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

export default function DropZone({
  setImage,
  loading,
  setIsLoading,
  file_type,
  acceptingMany,
}: {
  setImage?: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  loading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  file_type: string
  acceptingMany?: boolean
}) {
  const [idList, setIdList] = useState<number[]>([])

  const { data: duplicates } = trpc.employee.checkDuplicates.useQuery(idList)
  const [duplicatedEmployees, setDuplicatedEmployees] = useState<
    ExcelExportType[]
  >([])

  // const { mutate: updateAll } = trpc.employee.updateMany.useMutation()
  const parseEmployeesData = (data: unknown[]) => {
    //returns all id of parsed employees
    const id_list = data.map((employee) => {
      return Number((employee as string[])[0] as string)
    }) as number[]
    if (id_list) {
      setIdList(id_list)
    }
    //filters duplicated ID
    const dupEmployeeList = data.filter((employee) => {
      return id_list.includes(
        employee ? Number((employee as string[])[0] as string) : -1
      )
    }) as any[]

    const final_dupList = [] as ExcelExportType[]
    dupEmployeeList.forEach((emp) => {
      const data_structure = {
        id: (emp as (string | number | null)[])[0] as number,
        name: (emp as (string | number | null)[])[1] as string,
        hired_date: new Date(
          (emp as (string | number | null | boolean)[])[2] as string
        ),
        position: (emp as (string | number | null)[])[3] as string,
        employee_id: (emp as (string | number | null)[])[4] as string,
        email: (emp as (string | number | null)[])[5] as string,
        teamId: (emp as (number | null)[])[6] as number,
        superviseeId: (emp as (number | null)[])[7] as number,
        createdAt: new Date((emp as (string | number | null)[])[8] as string),
        updatedAt: new Date((emp as (string | number | null)[])[9] as string),
        deleted: (emp as (string | number | null | boolean)[])[10] as boolean,
        deletedAt: new Date(
          (emp as (string | number | null | boolean)[])[11] as string
        ),
        workMode: (emp as (string | null)[])[12] as string,
        workStation: (emp as (string | null)[])[13] as string,
        address: {
          id: (emp as (string | number | null)[])[15] as number,
          street: (emp as (string | number | null)[])[16] as string,
          city: (emp as (string | number | null)[])[17] as string,
          state: (emp as (string | number | null)[])[18] as string,
          zip: (emp as (string | number | null)[])[19] as string,
          country: (emp as (string | number | null)[])[20] as string,
          createdAt:
            new Date(
              (emp as (string | number | null | boolean)[])[21] as string
            ) ?? null,
          updatedAt:
            new Date(
              (emp as (string | number | null | boolean)[])[22] as string
            ) ?? null,
          //may laktaw po ito
          deleted: (emp as (string | number | null | boolean)[])[25] as boolean,
          deletedAt: new Date(
            (emp as (string | number | null | boolean)[])[24] as string
          ),
          userId: (emp as (string | number | null)[])[21] as number,
          companyId: (emp as (number | string | null)[])[22] as number,
          vendorId: (emp as (string | number | null)[])[23] as number,
          employeeId: (emp as (string | number | null)[])[24] as number,
        },
        profile: {
          id: (emp as (string | number | null)[])[27] as number,
          first_name: (emp as (string | number | null)[])[28] as string,
          middle_name: (emp as (string | number | null)[])[29] as string,
          last_name: (emp as (string | number | null)[])[30] as string,
          suffix: (emp as (string | number | null)[])[31] as string,
          gender: (emp as (string | number | null)[])[32] as string,
          image: (emp as (string | number | null)[])[33] as string,
          date_of_birth: new Date(
            (emp as (string | number | null | boolean)[])[34] as string
          ),
          userId: (emp as (string | number | null)[])[37] as number,
          employeeId: (emp as (string | number | null)[])[36] as number,
          phone_no: (emp as (string | number | null)[])[35] as string,
        },
      } as ExcelExportType
      final_dupList.push(data_structure)
    })

    setDuplicatedEmployees(
      final_dupList.sort((a, b) => {
        console.log((a.id ?? 0) - (b.id ?? 0))
        return (a.id ?? 0) - (b.id ?? 0)
      })
    )

    // setDuplicatedEmployees(dupEmployees)
    // console.log(dupEmployees)
  }
  // const updateDate = duplicatedEmployees.map((row) => {
  //   const {id, name, hired_date, position, employee_id,}
  // })
  const onSubmitUpdate = () => {
    try {
      console.log(duplicatedEmployees)
    } catch {}
  }
  return (
    <div>
      {duplicates ? (
        duplicates.length === 0 ? (
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
        ) : (
          <div className="flex flex-col gap-2 px-4 py-2">
            <div className="flex items-center gap-4 bg-yellow-100 p-4 text-light-secondary">
              <i className="fa-regular fa-circle-exclamation" />
              <p>
                Our database has found existing records, please resolve record
                conflicts before proceeding.
              </p>
            </div>
            <DuplicateAccordion
              currentRecords={duplicates.sort((a, b) => a.id - b.id)}
              incomingChanges={duplicatedEmployees}
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="px-4 py-2 font-medium underline">
                Discard Changes
              </button>
              <button
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={onSubmitUpdate}
                // disabled={employeeLoading}
              >
                {/* {employeeLoading ? "Loading..." : "Accept All Changes"} */}
                Accept All Changes
              </button>
            </div>

            {/* <pre>{JSON.stringify(duplicates, null, 2)}</pre> */}
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  )
}
