import { Image } from '@mantine/core';
import React from 'react'
import { Loader } from '@mantine/core';
import { formatBytes } from '../../lib/functions';
import DropZone from './DropZone';
import { ImageJSON } from '../../types/table';

function DropZoneComponent(props: { images: ImageJSON[], setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>, isLoading: boolean, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, acceptingMany?: boolean }) {

  const handleRemove = (idx: number) => {
    props.setImage((prev) => [...prev.filter((img, i) => idx !== i)])
  }

  return (<div className="grid grid-cols-2 gap-4 py-2 px-5 col-span-10">
    <div className={`${props.images.length === 0 ? "col-span-2" : "col-span-1"} h-52 rounded-md border bg-white drop-shadow-2xl p-5`}>
      <DropZone setImage={props.setImage} loading={props.isLoading} setIsLoading={props.setIsLoading} file_type="image" acceptingMany={props.acceptingMany} />
    </div>
    <div className={`${props.images.length === 0 ? "hidden" : "block"} h-52 duration-200 flex items-center justify-center px-4 py-2 rounded-md border bg-white drop-shadow-2xl`}>
      {props.isLoading === true ? <Loader color="orange" variant="bars" className="self-center" /> : <div className={`flex flex-col ${props.acceptingMany ? "" : "items-center justify-center"} gap-4 w-[80%] h-48 overflow-y-auto`}>
        {props.images?.map((img, idx) => <div key={idx} className="flex gap-2 duration-200 group justify-between cursor-auto hover:shadow-md hover:border rounded-md">
          <div className="flex gap-4">
            <Image className="rounded-md shadow-md group-hover:shadow-none" radius="md" src={img.file} alt="Image" width={60} height={60} withPlaceholder />
            <div>
              <p className="font-medium truncate">{img.name}</p>
              <p className="text-xs font-light">{formatBytes(img.size)}</p>
            </div>
          </div>
          <button onClick={() => handleRemove(idx)} className="w-10 h-full bg-red-500 duration-200 rounded-br-md rounded-tr-md hidden group-hover:flex items-center justify-center">
            <i className="fa-solid fa-trash-can text-white" />
          </button>
        </div>)}

      </div>
      }
    </div>
  </div>);
}

export default DropZoneComponent