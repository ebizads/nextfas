import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import Modal from "../headless/modal/modal"
import {
  AssetTypeCreateInput,
  AssetTypeUpdateInput,
} from "../../server/schemas/assetType"

export type TypeForm = z.infer<typeof AssetTypeCreateInput>
type Type = {
  id: number
  name: string
  description: string | null
}

export const CreateType = (props: {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  selectedType?: Type
  onSubmit?: (data: Type) => void
  isSuccessVisible: boolean
  setIsSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>
  isUpdating?: boolean
}) => {
  const utils = trpc.useContext()

  const {
    mutate,
    isLoading: isCreating,
    error,
  } = trpc.assetType.create.useMutation({
    onSuccess: () => {
      utils.assetType.findAll.invalidate()
      props.setIsSuccessVisible(true)
      reset()
    },
  })

  useEffect(() => {
    if (props.selectedType && props.selectedType.id !== 0) {
      resetUpdate(props.selectedType as Type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedType])

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<TypeForm>({
    resolver: zodResolver(AssetTypeCreateInput),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onValidSubmit = (data: Type) => {
    props?.onSubmit && props.onSubmit(data) // 🔁 call parent-provided onSubmit
  }

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<Type>({
    resolver: zodResolver(AssetTypeUpdateInput),
    defaultValues: {
      name: "",
      description: "",
    },
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
    resetUpdate()
  }

  return (
    <div>
      <form
        onSubmit={
          props.selectedType
            ? handleSubmitUpdate(onValidSubmit)
            : handleSubmit(onSubmit)
        }
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-full flex-col">
            <label className="sm:text-sm">Type Name</label>
            <InputField
              register={props.selectedType ? registerUpdate : register}
              name="name"
              type={"text"}
              label={""}
              placeholder="Enter type name"
            />
            <AlertInput>
              {props?.selectedType
                ? errors?.name?.message
                : errorsUpdate?.name?.message}
            </AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <label className="sm:text-sm">Description (Optional)</label>
          <textarea
            {...(props.selectedType
              ? registerUpdate("description")
              : register("description"))}
            name="description"
            className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-800 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            placeholder="Enter description"
            rows={3}
          />
          <AlertInput>
            {props?.selectedType
              ? errors?.description?.message
              : errorsUpdate?.description?.message}
          </AlertInput>
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
            disabled={isCreating || props.isUpdating}
          >
            {isCreating || props.isUpdating
              ? props.selectedType
                ? "Updating..."
                : "Creating..."
              : props.selectedType
              ? "Update Type"
              : "Create Type"}
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
        isVisible={props.isSuccessVisible}
        setIsVisible={props.setIsSuccessVisible}
        title="Success!"
      >
        <div className="flex flex-col items-center gap-3 py-2">
          <p className="text-center text-lg font-semibold">
            Type {props?.selectedType ? "Updated" : "Created"} Successfully
          </p>
          <button
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400"
            onClick={() => {
              props.setIsVisible(false)
              props.setIsSuccessVisible(false)
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
