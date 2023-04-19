import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select } from "@mantine/core"
import DropZoneComponent from "../dropzone/DropZoneComponent"
import { env } from "../../env/client.mjs"
import moment from "moment"
import { SelectValueType } from "../atoms/select/TypeSelect"
import { AddLocationDetails } from "../../server/schemas/maintenance"

export type Location = z.infer<typeof AddLocationDetails>


export const CreateLocationModal = (props: {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  images: ImageJSON[]
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const utils = trpc.useContext()
  const {
    mutate,
    isLoading: locationLoading,
    error,
  } = trpc.maintenance.create.useMutation({
    onSuccess: () => {
      utils.maintenance.findAll.invalidate()
      props.setIsVisible(false)
      props.setImage([])
    },
  })



  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Location>({
    resolver: zodResolver(AddLocationDetails),
   
  })


  const onSubmit = async (location: Location) => {
    // Register function


    mutate({
      building: location.building?? "",
      floor: location.floor ?? "",
      room: location.room ?? "",
      
    })
    reset()
  }


  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Asset Location</label>
            <InputField
              register={register}
              name="assetLocation"
              type={"text"}
              label={""}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Floor</label>
            <InputField
              type={"text"}
              label={""}
              name={"floor"}
              register={register}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Room</label>
            <InputField
              type={"text"}
              label={""}
              name={"room"}
              register={register}
            />
          </div>
        </div>

        <hr className="w-full"></hr>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={locationLoading}
          >
            {locationLoading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
      {error && errors && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
          {JSON.stringify({ error, errors }, null, 2)}
        </pre>
      )}
    </div>
  )
}


