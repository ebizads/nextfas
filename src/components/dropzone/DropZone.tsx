import React from "react"
import { Group, Text } from "@mantine/core"
import { IconUpload, IconX } from "@tabler/icons"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { ImageJSON } from "../../types/table"
import Image from "next/image"

export default function DropZone({ setImage, loading, setIsLoading }: {
  setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  loading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
) {
  return (
    <Dropzone
      onDrop={(files) => {
        setIsLoading(true)
        console.log("accepted files")

        for (let i = 0; i < files.length; i++) {
          if (files[i]) {

            const file_to_append = {
              name: files[i]?.name ?? "",
              size: files[i]?.size ?? 0,
              file: files[i] ? URL.createObjectURL(files[i] ?? new Blob) : "",
            }
            setImage((prev) => [...prev, file_to_append])
          }
        }
        setTimeout(function () {
          setIsLoading(false)
        }, 2000)
      }}
      loading={loading}
      onReject={(files) => console.log("rejected files", files)}
      accept={IMAGE_MIME_TYPE}

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
            {/* <IconPhoto
              size={50}
              stroke={1.5}
              color={"orange"}
              className="self-center"
            /> */}
            <Image
              src="/UploadIcon.svg"
              alt="An SVG of an eye"
              height={50}
              width={50}
              className="self-center"
            />
          </Dropzone.Idle>

          <Text size="lg" className="text-center" inline>
            Drag and drop <span className="text-orange-400">images</span>
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            or <span className="text-orange-400 underline">browse</span> on your
            computer.
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}
