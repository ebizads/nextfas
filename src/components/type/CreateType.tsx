import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import Modal from "../headless/modal/modal"
import { AssetTypeCreateInput } from "../../server/schemas/assetType"

export type TypeForm = z.infer<typeof AssetTypeCreateInput>

export const CreateType = (props: {
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>> // Make optional
    isLoading?: boolean // Make optional
    typeId?: string // Make optional
}) => {
    const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false)
    const utils = trpc.useContext()

    const {
        mutate,
        isLoading: isCreating,
        error,
    } = trpc.assetType.create.useMutation({
        onSuccess: () => {
            utils.assetType.findAll.invalidate()
            setIsSuccessVisible(true)
            reset()
        },
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TypeForm>({
        resolver: zodResolver(AssetTypeCreateInput),
        defaultValues: {
            name: "",
            description: "",
        }
    })

    const onSubmit = async (data: TypeForm) => {
        mutate({
            name: data.name,
            description: data.description,
        })
    }

    const onDiscard = () => {
        props.setIsVisible(false)
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
                    <div className="flex w-full flex-col">
                        <label className="sm:text-sm">Type Name</label>
                        <InputField
                            register={register}
                            name="name"
                            type={"text"}
                            label={""}
                            placeholder="Enter type name"
                        />
                        <AlertInput>{errors?.name?.message}</AlertInput>
                    </div>
                </div>

                <div className="flex w-full flex-col">
                    <label className="sm:text-sm">Description (Optional)</label>
                    <textarea
                        {...register("description")}
                        className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-800 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                        placeholder="Enter description"
                        rows={3}
                    />
                    <AlertInput>{errors?.description?.message}</AlertInput>
                </div>

                <hr className="w-full" />
                <div className="flex w-full justify-end gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 font-medium underline"
                        onClick={onDiscard}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded bg-tangerine-500 px-4 py-2 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                        disabled={isCreating}
                    >
                        {isCreating ? "Creating..." : "Create Type"}
                    </button>
                </div>
            </form>

            {error && (
                <pre className="mt-2 text-sm italic text-red-500">
                    Something went wrong! {error.message}
                </pre>
            )}

            <Modal
                className="max-w-lg"
                isVisible={isSuccessVisible}
                setIsVisible={setIsSuccessVisible}
                title="Success!"
            >
                <div className="flex flex-col items-center gap-3 py-2">
                    <p className="text-center text-lg font-semibold">
                        Type created successfully
                    </p>
                    <button
                        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400"
                        onClick={() => {
                            props.setIsVisible(false)
                            setIsSuccessVisible(false)
                        }}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    )
}