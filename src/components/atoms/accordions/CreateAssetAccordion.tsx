import AlertInput from "../forms/AlertInput"
import { InputField } from "../forms/InputField"
import { CircleNumber1 } from "tabler-icons-react"
import TypeSelect, { SelectValueType } from "../select/TypeSelect"
import { Textarea } from "@mantine/core"
import { trpc } from "../../../utils/trpc"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetCreateInput } from "../../../server/schemas/asset"
import { AssetFieldValues } from "../../../types/generic"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { FormErrorMessage } from "./UpdateAssetAccordion"
import { clearAndGoBack } from "../../../lib/functions"

const CreateAssetAccordion = () => {
  const router = useRouter()

  const { mutate, isLoading, error } = trpc.asset.create.useMutation({
    onError() {
      console.log(JSON.stringify(error))
    },
    onSuccess() {
      reset()
      router.push("/assets")
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetCreateInput),
  })

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const { data: typesData } = trpc.assetType.findAll.useQuery()
  const { data: actionTypesData } = trpc.assetActionType.findAll.useQuery()

  const typesList = useMemo(
    () =>
      typesData?.assetTypes
        .filter((item) => item.id != 0)
        .map((assetType) => {
          return { value: assetType.id.toString(), label: assetType.name }
        }),
    [typesData]
  ) as SelectValueType[] | undefined

  const actionTypesList = useMemo(
    () =>
      actionTypesData?.assetActionTypes
        .filter((item) => item.id != 0)
        .map((assetActionType) => {
          return {
            value: assetActionType.id.toString(),
            label: assetActionType.name,
          }
        }),
    [actionTypesData]
  ) as SelectValueType[] | undefined

  //asset description
  const [description, setDescription] = useState<string | null>(null)

  const [loading, setIsLoading] = useState<boolean>(false)

  const onSubmit: SubmitHandler<AssetFieldValues> = (
    form_data: AssetFieldValues
  ) => {
    if (error) {
      console.log(form_data)
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", error)
    } else {
      mutate(form_data)
      setTimeout(function () {
        setIsLoading(false)
      }, 3000)
    }
  }

  const [formError, setFormError] = useState<boolean>(false)
  useEffect(() => {
    setFormError(Object.keys(errors).length > 0 ? true : false)
  }, [errors])

  return (
    <div id="contents">
      {formError && <FormErrorMessage setFormError={setFormError} />}
      {assetsData && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 p-4"
          noValidate
        >
          <div className=" flex items-center gap-2 text-gray-700">
            <CircleNumber1 className="h-7 w-7" color="gold"></CircleNumber1>{" "}
            <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold capitalize text-transparent">
              General Details
            </p>
          </div>

          <div className="grid grid-cols-9 gap-7">
            <div className="col-span-9 grid grid-cols-12 gap-7">
              <div className="col-span-6">
                <InputField
                  register={register}
                  label="Asset Name"
                  name="name"
                  placeholder="Asset Name"
                  required
                />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-6">
                <InputField
                  register={register}
                  label="Asset ID"
                  placeholder={`GUN-${String(assetsData?.count + 1).padStart(
                    4,
                    "0"
                  )}`}
                  name="number"
                  disabled
                />
              </div>
            </div>
            <div className="col-span-9 grid grid-cols-12 gap-7">
              <div className="col-span-6">
                <InputField
                  register={register}
                  label="RFID Tag ID / Barcode"
                  name="barcode"
                  placeholder="RFID Tag ID / Barcode"
                  required
                />
                <AlertInput>{errors?.barcode?.message}</AlertInput>
              </div>
              <div className="col-span-6">
                <InputField
                  register={register}
                  label="Firearm Serial Number"
                  placeholder="Firearm Serial Number"
                  name="serial_no"
                />
                <AlertInput>{errors?.serial_no?.message}</AlertInput>
              </div>
            </div>
            <div className="col-span-9 grid grid-cols-12 gap-7">
              <div className="col-span-4">
                <InputField
                  register={register}
                  label="Brand"
                  name="brand"
                  placeholder="Brand"
                  required
                />
                <AlertInput>{errors?.brand?.message}</AlertInput>
              </div>
              <div className="col-span-4">
                <InputField
                  register={register}
                  label="Model"
                  name="models"
                  placeholder="Model"
                  required
                />
                <AlertInput>{errors?.models?.message}</AlertInput>
              </div>
              <div className="col-span-4 pt-1">
                <TypeSelect
                  name={"typeId"}
                  setValue={setValue}
                  value={getValues("typeId")?.toString()}
                  title={"Type"}
                  placeholder={"Select Type"}
                  data={typesList ?? []}
                />
                <AlertInput>{errors?.typeId?.message}</AlertInput>
              </div>
            </div>

            <div className="col-span-9 grid grid-cols-12 gap-7">
              <div className="col-span-4">
                <InputField
                  register={register}
                  label="Caliber"
                  name="caliber"
                  placeholder="Caliber"
                  required
                />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-4 pt-1">
                <TypeSelect
                  name={"actionTypeId"}
                  setValue={setValue}
                  value={getValues("actionTypeId")?.toString()}
                  title={"Action Type"}
                  placeholder={"Select Action Type"}
                  data={actionTypesList ?? []}
                />
                <AlertInput>{errors?.actionTypeId?.message}</AlertInput>
              </div>
            </div>

            <div className="col-span-9">
              <Textarea
                value={description ?? ""}
                onChange={(event) => {
                  const text = event.currentTarget.value
                  setDescription(text)
                  setValue("description", text)
                }}
                placeholder="Description"
                label="Description"
                minRows={6}
                maxRows={6}
                classNames={{
                  input:
                    "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                  label:
                    "font-sans text-sm font-normal text-gray-600 text-light",
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex w-full justify-center gap-2 text-lg">
            <button
              type="button"
              className="rounded-md bg-gray-300 px-4 py-2 font-medium text-dark-primary outline-none hover:bg-gray-400 focus:outline-none"
              onClick={() => clearAndGoBack()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!isValid && !isDirty) || isLoading}
              className="rounded-md bg-tangerine-300 px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            >
              {isLoading || loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateAssetAccordion
