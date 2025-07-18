import AlertInput from "../forms/AlertInput"
import { InputField } from "../forms/InputField"
import TypeSelect, { SelectValueType } from "../select/TypeSelect"
import { Textarea } from "@mantine/core"
import { trpc } from "../../../utils/trpc"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetUpdateInput } from "../../../server/schemas/asset"
import { AssetEditFieldValues } from "../../../types/generic"
import { useEffect, useMemo, useRef, useState } from "react"
import JsBarcode from "jsbarcode"
import { useReactToPrint } from "react-to-print"
import { useUpdateAssetStore } from "../../../store/useStore"
import { useRouter } from "next/router"
import { clearAndGoBack } from "../../../lib/functions"

export const FormErrorMessage = (props: {
  setFormError: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="flex justify-between rounded-md border-red-400 bg-red-50 p-6">
      <p className="text-red-400">There seems to be a problem with the form.</p>
      <i
        className="fa-solid fa-xmark hover:cursor-pointer"
        onClick={() => {
          props.setFormError(false)
        }}
      />
    </div>
  )
}

const UpdateAssetAccordion = () => {
  const { mutate, isLoading, error } = trpc.asset.update.useMutation({
    onSuccess() {
      console.log("successfully updated")
      router.push("/assets")
    },
    onError(error) {
      console.error("error updating", error)
    },
  })

  const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    // watch,
    formState: { errors },
  } = useForm<AssetEditFieldValues>({
    resolver: zodResolver(AssetUpdateInput),
    // defaultValues: {
    //   name: selectedAsset?.name,
    //   alt_number: selectedAsset?.alt_number,
    //   // barcode: "",
    //   custodianId: selectedAsset?.custodianId ?? undefined,
    //   departmentId: selectedAsset?.departmentId ?? undefined,
    //   description: selectedAsset?.description,
    //   // model: {
    //   //   name: "",
    //   //   brand: "",
    //   //   number: "",
    //   // asset_category: {
    //   //   name: ""
    //   // },
    //   // asset_class: {
    //   //   name: ""
    //   // },
    //   // typeId: 0,
    //   // asset_type: {
    //   //   name: ""
    //   // },
    //   //   typeId: 0,
    //   //   categoryId: 0,
    //   //   classId: 0,
    //   // },
    //   number: selectedAsset?.number,
    //   parentId: selectedAsset?.parentId ?? undefined,
    //   assetProjectId: selectedAsset?.parent?.assetassetProjectId ?? undefined,
    //   remarks: selectedAsset?.remarks,
    //   serial_no: selectedAsset?.serial_no,
    //   subsidiaryId: selectedAsset?.subsidiaryId ?? undefined,
    //   vendorId: selectedAsset?.vendorId ?? undefined,
    //   management: {
    //     original_cost: selectedAsset?.management?.original_cost,
    //     current_cost: selectedAsset?.management?.current_cost,
    //     residual_value: selectedAsset?.management?.residual_value,
    //     depreciation_period: selectedAsset?.management?.depreciation_period,
    //   },
    // },
  })

  useEffect(() => {
    if (selectedAsset) {
      reset(selectedAsset as AssetEditFieldValues)
    }
  }, [selectedAsset, reset, setValue])

  const [typeId, setTypeId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: typesData } = trpc.assetType.findAll.useQuery()
  const { data: actionTypesData } = trpc.assetActionType.findAll.useQuery()

  const [description, setDescription] = useState<string | null>(
    selectedAsset?.description ?? null
  )

  const [loading, setIsLoading] = useState<boolean>(false)
  // const [assetId, setAssetId] = useState<string>(
  //   `-${moment().format("YYMDhms")}`
  // )

  const assetId = useMemo(() => {
    const asset_number = selectedAsset ? selectedAsset?.number.split("-") : "-"
    return "-" + asset_number[1]
  }, [])

  const asset_number = useMemo(() => {
    const parseId = (id: string | null) => {
      if (!id) {
        return "00"
      }
      if (id?.length === 1) {
        return 0 + id
      } else {
        return id
      }
    }

    if (typeId && departmentId) {
      return parseId(departmentId) + parseId(typeId)
    }

    return null
  }, [typeId, departmentId]) as string | null

  // Gun Types
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

  useEffect(() => {
    if (asset_number) {
      const id = `${asset_number}${assetId}`
      setValue("number", id)
      JsBarcode("#barcode2", id, {
        textAlign: "left",
        textPosition: "bottom",
        fontOptions: "",
        fontSize: 12,
        textMargin: 6,
        height: 50,
        width: 1,
      })
    }
  }, [assetId, asset_number, companyId, getValues, selectedAsset, setValue])

  const router = useRouter()

  // const ticketHandler = useMemo(() => {
  //   //
  // }, [])

  const onSubmit: SubmitHandler<AssetEditFieldValues> = (
    form_data: AssetEditFieldValues
  ) => {
    // console.log(form_data)

    if (error) {
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", errors)
    } else {
      console.log("Submitting: ", selectedAsset?.id)
      console.log("Type Id: ", form_data?.typeId)

      mutate({ ...form_data, id: selectedAsset?.id ?? 0 })

      // ticketTable.mutate({ addedById});
      setTimeout(function () {
        setIsLoading(false)
      }, 3000)

      reset()
      setTypeId(null)
      setCompanyId(null)
      setDepartmentId(null)
      setSelectedAsset(null)
    }
  }

  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const [formError, setFormError] = useState<boolean>(false)
  useEffect(() => {
    setFormError(Object.keys(errors).length > 0 ? true : false)
  }, [errors])

  return (
    <div id="contents">
      {formError && <FormErrorMessage setFormError={setFormError} />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate
      >
        {/* <InputField register={register} label="Name" name="name" />
      <AlertInput>{errors?.name?.message}</AlertInput> */}

        {/* <Accordion
          transitionDuration={300}
          multiple={true}
          defaultValue={["1", "2", "3"]}
          classNames={{}}
        >*/}
        <div className="p-4">
          <div className="pb-5 uppercase outline-none focus:outline-none active:outline-none">
            <div className=" flex items-center gap-2 text-gray-700">
              {/* <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400 p-1 text-sm text-yellow-400">
                  1
                </div> */}
              <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text font-sans text-xl font-semibold uppercase text-transparent">
                Asset Information
              </p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-9 gap-7 ">
              <div className="col-span-9 grid grid-cols-12 gap-7">
                <div className="col-span-4">
                  <InputField
                    register={register}
                    label="Asset Name"
                    name="name"
                    placeholder="Asset Name"
                    required
                  />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>

                <div className="col-span-4">
                  <InputField
                    register={register}
                    label="Firearm Serial Number"
                    placeholder="Firearm Serial Number"
                    name="serial_no"
                  />
                  <AlertInput>{errors?.serial_no?.message}</AlertInput>
                </div>
                <div className="col-span-4">
                  <InputField
                    register={register}
                    label="Asset ID"
                    placeholder="Asset ID"
                    name="number"
                    disabled
                  />
                </div>
              </div>
              {/* <div className="col-span-9 grid grid-cols-12 gap-7">
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
              </div> */}

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
                <div className="col-span-4">
                  <TypeSelect
                    name={"typeId"}
                    setValue={setValue}
                    value={getValues("typeId")?.toString()}
                    title={"Type"}
                    placeholder={"Select Type"}
                    data={typesList ?? []}
                    required
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
                  <AlertInput>{errors?.caliber?.message}</AlertInput>
                </div>
                <div className="col-span-4">
                  <TypeSelect
                    name={"actionTypeId"}
                    setValue={setValue}
                    value={getValues("actionTypeId")?.toString()}
                    title={"Action Type"}
                    placeholder={"Select Action Type"}
                    data={actionTypesList ?? []}
                    required
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
          </div>
        </div>
        {/* </Accordion> */}
        <div className="mt-2 flex w-full justify-end gap-2 text-lg">
          <button
            type="button"
            className="px-4 py-2 underline"
            onClick={() => clearAndGoBack()}
          >
            Discard
          </button>
          <button
            type="submit"
            className="text-dark-primary rounded-md  bg-tangerine-300 px-6 py-2 font-medium outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            onClick={() => console.log(errors)}
          >
            {isLoading || loading ? "Saving..." : "Save"}
          </button>
        </div>
        {/* 
        <Modal isVisible={submitting} setIsVisible={setSubmitting} title="Confirm details" className="w-fit h-fit p-4">
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div className="mt-2 flex w-full justify-end gap-2 text-lg">
              <button className="px-4 py-2 underline" onClick={() => setSubmitting(false)}>Review Changes</button>
              <button
                type="submit"
                onClick={() => {
                  setConfirming(true)
                }}
                disabled={loading}
                className="rounded-md disabled:bg-tangerine-200 disabled:cursor-not-allowed bg-tangerine-300 px-6 py-2 font-medium text-dark-primary hover:bg-tangerine-400">
                {loading ? "Please wait..." : "Add Asset"}
              </button>
            </div>
          </div>
        </Modal> */}
      </form>
    </div>
  )
}

export default UpdateAssetAccordion
