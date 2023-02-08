import { useForm } from "react-hook-form";
import { z } from "zod/lib";
import { AssetRepairEditInput } from "../../../server/schemas/asset";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../atoms/forms/InputField";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import Modal from "../../headless/modal/modal";
import { AssetRepairType } from "../../../types/generic";
import { Textarea } from "@mantine/core";

export type RepairEdit = z.infer<typeof AssetRepairEditInput>

export const RepairDetailsModal = (props: {
    asset: AssetRepairType,
    setCloseModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const [stats, setStats] = useState<string>(props.asset?.repairStatus ?? "pending");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const utils = trpc.useContext()

    const {
        mutate,
    } = trpc.assetRepair.edit.useMutation({
        onSuccess() {
            setIsVisible(true);
            utils.assetDisposal.findAll.invalidate()
        },

    })

    // const deleteAsset = trpc.asset.delete.useMutation({
    //     onSuccess() {
    //         console.log("omsim");
    //     },
    // })

    const changeStats = trpc.asset.changeStatus.useMutation({
        onSuccess() {
            console.log("omsim");
        },
    })


    const {
        handleSubmit,
        reset,
        setValue,
    } = useForm<RepairEdit>({
        resolver: zodResolver(AssetRepairEditInput),
    })

    const onSubmit = (dispose: RepairEdit) => {

        mutate({
            ...dispose,
            id: props.asset?.id,
            repairStatus: stats,
        })

        if (stats === 'cancelled' || stats === 'rejected' || stats === 'approved' || stats === 'done') {
            changeStats.mutate({
                id: props.asset?.assetId ?? 0,
                status: null
            })
        }


        reset()
    }
    const [remarks, setRemarks] = useState<string | null>(null)


    // function setValue(arg0: string, text: string) {
    //     throw new Error("Function not implemented.");
    // }

    useEffect(() => {
        console.log(props.asset?.remarks ?? "--")
    })

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
                noValidate>
                <div className="">
                    <div className="">
                        <div className="flex flex-row justify-between w-full gap-7">
                            <div className="flex w-full flex-col py-2">
                                <label className="font-semibold">
                                    Asset Name
                                </label>
                                <p className="text-base ">
                                    {props.asset?.asset?.name ?? "---"}
                                </p>
                            </div>
                            <div className="flex w-full flex-col py-2">
                                <label className="font-semibold">
                                    Asset Number
                                </label>
                                <p className="text-base">
                                    {props.asset?.asset?.number ?? "---"}
                                </p>
                            </div>
                            <div className="flex w-full flex-col py-2">
                                <label className="font-semibold">
                                    Alternate Number
                                </label>
                                <p className="text-base">
                                    {props.asset?.asset?.alt_number ?? "---"}
                                </p>
                            </div>
                        </div>
                        <div className="py-2 flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Parts to Repair</label >
                                <p className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 my-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm h-11">{props.asset?.assetPart ?? ""}</p>

                            </div>
                        </div>

                        {(props.asset?.repairStatus === "pending") && <div className="flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Comments</label >
                                <Textarea
                                    defaultValue={props.asset?.notes ?? ""}
                                    onChange={(event) => {
                                        const text = event.currentTarget.value
                                        setRemarks(text)
                                        setValue("remarks", text)
                                    }}
                                    placeholder={props.asset?.notes ?? "Remarks"}
                                    minRows={6}
                                    maxRows={6}
                                    classNames={{
                                        input:
                                            "w-full border-2 border-gray-400 outline-none text-lg ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                                    }}
                                />
                            </div>
                        </div>}

                        {(props.asset?.repairStatus === "approved") && <div className="flex flex-row justify-between w-full gap-7">
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
                        </div>}

                        {(props.asset?.repairStatus === "rejected" || props.asset?.repairStatus === "done" || props.asset?.repairStatus === "cancelled") && <div className="flex flex-row justify-between w-full gap-7">
                            <div className="flex flex-col w-full">
                                <label className="font-semibold">Comments</label >
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
                        </div>}


                        <hr className="w-full"></hr>
                        {(props.asset?.repairStatus === "pending" || props.asset?.repairStatus === "approved") && <div className="flex w-full justify-end py-3 gap-2">
                            <button
                                type="submit"
                                className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                onClick={() => {
                                    props.asset?.repairStatus === "pending" ?
                                        setStats("rejected")
                                        : props.asset?.repairStatus === "approved" ? setStats("cancelled") : setStats("done")
                                }}
                            >
                                {
                                    props.asset?.repairStatus === "pending" ?
                                        "Reject"
                                        : props.asset?.repairStatus === "approved" ? "Cancel Repair" : "Confirm"
                                }
                            </button>
                            <button
                                type="submit"
                                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                                onClick={() => {
                                    props.asset?.repairStatus === "pending" ?
                                        setStats("approved")
                                        : setStats("done")
                                }}
                            >
                                {
                                    props.asset?.repairStatus === "pending" ?
                                        "Approve"
                                        : "Confirm"
                                }
                            </button>


                        </div>
                        }

                    </div>
                </div>
            </form >

            <Modal isVisible={isVisible} setIsVisible={setIsVisible} className="max-w-2xl" title="Transfer Complete" >
                <div className="px-4 py-2 flex flex-col w-full">
                    <div>
                        <p className="text-center text-lg font-semibold">Action is successful.</p>
                    </div>
                    <div className="flex justify-end py-2">
                        <button className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                            onClick={() => {
                                setIsVisible(false);
                                props.setCloseModal(false);
                            }}>Close</button>
                    </div>
                </div>
            </Modal>
        </div >
    );
}