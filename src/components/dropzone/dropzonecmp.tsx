import React from "react";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { ImageJSON } from "../../types/table";

export default function DropzoneCMP(
  props: Partial<DropzoneProps> & {
    setImage: React.Dispatch<React.SetStateAction<ImageJSON>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  return (
    <Dropzone
      onDrop={(files) => {
        props.setIsLoading(true);
        console.log("accepted files");

        const img_file = URL.createObjectURL(files[0]!);
        props.setImage({
          name: files[0]!.name,
          size: files[0]!.size,
          file: img_file,
        });
        setTimeout(function () {
          props.setIsLoading(false);
        }, 5000);
      }}
      onReject={(files) => console.log("rejected files", files)}
      accept={IMAGE_MIME_TYPE}
      {...props}
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
            <img
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
  );
}
