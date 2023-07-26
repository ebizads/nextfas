import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { SetStateAction, useEffect, useMemo, useState } from "react"
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
import Modal from "../headless/modal/modal"

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
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  // const { data: teams } = trpc.team.findAll.useQuery()
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

  useEffect(() => {
    reset(props.vendor as Vendor)
    console.log(props.vendor)
  }, [props.vendor, reset])

  const onSubmit = async (vendor: Vendor) => {
    // Register function
    mutate({
      ...vendor,
      name: `${vendor.name}`,
    })
    reset()
  }

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [updated, setUpdated] = useState(false)

  const handleDelete = () => {
    setOpenModalDel(true)
  }

  const handleEditable = () => {
    setIsEditable(true)
  }

  const handleIsEditable = () => {
    if (!updated) {
      setEditable(!editable)
      setUpdated(true)
    }
  }

  // useEffect(() => { console.log(editable) })
  const [input, setInput] = useState("")

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    const regex = /[0-9,]/
    if (!regex.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div>
      <div className="flex w-full flex-row-reverse">
        <div className="flex items-center space-x-1 align-middle ">
          <p className="text-xs uppercase text-gray-500">edit form </p>
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

              defaultValue={props.vendor?.type ?? "--"}
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
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent  px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[49%] flex-col">
            <InputField

              type={"text"}
              label={"Email"}
              name={"email"}
              register={register}
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">
              Phone Number: {`(use " , " for multiple phone numbers)`}
            </label>
            <input

              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
              pattern="[0-9]*"
              type="text"
              onKeyDown={(e) => {
                const regex = /^[0-9, ]|Backspace/
                if (e.key === "e" || !regex.test(e.key)) {
                  e.preventDefault()
                }
              }}
              // onInput={(event) => {
              //   const inputValue = event.currentTarget.value

              // }}
              onChange={(event) => {
                const convertToArray = event.currentTarget.value
                const phonenumString = convertToArray
                  .replace(/[^0-9, ]/gi, "")
                  .split(",")
                setValue("phone_no", phonenumString)
              }}
              defaultValue={props.vendor?.phone_no ?? "--"}
            />
            <AlertInput>{errors?.phone_no?.message}</AlertInput>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="my-0.5 flex flex-col sm:w-1/3 md:w-[49%]">
            {/* <InputField
              
              register={register}
              label="Fax Number"
              name="fax_no"
              type="text"

            /> */}
            <label className="mb-2 sm:text-sm">Fax Number</label>
            <input

              type="number"
              pattern="[0-9]*"
              defaultValue={props.vendor?.fax_no ?? "--"}
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
              onKeyDown={(e) => {
                if (e.key === "e") {
                  e.preventDefault()
                }
              }}
              onChange={(event) => {
                if (event.target.value.length > 8) {
                  console.log("more than 8")
                  event.target.value = event.target.value.slice(0, 8)
                }
                setValue("fax_no", event.currentTarget.value.toString())
              }}
            />
            <AlertInput>{errors?.fax_no?.message}</AlertInput>
          </div>
          <div className="my-0.5 flex w-[49%] flex-col">
            <InputField

              register={register}
              label="Website"
              name="website"
              type="text"
            />
            <AlertInput>{errors?.website?.message}</AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-4 py-4">
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">Street</label>
            <InputField
              type={"text"}
              label={""}
              name="address.street"
              register={register}

            />
          </div>
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">Region</label>
            <InputField
              type={"text"}
              label={""}
              name={"address.region"}

              register={register}
            />


            <AlertInput>{errors?.address?.region?.message}</AlertInput>
          </div>
          <div className="flex w-[18.4%] flex-col">
            <label className="sm:text-sm">City</label>
            <InputField
              type={"text"}
              label={""}
              name={"address.city"}

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

              register={register}
            />

            <AlertInput>{errors?.address?.country?.message}</AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-4">
          <div className="flex w-[99.7%] flex-col">
            <Textarea

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

        {isEditable && (
          <DropZoneComponent
            // setIsVisible={}
            setImage={setImage}
            setIsLoading={setIsLoading}
            images={images}
            isLoading={isLoading}
            acceptingMany={false}
            setIsVisible={function (): void {
              throw new Error("Function not implemented.")
            }}
          />
        )}
        <hr className="w-full"></hr>
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
            <div className="space-x-1">
              <button
                type="button"
                className="rounded bg-red-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  handleDelete(), setIsLoading(true)
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Delete"}
              </button>

              <button
                type="submit"
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={vendorLoading}
              >
                {vendorLoading ? "Loading..." : "Save"}
              </button>
            </div>
          )}
          <VendorDeleteModal
            vendor={props.vendor}
            openModalDel={openModalDel}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setOpenModalDel={setOpenModalDel}
            setIsVisible={props.setIsVisible}
          />
        </div>
      </form>
    </div>

  )

}

export const VendorDeleteModal = (props: {
  vendor: VendorType
  openModalDel: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  //trpc utils for delete
  const utils = trpc.useContext()

  const { mutate } = trpc.vendor.delete.useMutation({
    onSuccess() {
      console.log()
      props.setOpenModalDel(false)
      props.setIsLoading(false)
      props.setIsVisible(false)
      utils.vendor.findAll.invalidate()

      // window.location.reload()
    },
  })
  const handleDelete = async () => {
    mutate({
      id: props.vendor?.id ?? -1,
    })
  }

  return (
    <Modal
      className="max-w-2xl"
      title="Delete Vendor"
      isVisible={props.openModalDel}
      setIsVisible={props.setOpenModalDel}
    >
      <div className="m-4 flex flex-col ">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>You are about delete this item with vendor name: {props.vendor?.name}</div>
          <p className="text-neutral-500">
            <i className="fa-regular fa-circle-exclamation" /> Please carefully review the action before deleting.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-sm bg-gray-300 px-5 py-1 hover:bg-gray-400"
              onClick={() => {
                props.setOpenModalDel(false)
                props.setIsLoading(false)
              }}
            >
              Cancel
            </button>
            <button
              className="rounded-sm bg-red-500 px-5 py-1 text-neutral-50 hover:bg-red-600"
              onClick={() => handleDelete()}
            // disabled={isLoading}
            >
              Yes, delete record
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

