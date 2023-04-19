import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
//import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select } from "@mantine/core"
//import DropZoneComponent from "../dropzone/DropZoneComponent"
import { UpdateLocationDetails } from "../../server/schemas/maintenance"
import { ImageJSON } from "../../types/table"
import DropZoneComponent from "../dropzone/DropZoneComponent"
import { SelectValueType } from "../atoms/select/TypeSelect"
import { LocationType } from "../../types/generic"
import { useEditableStore } from "../../store/useStore"
import { LocationEditInput } from "../../server/schemas/location"
// import { useEditableStore } from "../../store/useStore"

export type Location = z.infer<typeof UpdateLocationDetails>

export const UpdateLocationModal = (props: {
  location: LocationType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const utils = trpc.useContext()
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { editable, setEditable } = useEditableStore()

  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.edit.useMutation({
    onSuccess() {
      console.log("omsim")
      // invalidate query of asset id when mutations is successful
      utils.employee.findAll.invalidate()
      props.setIsVisible(false)
      setImage([])
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Location>({
    resolver: zodResolver(LocationEditInput),
  })

  useEffect(() => reset(props.location as Location), [props.location, reset])

  const onSubmit = async (location: Location) => {
    // Register function
    mutate({
      ...location,
      id: props?.location?.id ?? 0,
    })
    reset()
  }

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [updated, setUpdated] = useState(false)

  const handleEditable = () => {
    setIsEditable(true)
  }

  const handleIsEditable = () => {
    if (!updated) {
      setEditable(!editable)
      setUpdated(true)
    }
  }

  // useEffect(() => { console.log("department: " + props.employee?.team?.department?.name) })

  return (
    <div>
      <div className="flex w-full flex-row-reverse">
        <div className="flex items-center space-x-1 align-middle ">
          <p className="text-xs uppercase text-gray-500">edit form </p>
          <i
            className="fa-light fa-pen-to-square cursor-pointer"
            onClick={() => {
              handleIsEditable()
              handleEditable()
            }}
          />
        </div>
      </div>
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
        
        <div className="flex w-full justify-between">
          {!(
            error &&
            errors && (
              <pre className="mt-2 text-sm italic text-red-500">
                Something went wrong!
              </pre>
            )
          ) ? (
            <div></div>
          ) : (
            error &&
            errors && (
              <pre className="mt-2 text-sm italic text-red-500">
                Something went wrong!
              </pre>
            )
          )}
          {isEditable && (
            <button
              type="submit"
              className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              disabled={employeeLoading}
            >
              {employeeLoading ? "Loading..." : "Save"}
            </button>
          )}
        </div>
      </form>
      {/* {error && errors && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
        </pre>
      )} */}
    </div>
  )
}
