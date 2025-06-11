import { useForm } from "react-hook-form"
import { z } from "zod/lib"
import { AssetDisposalEditInput } from "../../../server/schemas/asset"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "../../atoms/forms/InputField"
import { trpc } from "../../../utils/trpc"
import { useState } from "react"
import Modal from "../../headless/modal/modal"
import { DisposeType } from "../../../types/generic"
import { Textarea } from "@mantine/core"

export type DisposeEdit = z.infer<typeof AssetDisposalEditInput>

export const DisposeDetailsModal = (props: {
  asset: DisposeType
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [stats, setStats] = useState<string>(
    props.asset?.disposalStatus ?? "pending"
  )
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const utils = trpc.useContext()
  const [remarks, setRemarks] = useState<string | null>(null)

  const { mutate } = trpc.assetDisposal.edit.useMutation({
    onSuccess() {
      setIsVisible(true)
      // invalidate query of asset id when mutations is successful
      utils.assetDisposal.findAll.invalidate()
    },
  })

  const deleteAsset = trpc.asset.delete.useMutation({
    onSuccess() {
      console.log("omsim")
    },
  })

  const changeStats = trpc.asset.changeStatus.useMutation({
    onSuccess() {
      console.log("omsim")
    },
  })

  const { register, handleSubmit, reset, setValue } = useForm<DisposeEdit>({
    resolver: zodResolver(AssetDisposalEditInput),
  })

  const onSubmit = (dispose: DisposeEdit) => {
    mutate({
      ...dispose,
      id: props.asset?.id,
      disposalStatus: stats,
    })

    if (stats === "done") {
      deleteAsset.mutate(props.asset?.assetId ?? 0)
    } else if (
      stats === "cancelled" ||
      stats === "rejected" ||
      stats === "approved"
    ) {
      changeStats.mutate({
        id: props.asset?.assetId ?? 0,
        status: null,
      })
    }

    reset()
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="">
          <div className="">
            <div className="flex w-full flex-row justify-between gap-7">
              <div className="flex w-full flex-col py-2">
                <label className="font-semibold">Asset Number</label>
                <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                  {props.asset?.asset?.number ?? "--"}
                </p>
              </div>
              <div className="flex w-full flex-col py-2">
                <label className="font-semibold">Asset Name</label>
                <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                  {props.asset?.asset?.name ?? "--"}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-row justify-between gap-7 py-2">
              <div className="flex w-full flex-col">
                <label className="font-semibold">Method of Disposal</label>
                <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                  {props.asset?.disposalType?.name ?? "--"}
                </p>
              </div>

              <div className="flex w-full flex-col">
                {/* <label className="font-semibold">CUFS Code String</label >
                                <InputField
                                    disabled
                                    register={register}
                                    name="cufsCodeString"
                                    type={"text"}
                                    label={""}
                                /> */}
                <label className="font-semibold">Disposal Date</label>
                <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                  {props.asset?.disposalDate?.toDateString() ?? "--"}
                </p>
              </div>
              {/*  */}
            </div>

            <div className="flex w-full flex-row justify-between gap-7 py-2">
              {/* <div className="flex flex-col w-full">
                                <label className="font-semibold">Completion Date</label >
                                <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{props.asset?.completionDate?.toDateString() ?? "--"}</p>

                            </div> */}

              <div className="flex w-full flex-col"></div>
            </div>
            {props.asset?.disposalTypeId !== 1 && (
              <div>
                <div className="flex w-full flex-row justify-between gap-7 py-2">
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Customer Name</label>
                    {/* <InputField
                      disabled
                      register={register}
                      name="customerName"
                      type={"text"}
                      label={""}
                    /> */}
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {props.asset?.customerName ?? "--"}
                    </p>
                  </div>
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Telephone No.</label>
                    {/* <InputField
                      disabled
                      register={register}
                      name="telephoneNo"
                      type={"text"}
                      label={""}
                    />{" "} */}
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {props.asset?.telephoneNo ?? "--"}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-row justify-between gap-7 py-2">
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">AP Invoice Number</label>
                    {/* <InputField
                      disabled
                      register={register}
                      name="apInvoice"
                      type={"text"}
                      label={""}
                    /> */}
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {props.asset?.apInvoice ?? "--"}
                    </p>
                  </div>
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Sale Invoice Number</label>
                    {/* <InputField
                      disabled
                      register={register}
                      name="salesInvoice"
                      type={"text"}
                      label={""}
                    /> */}
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {props.asset?.salesInvoice ?? "--"}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-row justify-between gap-7 py-2">
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Disposal Price</label>
                    {/* <InputField
                      disabled
                      register={register}
                      name="disposalPrice"
                      type={"number"}
                      label={""}
                    /> */}
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {props.asset?.disposalPrice ?? "--"}
                    </p>
                  </div>
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Agreed Price</label>
                    {/* <InputField
                      disabled
                      register={register}
                      name="agreedPrice"
                      type={"number"}
                      label={""}
                    /> */}
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {props.asset?.agreedPrice ?? "--"}
                    </p>
                  </div>
                </div>
                {/* <div className="flex flex-col w-full">
                                <label className="font-semibold">
                                    Asset Description
                                </label>
                                <textarea
                                    value={props.asset?.disposalDesc ?? "--"}
                                    readOnly
                                    className="resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                                ></textarea></div> */}
              </div>
            )}
            {(props.asset?.disposalStatus === "pending" ||
              props.asset?.disposalStatus === "approved") && (
              <div className="flex w-full flex-row justify-between gap-7">
                <div className="flex w-full flex-col">
                  <label className="font-semibold">Remarks</label>
                  <Textarea
                    value={remarks ?? ""}
                    onChange={(event) => {
                      const text = event.currentTarget.value
                      setRemarks(text)
                      setValue("remarks", text)
                    }}
                    placeholder="Remarks"
                    minRows={6}
                    maxRows={6}
                    classNames={{
                      input:
                        "w-full border-2 border-gray-400 outline-none text-lg ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                    }}
                  />
                </div>
              </div>
            )}
            {(props.asset?.disposalStatus === "rejected" ||
              props.asset?.disposalStatus === "done" ||
              props.asset?.disposalStatus === "cancelled") && (
              <div className="flex w-full flex-row justify-between gap-7">
                <div className="flex w-full flex-col">
                  <label className="font-semibold">Remarks</label>
                  <Textarea
                    disabled
                    // value={remarks ?? "--"}
                    // onChange={(event) => {
                    //     const text = props.asset?.remarks ?? "--"
                    //     // setDisposalDesc(text)
                    //     setValue("remarks", text)
                    // }}
                    placeholder={props.asset?.remarks ?? ""}
                    minRows={6}
                    maxRows={6}
                    classNames={{
                      input:
                        "w-full border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2 text-lg",
                    }}
                  />
                </div>
              </div>
            )}

            <hr className="w-full"></hr>
            {(props.asset?.disposalStatus === "pending" ||
              props.asset?.disposalStatus === "approved") && (
              <div className="flex w-full justify-end gap-2 py-3">
                <button
                  type="submit"
                  className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    props.asset?.disposalStatus === "pending"
                      ? setStats("rejected")
                      : props.asset?.disposalStatus === "approved"
                      ? setStats("cancelled")
                      : setStats("done")
                  }}
                >
                  {props.asset?.disposalStatus === "pending"
                    ? "Reject"
                    : props.asset?.disposalStatus === "approved"
                    ? "Cancel Disposal"
                    : "Confirm"}
                </button>
                <button
                  type="submit"
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    props.asset?.disposalStatus === "pending"
                      ? setStats("approved")
                      : setStats("done")
                  }}
                >
                  {props.asset?.disposalStatus === "pending"
                    ? "Approve"
                    : "Confirm"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        className="max-w-2xl"
        title="Action Complete"
      >
        <div className="flex w-full flex-col px-4 py-2">
          <div>
            <p className="text-center text-lg font-semibold">
              Action is successful.
            </p>
          </div>
          <div className="flex justify-end py-2">
            <button
              className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                console.log(remarks)
                setIsVisible(false)
                props.setCloseModal(false)
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
