import { InputField } from "../../atoms/forms/InputField"
import { trpc } from "../../../utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/lib"
import { AssetRepairCreateInput } from "../../../server/schemas/asset"
import { useForm } from "react-hook-form"
import AlertInput from "../../atoms/forms/AlertInput"
import { useState } from "react"
import Modal from "../../headless/modal/modal"
import Link from "next/link"

export type Repair = z.infer<typeof AssetRepairCreateInput>

const AddRepairForm = () => {
  const [assetNumber, setAssetNumber] = useState<string>("")
  const [validateString, setValidateString] = useState<string>("")


  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [validateModal, setValidateModal] = useState<boolean>(false)


  const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase())


  const updateAsset = trpc.asset.edit.useMutation({
    onSuccess() {
      console.log("omsim")
    },
  })

  const { mutate } = trpc.assetRepair.create.useMutation({
    onSuccess() {

      setCompleteModal(true)
      // invalidate query of asset id when mutations is successful
      // utils.asset.findAll.invalidate()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Repair>({
    resolver: zodResolver(AssetRepairCreateInput),

  })

  const onSubmit = (repair: Repair) => {
    if (asset?.status === null || asset?.status === undefined || asset?.status === "") {
      mutate({
        ...repair,
        assetId: asset?.id ?? 0
      })

      updateAsset.mutate({
        ...asset,
        id: asset?.id ?? 0,
        status: "repair",
      })

      reset()
    }
    else {
      if (asset?.status === "disposal") {
        setValidateString("The asset is already in for disposal")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.status === "repair") {
        setValidateString("The asset is in for repair.")
        setValidateModal(true)
        setAssetNumber("")
      }
    }
  }

  return (
    <div id="contents">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate
      >
        <Modal
          className="max-w-lg"
          isVisible={validateModal}
          setIsVisible={setValidateModal}
          title="NOTICE!!"
        >
          <div className="py-2">
            <p className="text-center text-lg font-semibold">{validateString}</p>
          </div>
        </Modal>
        <div className="flex items-center gap-2 text-gray-700">
          <i className="fa-fw fa-sharp fa-solid fa-circle-info fa-2x"></i>
          <p className="text-bold">Add Repair Asset</p>
        </div>

        <div className="flex flex-wrap py-2">
          <div className="w-full py-4">
            <div className="flex w-80 flex-row rounded-sm border border-[#F2F2F2] bg-[#F2F2F2] px-4 py-2">
              <input
                type="text"
                onChange={(event) => {
                  setAssetNumber(event.currentTarget.value)
                }}
                placeholder="Search/Input Asset Number"
                className="w-[100%] bg-transparent text-sm outline-none focus:outline-none"
              />

            </div>
          </div>
          <div className="flex w-full flex-row justify-between gap-7 px-2">
            <div className="flex w-full flex-col py-2">
              <label className="font-semibold">
                Asset Name
              </label>
              <p className="text-base ">
                {asset?.name ?? "---"}
              </p>
            </div>
            <div className="flex w-full flex-col py-2">
              <label className="font-semibold">
                Alternate Number
              </label>
              <p className="text-base">
                {asset?.alt_number ?? "---"}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
            <div className="flex w-[50%] flex-col py-2">
              <label className="font-semibold">
                Parts to be repaired <span className="text-red-500">*</span>
              </label>
              <InputField
                register={register}
                name="assetPart"
                type={"text"}
                label={""}
              />
            </div>
          </div>

          <AlertInput>{errors?.assetPart?.message}</AlertInput>
          <div className="flex w-full flex-row justify-between gap-7 px-2">
            <div className="flex w-[50%] flex-col py-2">
              <label className="font-semibold">
                Notes / Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={(event) => {
                  setValue("notes", event.currentTarget.value);
                }}
                rows={7}
                className="resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
              ></textarea>
            </div>
          </div>

          <AlertInput>{errors?.notes?.message}</AlertInput>
        </div>
        {asset !== null && <div className="mt-2 flex w-full justify-end gap-2 text-lg">

          <button
            type="submit"
            className="rounded-md bg-tangerine-300  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
          >
            Submit
          </button>
        </div>}
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
      </form >

      <Modal
        isVisible={completeModal}
        setIsVisible={setCompleteModal}
        className="max-w-2xl"
        title="Transfer Complete"
      >
        <div className="flex w-full flex-col px-4 py-2">
          <div>
            <p className="text-center text-lg font-semibold">
              Asset successfully added to repair.
            </p>
          </div>
          <div className="flex justify-end py-2">
            <Link href={"/assets"}>
              <button className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500">
                Continue
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </div >
  )
}

export default AddRepairForm
