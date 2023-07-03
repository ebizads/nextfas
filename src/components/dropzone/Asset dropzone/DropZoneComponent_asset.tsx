import { Image } from "@mantine/core"
import React from "react"
import { Loader } from "@mantine/core"
import { formatBytes } from "../../lib/functions"
import DropZone from "./DropZone"
import { ImageJSON } from "../../types/table"

function DropZoneComponent(props: {
  images: ImageJSON[]
  setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  acceptingMany?: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const handleRemove = (idx: number) => {
    props.setImage((prev) => [...prev.filter((img, i) => idx !== i)])
  }

  return (
    <div className="col-span-10 grid grid-cols-2 gap-4 py-2 px-5">
      <div
        className={`${
          props.images.length === 0 ? "col-span-2" : "col-span-1"
        } h-52 rounded-md border bg-white p-5 drop-shadow-2xl`}
      >
        <DropZone
          setImage={props.setImage}
          loading={props.isLoading}
          setIsLoading={props.setIsLoading}
          file_type="image"
          acceptingMany={props.acceptingMany}
          setIsVisible={props.setIsVisible}
        />
      </div>
      <div
        className={`${
          props.images.length === 0 ? "hidden" : "block"
        } flex h-52 items-center justify-center rounded-md border bg-white px-4 py-2 drop-shadow-2xl duration-200`}
      >
        {props.isLoading === true ? (
          <Loader color="orange" variant="bars" className="self-center" />
        ) : (
          <div
            className={`flex flex-col ${
              props.acceptingMany ? "" : "items-center justify-center"
            } h-48 w-[80%] gap-4 overflow-y-auto`}
          >
            {props.images?.map((img, idx) => (
              <div
                key={idx}
                className="group flex cursor-auto justify-between gap-2 rounded-md duration-200 hover:border hover:shadow-md"
              >
                <div className="flex gap-4">
                  <Image
                    className="rounded-md shadow-md group-hover:shadow-none"
                    radius="md"
                    src={img.file}
                    alt="Image"
                    width={60}
                    height={60}
                    withPlaceholder
                  />
                  <div>
                    <p className="truncate font-medium">{img.name}</p>
                    <p className="text-xs font-light">
                      {formatBytes(img.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(idx)}
                  className="hidden h-full w-10 items-center justify-center rounded-br-md rounded-tr-md bg-red-500 duration-200 group-hover:flex"
                >
                  <i className="fa-solid fa-trash-can text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DropZoneComponent
