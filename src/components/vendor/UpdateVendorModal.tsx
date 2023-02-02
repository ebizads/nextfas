



import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
//import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select, Textarea } from "@mantine/core"
//import DropZoneComponent from "../dropzone/DropZoneComponent"
import { EmployeeEditInput } from "../../server/schemas/employee"
import { ImageJSON } from "../../types/table"
import DropZoneComponent from "../dropzone/DropZoneComponent"
import { SelectValueType } from "../atoms/select/TypeSelect"
import { VendorType } from "../../types/generic"
import { VendorEditInput } from "../../server/schemas/vendor"
import { useEditableStore } from "../../store/useStore"
import Vendors from "../../pages/vendors"
// import { useEditableStore } from "../../store/useStore"


export type Vendor = z.infer<typeof VendorEditInput>


export const UpdateVendorModal = (props: {
  vendor: VendorType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  // isEditable: boolean
  // handleEdit: boolean

}) => {
  const [searchValue, onSearchChange] = useState<string>(
    props.vendor?.id?.toString() ?? "0"
  )
  const [date, setDate] = useState(props.vendor?.createdAt ?? new Date())
  const utils = trpc.useContext()
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: teams } = trpc.team.findAll.useQuery()
  const { editable, setEditable } = useEditableStore()



  // const teamList = useMemo(() => {
  //   const list = teams?.teams.map((team: { id: { toString: () => any }; name: any }) => {
  //     return { value: team.id.toString(), label: team.name }
  //   }) as SelectValueType[]
  //   return list ?? []
  // }, [teams]) as SelectValueType[]


  const {
    mutate,
    isLoading: vendorLoading,
    error,
  } = trpc.vendor.edit.useMutation({
    onSuccess() {
      console.log("omsim")
      // invalidate query of asset id when mutations is successful
      utils.vendor.findAll.invalidate()
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
  } = useForm<Vendor>({
    resolver: zodResolver(VendorEditInput),
  })


  useEffect(() => reset(props.vendor as Vendor), [props.vendor, reset])


  const onSubmit = async (vendor: Vendor) => {
    // Register function
    mutate({
      ...vendor,
      name: `${vendor.name}`,
    })
    reset()
  }


  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [updated, setUpdated] = useState(false);



  const handleEditable = () => {

    setIsEditable(true);
  }

  const handleIsEditable = () => {
    if (!updated) {
      setEditable(!editable);
      setUpdated(true);
    }
  };



  useEffect(() => { console.log(editable) })


  return (
    <div>
      <div className="flex flex-row-reverse w-full">
        <div className="flex space-x-1 align-middle items-center ">
          <p className="text-gray-500 uppercase text-xs">edit form </p>
          <i
            className="fa-light fa-pen-to-square cursor-pointer"
            onClick={() => {
              handleIsEditable()
              console.log(editable)
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
          <div className="flex w-[49%] flex-col">
            <InputField
              disabled={!isEditable}
              register={register}
              label="Company Name"
              name="name"
              type="text"
            />
            <AlertInput>{errors?.name?.message}</AlertInput>
          </div>
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Vendor Type</label>
            <Select
              placeholder="Pick one"
              onChange={(value) => {
                setValue("type", value ?? "")
              }}
              data={["Manufacturer", "Supplier", "Servicing", "Others"]}
              styles={(theme) => ({
                item: {
                  // applies styles to selected item
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.orange[3]
                          : theme.colors.orange[1],
                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                    },
                  },


                  // applies styles to hovered item (with mouse or keyboard)
                  "&[data-hovered]": {},
                },
              })}
              variant="unstyled"
              className={isEditable ? 'mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 ' : 'my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 '}
            />
          </div>

        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[49%] flex-col">
            <InputField
              disabled={!isEditable}
              type={"text"}
              label={"Email"}
              name={"email"}
              register={register}
            />
          </div>
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Phone Number: {`(use " , " for multiple phone numbers)`}</label>
            <input
              disabled={!isEditable}
              type="text"
              className={isEditable ? 'mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 ' : 'my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 '}
              onChange={(event) => {
                const convertToArray = event.currentTarget.value;


                const phonenumString = convertToArray.replace(/[^0-9,]/gi, "").split(",")
                setValue("phone_no", phonenumString);
              }}
              defaultValue={props.vendor?.phone_no ?? "--"}
            />
            <AlertInput>{errors?.phone_no?.message}</AlertInput>

          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex flex-col sm:w-1/3 md:w-[49%]">
            <InputField
              disabled={!isEditable}
              register={register}
              label="Fax Number"
              name="fax_no"
              type="text"
            />
            <AlertInput>{errors?.fax_no?.message}</AlertInput>
          </div>
          <div className="flex w-[49%] flex-col">
            <InputField
              disabled={!isEditable}
              register={register}
              label="Website"
              name="website"
              type="text"
            />
            <AlertInput>{errors?.website?.message}</AlertInput>
          </div>

        </div>

        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">Street</label>
            <InputField
              type={"text"}
              label={""}
              name="address.street"
              register={register}
              disabled={!isEditable}
            />
          </div>
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">Barangay</label>
            <InputField
              type={"text"}
              label={""}
              name={"address.state"}
              disabled={!isEditable}
              register={register}
            />


            <AlertInput>{errors?.address?.state?.message}</AlertInput>
          </div>
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">City</label>
            <InputField
              type={"text"}
              label={""}
              name={"address.city"}
              disabled={!isEditable}
              register={register}
            />


            <AlertInput>{errors?.address?.city?.message}</AlertInput>
          </div>
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">Zip Code</label>
            <InputField
              type={"text"}
              label={""}
              name={"address.zip"}
              disabled={!isEditable}
              register={register}
            />
            <AlertInput>{errors?.address?.zip?.message}</AlertInput>
          </div>
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">Country</label>
            <InputField
              type={"text"}
              label={""}
              name={"address.country"}
              disabled={!isEditable}
              register={register}
            />


            <AlertInput>{errors?.address?.country?.message}</AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-4">
          <div className="flex w-[99.7%] flex-col">
            <Textarea
              disabled={!isEditable}
              defaultValue={props.vendor?.remarks ?? "--"}
              label="Remarks"
              minRows={6}
              maxRows={6}
              classNames={{
                input:
                  "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2 disabled:bg-gray-300 disabled:text-gray-800 disabled:cursor-default",
                label: "font-sans text-sm text-gray-600 text-light",
              }}
            />
          </div>

        </div>




        {isEditable && <DropZoneComponent


          setImage={setImage}
          setIsLoading={setIsLoading}
          images={images}
          isLoading={isLoading}
          acceptingMany={false}
        />}
        <hr className="w-full"></hr>
        <div className="flex w-full justify-between">
          {!(error && errors && (
            <pre className="mt-2 text-sm italic text-red-500">
              Something went wrong!
            </pre>
          )) ? <div></div> : (error && errors && (
            <pre className="mt-2 text-sm italic text-red-500">
              Something went wrong!
            </pre>
          ))}
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={vendorLoading}
          >
            {vendorLoading ? "Loading..." : "Save"}
          </button>

        </div>
      </form>

    </div>
  )
}




