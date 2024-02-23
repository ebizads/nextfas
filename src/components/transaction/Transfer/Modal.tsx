import { useForm } from "react-hook-form"
import { z } from "zod/lib"
import { createIssuance } from "../../../server/schemas/issuance"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "../../atoms/forms/InputField"
import { trpc } from "../../../utils/trpc"
import { useState } from "react"
import Modal from "../../headless/modal/modal"
import { AssetTransferType } from "../../../types/generic"
import { Textarea } from "@mantine/core"
import { AssetTransferEditInput } from "../../../server/schemas/asset"

export type TransferEdit = z.infer<typeof AssetTransferEditInput>

export const TransferDetailsModal = (props: {
  asset: AssetTransferType
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [stats, setStats] = useState<string>(
    props.asset?.transferStatus ?? "pending"
  )
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const utils = trpc.useContext()
  const [remarks, setRemarks] = useState<string | null>(null)

  //   const { data: asset } = trpc.asset.findOne.useQuery(
  //     String(props.asset?.asset?.number.toUpperCase())
  //   )

  const { mutate } = trpc.assetTransfer.edit.useMutation({
    onSuccess() {
      setIsVisible(true)
      // invalidate query of asset id when mutations is successful
      utils.assetTransfer.findAll.invalidate()
    },
  })

  const { handleSubmit, reset, setValue } = useForm<TransferEdit>({
    resolver: zodResolver(AssetTransferEditInput),
  })
  const changeStats = trpc.asset.edit.useMutation({
    onSuccess() {
      console.log("omsim")
    },
  })

  const onSubmit = (transfer: TransferEdit) => {
    console.log("ITEM WORKS")

    mutate({
      ...transfer,
      id: props.asset?.id,
      transferStatus: stats,
    })

    if (
      stats === "cancelled" ||
      stats === "rejected" ||
      stats === "approved" ||
      stats === "done"
    ) {
      changeStats.mutate({
        id: props.asset?.assetId ?? 0,
        status: null,
      })
    }

    if(props.asset?.asset?.remarks?.toLowerCase().includes('for return') && stats === "done"){
      changeStats.mutate({
        id: props.asset?.assetId ?? 0,
        custodianId: 0,
        status: null,
      })
    }

    // console.log(props.asset?.asset?.remarks);
    

    // reset()
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
              <div className="flex w-full flex-col py-2">
                <label className="font-semibold">Transfer Location</label>
                <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                  {props.asset?.transferLocation ?? "--"}
                </p>
              </div>

              <div className="flex w-full flex-col py-2">
                <label className="font-semibold">Transfer Date</label>
                <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                  {props.asset?.transferDate?.toLocaleDateString("en-GB") ??
                    "--"}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col py-2">
              <label className="font-semibold">Asset Description</label>
              {/* <p className="text-base ">
                {props.asset?.asset?.description ?? "---"}
              </p> */}
              <Textarea
                disabled
                placeholder={props.asset?.asset?.description ?? ""}
                minRows={3}
                maxRows={3}
                classNames={{
                  input:
                    "w-full border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2 text-lg",
                }}
              />
            </div>
            {/* <div className="flex w-full flex-col">
              <label className="font-semibold">Remarks</label>
              <Textarea
                // disabled
                defaultValue={props.asset?.remarks ?? ""}
                onChange={(event) => {
                  const { value } = event.target
                  setValue("remarks", value)
                }}
                placeholder={props.asset?.remarks ?? ""}
                minRows={3}
                maxRows={3}
                classNames={{
                  input:
                    "w-full border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2 text-lg",
                }}
              />
            </div> */}

            <div className="flex w-full flex-row justify-between gap-7 py-2">
              {/* <div className="flex flex-col w-full">
                                    <label className="font-semibold">Completion Date</label >
                                    <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{props.asset?.completionDate?.toDateString() ?? ""}</p>
    
                                </div> */}

              <div className="flex w-full flex-col"></div>
            </div>

            <hr className="w-full"></hr>
            {/* 
                        {(props.asset?.transferStatus === "pending") && <div className="flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Comments</label >
                                <Textarea
                                    defaultValue={props.asset?.remarks ?? ""}
                                    onChange={(event) => {
                                        const text = event.currentTarget.value
                                        setRemarks(text)
                                        setValue("remarks", text)
                                    }}
                                    placeholder={props.asset?.remarks ?? "Remarks"}
                                    minRows={6}
                                    maxRows={6}
                                    classNames={{
                                        input:
                                            "w-full border-2 border-gray-400 outline-none text-lg ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                                    }}
                                />
                            </div>
                        </div>} */}

            {props.asset?.transferStatus === "approved" && (
              <div className="flex w-full flex-row justify-between gap-7">
                <div className="flex w-full flex-col">
                  <label className="font-semibold">Comments</label>
                  <Textarea
                    defaultValue={props.asset?.remarks ?? ""}
                    onChange={(event) => {
                      const text = event.currentTarget.value
                      setRemarks(text)
                      setValue("remarks", text)
                    }}
                    placeholder={props.asset?.remarks ?? "Remarks"}
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

            {(props.asset?.transferStatus === "rejected" ||
              props.asset?.transferStatus === "done" ||
              props.asset?.transferStatus === "cancelled") && (
              <div className="flex w-full flex-row justify-between gap-7">
                <div className="flex w-full flex-col">
                  <label className="font-semibold">Comments</label>
                  <Textarea
                    disabled
                    // value={remarks ?? ""}
                    // onChange={(event) => {
                    //     const text = props.asset?.remarks ?? ""
                    //     // setDisposalDesc(text)
                    //     setValue("remarks", text)
                    // }}
                    defaultValue={props.asset?.remarks ?? ""}
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
            {(props.asset?.transferStatus === "pending" ||
              props.asset?.transferStatus === "approved") && (
              <div className="flex w-full justify-end gap-2 py-3">
                <button
                  type="submit"
                  className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    console.log("OOOOOOOOOOOO")
                    props.asset?.transferStatus === "pending"
                      ? setStats("rejected")
                      : props.asset?.transferStatus === "approved"
                      ? setStats("cancelled")
                      : setStats("done")
                  }}
                >
                  {props.asset?.transferStatus === "pending"
                    ? "Reject"
                    : props.asset?.transferStatus === "approved"
                    ? "Cancel Transfer"
                    : "Confirm"}
                </button>
                <button
                  type="submit"
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    console.log("DDDDDDDDDDDDD")
                    props.asset?.transferStatus === "pending"
                      ? setStats("approved")
                      : setStats("done")
                    console.log(stats, "stats mo to")
                  }}
                >
                  {props.asset?.transferStatus === "pending"
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

  reset()
}
