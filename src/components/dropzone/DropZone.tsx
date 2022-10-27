import React, { useState } from "react"
import { Group, Text } from "@mantine/core"
import { IconUpload, IconX } from "@tabler/icons"
import { Dropzone, IMAGE_MIME_TYPE, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone"
import { ImageJSON } from "../../types/table"
import Image from "next/image"
import * as XLSX from "xlsx";

export default function DropZone({
  setImage,
  loading,
  setIsLoading,
  file_type,
  acceptingMany
}: {
  setImage?: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  loading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  file_type: string
  acceptingMany?: boolean
}) {

  const [employeesJSON, setEmployeesJSON] = useState<any[] | null>(null)

  return (
    <div>

      {/* <div>
        <label htmlFor="file-upload">Upload</label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={handleFile}
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          disabled={loading}
        />
      </div> */}
      {
        !employeesJSON ?
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
                        file: files[i] ? URL.createObjectURL(files[i] ?? new Blob()) : "",
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
                      file: files[0] ? URL.createObjectURL(files[0] ?? new Blob()) : "",
                    }
                    if (setImage) {
                      setImage([file_to_append])
                    }
                  }
                }
              } else {

                //file reader
                const reader = new FileReader();

                reader.onload = async (evt: any) => {
                  const bstr = evt.target.result;
                  const wb = XLSX.read(bstr, { type: "binary" });
                  //strictly one worksheet should be found
                  if (wb.SheetNames.length === 1) {
                    const wsname = wb.SheetNames.toString()

                    const ws = wb.Sheets[wsname];
                    if (ws) {
                      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                      // do something here
                      setEmployeesJSON(data)
                    }
                  }
                }

                reader.readAsBinaryString(files[0] as Blob);
              }
              setTimeout(function () {
                setIsLoading(false)
              }, 2000)
            }}
            loading={loading}
            onReject={(files) => console.log("rejected files", files)}
            accept={file_type === "image" ? IMAGE_MIME_TYPE : MS_EXCEL_MIME_TYPE}
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
                  {file_type === "image" && <Image
                    src="/UploadIcon.svg"
                    alt="An SVG of an eye"
                    height={50}
                    width={50}
                    className="self-center"
                  />}
                </Dropzone.Idle>

                <Text size="lg" className="text-center" inline>
                  Drag and drop <span className="text-orange-400">{file_type === "image" ? "images" : "files"}</span>
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  or <span className="text-orange-400 underline">browse</span> on your
                  computer.
                </Text>
              </div>
            </Group>
          </Dropzone> :

          employeesJSON.map((employeeJSON, idx) => (

            <pre key={idx}>{JSON.stringify(employeeJSON, null, 2)}</pre>
          ))

      }
    </div>
  )
}
