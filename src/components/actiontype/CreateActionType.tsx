import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import Modal from "../headless/modal/modal"
import {
  AssetActionTypeCreateInput,
  AssetActionTypeUpdateInput,
} from "../../server/schemas/assetActionType"

export type ActionTypeForm = z.infer<typeof AssetActionTypeCreateInput>
type ActionType = {
  id: number
  name: string
  description: string | null
}

export const CreateActionType = (props: {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  selectedActionType?: ActionType
  onSubmit?: (data: ActionType) => void
  isSuccessVisible: boolean
  setIsSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>
  isUpdating?: boolean
}) => {
  const utils = trpc.useContext()

  useEffect(() => {
    if (props.selectedActionType && props.selectedActionType.id !== 0) {
      resetUpdate(props.selectedActionType as ActionType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedActionType])

  const {
    mutate,
    isLoading: isCreating,
    error,
  } = trpc.assetActionType.create.useMutation({
    onSuccess: () => {
      utils.assetActionType.findAll.invalidate()
      props.setIsSuccessVisible(true)
      reset()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActionTypeForm>({
    resolver: zodResolver(AssetActionTypeCreateInput),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<ActionType>({
    resolver: zodResolver(AssetActionTypeUpdateInput),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onValidSubmit = (data: ActionType) => {
    props?.onSubmit && props.onSubmit(data) // 🔁 call parent-provided onSubmit
  }

  const onSubmit = async (data: ActionTypeForm) => {
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
          props?.selectedActionType
            ? handleSubmitUpdate(onValidSubmit)
            : handleSubmit(onSubmit)
        }
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-full flex-col">
            <label className="sm:text-sm">Action Type Name*</label>
            <InputField
              register={props.selectedActionType ? registerUpdate : register}
              name="name"
              type={"text"}
              label={""}
              placeholder="Enter action type name"
            />
            <AlertInput>
              {props?.selectedActionType
                ? errors?.name?.message
                : errorsUpdate?.name?.message}
            </AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <label className="sm:text-sm">Description (Optional)</label>
          <textarea
            {...(props.selectedActionType
              ? registerUpdate("description")
              : register("description"))}
            className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-800 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
            placeholder="Enter description"
            rows={3}
          />
          <AlertInput>
            {props?.selectedActionType
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
              ? props.selectedActionType
                ? "Updating..."
                : "Creating..."
              : props.selectedActionType
              ? "Update Action Type"
              : "Create Action Type"}
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
            Action Type {props?.selectedActionType ? "Updated" : "Created"}{" "}
            successfully
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
