import { Accordion, Select } from "@mantine/core"
import { useStepper } from "headless-stepper"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import {
  ArrowsExchange,
  Check,
  Checks,
  Circle1,
  Circle2,
  Circle3,
  Search,
} from "tabler-icons-react"
import { z } from "zod/lib"
import { AssetDisposalCreateInput } from "../../../server/schemas/asset"
import { trpc } from "../../../utils/trpc"
import Modal from "../../headless/modal/modal"
import InputField from "../forms/InputField"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLifetime } from "../../../lib/functions"
import { DatePicker } from "@mantine/dates"
import { SelectValueType } from "../select/TypeSelect"
import Link from "next/link"
import AlertInput from "../forms/AlertInput"
import { useDisposeAssetStore } from "../../../store/useStore"
// import { AssetFieldValues } from "../../../types/generic"

export type Dispose = z.infer<typeof AssetDisposalCreateInput>

const CreateDisposeAccordion = () => {
  const [assetNumber, setAssetNumber] = useState<string>("")
  const [searchAsset, setSearchAsset] = useState<string>("")
  const [validateString, setValidateString] = useState<string>("")

  const [assetId, setAssetId] = useState<number>(0)

  const [searchModal, setSearchModal] = useState<boolean>(false)
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [validateModal, setValidateModal] = useState<boolean>(false)

  const [disposeDate, setDisposeDate] = useState<Date>(new Date())
  const [completionDate, setCompletionDate] = useState<Date>(new Date())

  const [selectedType, setSelectedType] = useState<string>("1")

  const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase())
  const { data: disposalTypes } = trpc.disposalType.findAll.useQuery()

  const { disposeAsset, setDisposeAsset } = useDisposeAssetStore()


  //const utils = trpc.useContext()

  const disposalTypeList = useMemo(() => {
    const list = disposalTypes?.disposalTypes.map((employee) => {
      return { value: employee.id.toString(), label: employee.name }
    }) as SelectValueType[]
    return list ?? []
  }, [disposalTypes]) as SelectValueType[]

  const { mutate } = trpc.assetDisposal.create.useMutation({
    onSuccess() {
      setCompleteModal(true)
      // invalidate query of asset id when mutations is successful
      // utils.asset.findAll.invalidate()
    },
  })

  const updateAsset = trpc.asset.edit.useMutation({
    onSuccess() {
      console.log("omsim")
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Dispose>({
    resolver: zodResolver(AssetDisposalCreateInput),
    defaultValues: {
      disposalTypeId: Number(selectedType),
    },
  })

  const onSubmit = (dispose: Dispose) => {
    mutate({
      ...dispose,
      assetId: asset?.id ?? 0,
      disposalTypeId: Number(selectedType) ?? 0,
      disposalStatus: "pending",
    })

    updateAsset.mutate({
      ...asset,
      id: asset?.id ?? 0,
      status: "disposal",
    })

    reset()
  }

  useEffect(() => {
    getValues("disposalTypeId") === 1
      ? setValue("customerName", "")
      : resetField("customerName")
    getValues("disposalTypeId") === 1
      ? setValue("telephoneNo", "")
      : resetField("telephoneNo")
    getValues("disposalTypeId") === 1
      ? setValue("apInvoice", "")
      : resetField("apInvoice")
    getValues("disposalTypeId") === 1
      ? setValue("salesInvoice", "")
      : resetField("salesInvoice")
    getValues("disposalTypeId") === 1
      ? setValue("agreedPrice", 0)
      : resetField("agreedPrice")
    getValues("disposalTypeId") === 1
      ? setValue("disposalPrice", 0)
      : resetField("disposalPrice")
    getValues("disposalTypeId") === 1
      ? setValue("tradedItem", "")
      : resetField("tradedItem")
  }, [getValues, resetField, setValue, selectedType])

  useEffect(() => {
    setValue("assetId", asset?.id ?? 0)
  }, [setValue, asset])

  useEffect(() => {
    setAssetId(asset?.id ?? 0)
  }, [assetNumber, asset])

  useEffect(() => {
    setAssetNumber(disposeAsset?.number ?? "")
  }, [setAssetNumber, disposeAsset])


  const steps = useMemo(
    () => [
      {
        label: "Check Asset Details",
        icon: (
          <>
            <i className="fa-solid fa-info text-white" />
          </>
        ),
      },
      {
        label: "Dispose Asset",
        icon: (
          <>
            {" "}
            <ArrowsExchange size={25} strokeWidth={2} color={"#E0E0E0 "} />
          </>
        ),
      },
      {
        label: "Confirmation",
        icon: (
          <>
            {" "}
            <Checks size={25} strokeWidth={2} color={"#E0E0E0 "} />
          </>
        ),
      },
    ],
    []
  )

  const { state, stepperProps, stepsProps, nextStep, prevStep } = useStepper({
    steps,
  })

  const resetDisposeAsset = () => {
    setDisposeAsset(null)
    console.log("dapat wala na")
  }

  return (
    <div className="px-4">
      <div>
        <nav className="w-100 my-4 grid grid-cols-6" {...stepperProps}>
          <ol className="z-1 col-span-full flex flex-row">
            {stepsProps?.map((step, index) => (
              <li
                className={`flex justify-center ${index !== 2 ? "w-full" : ""}`}
                key={index}
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center gap-4">
                    {state.currentStep > index ? (
                      <span
                        className={`border-full flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors ease-in-out group-focus:ring-2 group-focus:ring-offset-2 ${state?.currentStep >= index
                          ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                          : ""
                          }`}
                      >
                        <Check size={25} strokeWidth={2} />
                      </span>
                    ) : (
                      <span
                        className={`border-full flex h-8 w-8 items-center justify-center rounded-full border bg-white text-black ring-tangerine-500 transition-colors ease-in-out group-focus:ring-2 group-focus:ring-offset-2 ${state?.currentStep >= index
                          ? "bg-[#B45309] text-white ring-2 ring-offset-2"
                          : ""
                          }`}
                      >
                        {steps[index]?.icon}
                      </span>
                    )}

                    {
                      <div
                        className={`mr-4 h-2 flex-1 rounded border ${index !== 2 ? "" : "invisible"
                          } ${state?.currentStep > index
                            ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                            : "bg-[#ECECEC]"
                          }`}
                      />
                    }
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">Step {index + 1}</span>
                    <span className="font-bold">{steps[index]?.label}</span>

                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {asset !== null && state.currentStep === 0 && (
          <div>
            <div className="rounded-md bg-white drop-shadow-lg">
              <div className="p-5">
                <Accordion multiple={true} defaultValue={['asset_details', 'general_information', 'asset_usage_info']}>
                  <Accordion.Item value="asset_details">
                    <Accordion.Control>
                      <div className="flex flex-row">
                        <Circle1 className="h-7 w-7" color="gold"></Circle1>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          Asset Details
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="flex flex-wrap py-2">
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Asset Number
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.number ?? ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">Asset Name</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.name ?? ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Alternate Asset Number
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.alt_number ?? ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Parent Asset
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.parent?.name ?? ""}
                            </p>
                          </div>
                          <div className="flex w-[60%] flex-col py-2">
                            <label className="font-semibold">Project</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.project?.name ?? ""}
                            </p>
                          </div>
                          <div className="flex w-[60%] flex-col py-2">
                            <label className="font-semibold">Asset Type</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.model?.type?.name ?? ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-[60%] flex-col py-2">
                            <label className="font-semibold">
                              Asset Description
                            </label>
                            <textarea
                              value={asset?.description ?? ""}
                              readOnly
                              className="resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                            ></textarea>
                          </div>
                        </div>
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Accounting Method
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.depreciation_rule ?? ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Asset Lifetime
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {getLifetime(
                                asset?.management?.depreciation_start ??
                                new Date(),
                                asset?.management?.depreciation_end ??
                                new Date()
                              )}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Asset Serial Number
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.number ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>

                  <Accordion.Item value="general_information">
                    <Accordion.Control>
                      <div className="flex flex-row">
                        <Circle2 className="h-7 w-7" color="gold"></Circle2>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          General Information
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="flex flex-wrap py-2">
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">Subsidiary</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.subsidiary?.name ?? ""}
                            </p>
                          </div>

                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">Custodian</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.custodian?.name ?? ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Purchase Date
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.purchase_date?.toString() ??
                                ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">Department</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.department?.name ?? ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">Class</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.model?.class?.name ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>

                  <Accordion.Item value="asset_usage_info">
                    <Accordion.Control>
                      <div className="flex flex-row">
                        <Circle3 className="h-7 w-7" color="gold"></Circle3>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          Asset Usage Information
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="flex flex-wrap py-2">
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Depreciation Start Date
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.depreciation_start?.toString() ??
                                ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Depreciation End Date
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.depreciation_end?.toString() ??
                                ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">Period</label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.depreciation_period ?? ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Original Cost
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.original_cost ?? ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Current Cost
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.current_cost ?? ""}
                            </p>
                          </div>
                          <div className="flex w-full flex-col py-2">
                            <label className="font-semibold">
                              Depreciation Method
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                              {asset?.management?.depreciation_rule ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                        <div className="flex w-full flex-col py-2">
                          <label className="font-semibold">Currency</label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                            {asset?.management?.currency ?? ""}
                          </p>
                        </div>
                        <div className="flex w-full flex-col py-2">
                          <label className="font-semibold">
                            Residual Value
                          </label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                            {asset?.management?.residual_value ?? ""}
                          </p>
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>

                <hr className="w-full"></hr>
                <div className="align-center flex w-full flex-col justify-center gap-4 py-3">
                  <div className="flex w-full justify-center gap-3">
                    <button
                      type="button"
                      className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex w-full justify-center">
                    <button
                      type="button"
                      className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={resetDisposeAsset}
                    >
                      Cancel Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {state.currentStep === 1 && (
          <div>
            <div className="rounded-md bg-white drop-shadow-lg">
              <div className="p-5">
                <div className="flex w-full flex-row justify-between gap-7 py-2">
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Method of Disposal</label>
                    <Select
                      placeholder="Pick one"
                      onChange={(value) => {
                        setSelectedType(value ?? "")
                        setValue("disposalTypeId", Number(value))
                        console.log(value)
                      }}
                      value={selectedType}
                      data={disposalTypeList}
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
                      className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Disposal Date</label>
                    <DatePicker
                      onChange={(value) => {
                        setDisposeDate(value as Date)
                        setValue("disposalDate", value as Date)
                      }}
                      value={disposeDate}
                      minDate={new Date()}
                      dropdownType="modal"
                      placeholder="Pick Date"
                      size="sm"
                      variant="unstyled"
                      className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                    />
                  </div>
                </div>
                {/* <div className="flex w-full flex-row justify-between gap-7 py-2">
                  <div className="flex w-full flex-col">
                    
                  </div>
                  <div className="flex w-full flex-col">

                  </div>
                </div> */}
                {
                  selectedType !== "1" &&
                  (<div className="flex w-full flex-row justify-between gap-7 py-2">
                    <div className="flex w-full flex-col">
                      <label className="font-semibold">Customer Name</label>
                      <InputField
                        register={register}
                        name="customerName"
                        type={"text"}
                        label={""}
                      />
                    </div>
                    <div className="flex w-full flex-col">
                      <label className="font-semibold">Telephone No.</label>
                      <InputField
                        register={register}
                        name="telephoneNo"
                        type={"text"}
                        label={""}
                      />
                    </div>
                  </div>)
                }
                {(selectedType !== "1" && selectedType !== "3") && (
                  <div>

                    <div className="flex w-full flex-row justify-between gap-7 py-2">
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">
                          AP Invoice Number
                        </label>
                        <InputField
                          register={register}
                          name="apInvoice"
                          type={"text"}
                          label={""}
                        />
                      </div>

                      <div className="flex w-full flex-col">
                        <label className="font-semibold">
                          Sale Invoice Number
                        </label>
                        <InputField
                          register={register}
                          name="salesInvoice"
                          type={"text"}
                          label={""}
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-row justify-between gap-7 py-2">
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">Disposal Price</label>
                        <InputField
                          register={register}
                          name="disposalPrice"
                          type={"number"}
                          label={""}
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">Agreed Price</label>
                        <InputField
                          register={register}
                          name="agreedPrice"
                          type={"number"}
                          label={""}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {
                  (selectedType !== "1" && selectedType !== "2") &&
                  <div className="flex w-full flex-row justify-between gap-7 py-2">
                    <div className="flex w-full flex-col">
                      <label className="font-semibold">Traded Items</label>
                      <InputField
                        register={register}
                        name="tradedItems"
                        type={"text"}
                        label={""}
                      />
                      <AlertInput>{errors?.tradedItem?.message}</AlertInput>
                    </div>

                  </div>
                }
                <hr className="w-full"></hr>
                <div className="align-center flex w-full flex-col justify-center gap-4 py-3">
                  <div className="flex w-full justify-center gap-3">
                    <button
                      type="button"
                      className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex w-full justify-center">
                    <button
                      type="button"
                      className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={resetDisposeAsset}
                    >
                      Cancel Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {state.currentStep === 2 && (
          <div>
            <div className="rounded-md bg-white drop-shadow-lg">
              <div className="p-7">
                <div className="flex w-full flex-row justify-between gap-7">
                  <div className="flex w-full flex-col py-2">
                    <label className="font-semibold">Asset Number</label>
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {asset?.number ?? ""}
                    </p>
                  </div>
                  <div className="flex w-full flex-col py-2">
                    <label className="font-semibold">Asset Name</label>
                    <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2">
                      {asset?.name ?? ""}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-row justify-between gap-7 py-2">
                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Method of Disposal</label>
                    <Select
                      disabled
                      placeholder="Pick one"
                      onChange={(value) => {
                        setSelectedType(value ?? "")
                        setValue("disposalTypeId", Number(value))
                        console.log(value)
                      }}
                      value={selectedType}
                      data={disposalTypeList}
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
                      className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <label className="font-semibold">Disposal Date</label>
                    <DatePicker
                      disabled
                      value={disposeDate}
                      minDate={new Date()}
                      dropdownType="modal"
                      placeholder="Pick Date"
                      size="sm"
                      variant="unstyled"
                      className="mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                    />
                    <AlertInput>{errors?.disposalDate?.message}</AlertInput>
                  </div>
                </div>
                {selectedType !== "1" && (
                  <div>
                    <div className="flex w-full flex-row justify-between gap-7 py-2">
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">Customer Name</label>
                        <InputField
                          disabled
                          register={register}
                          name="customerName"
                          type={"text"}
                          label={""}
                        />
                        <AlertInput>{errors?.customerName?.message}</AlertInput>
                      </div>
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">Telephone No.</label>
                        <InputField
                          disabled
                          register={register}
                          name="telephoneNo"
                          type={"text"}
                          label={""}
                        />
                        <AlertInput>{errors?.telephoneNo?.message}</AlertInput>
                      </div>
                    </div>

                  </div>
                )}
                {
                  (selectedType !== "1" && selectedType !== "3") &&
                  <div>
                    <div className="flex w-full flex-row justify-between gap-7 py-2">
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">
                          AP Invoice Number
                        </label>
                        <InputField
                          disabled
                          register={register}
                          name="apInvoice"
                          type={"text"}
                          label={""}
                        />
                        <AlertInput>{errors?.apInvoice?.message}</AlertInput>
                      </div>
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">
                          Sale Invoice Number
                        </label>
                        <InputField
                          disabled
                          register={register}
                          name="salesInvoice"
                          type={"text"}
                          label={""}
                        />
                        <AlertInput>{errors?.salesInvoice?.message}</AlertInput>
                      </div>
                    </div>
                    <div className="flex w-full flex-row justify-between gap-7 py-2">
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">Disposal Price</label>
                        <InputField
                          disabled
                          register={register}
                          name="disposalPrice"
                          type={"number"}
                          label={""}
                        />
                        <AlertInput>
                          {errors?.disposalPrice?.message}
                        </AlertInput>
                      </div>
                      <div className="flex w-full flex-col">
                        <label className="font-semibold">Agreed Price</label>
                        <InputField
                          disabled
                          register={register}
                          name="agreedPrice"
                          type={"number"}
                          label={""}
                        />
                        <AlertInput>{errors?.agreedPrice?.message}</AlertInput>
                      </div>
                    </div>
                  </div>
                }
                {
                  (selectedType !== "1" && selectedType !== "2") &&
                  <div className="flex w-full flex-row justify-between gap-7 py-2">
                    <div className="flex w-full flex-col">
                      <label className="font-semibold">Traded Items</label>
                      <InputField
                        disabled
                        register={register}
                        name="tradedItems"
                        type={"text"}
                        label={""}
                      />
                      <AlertInput>{errors?.tradedItem?.message}</AlertInput>
                    </div>

                  </div>
                }

                <hr className="w-full"></hr>
                {/* <div className="flex w-full justify-between py-3">
                  <button
                    type="button"
                    className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                    onClick={prevStep}
                  >
                    Previous
                  </button>

                  <button
                    type="submit"
                    className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Dispose
                  </button>
                </div> */}
                <div className="align-center flex w-full flex-col justify-center gap-4 py-3">
                  <div className="flex w-full justify-center gap-3">
                    <button
                      type="button"
                      className="rounded bg-tangerine-700 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      Dispose
                    </button>
                  </div>
                  <div className="flex w-full justify-center">
                    <button
                      type="button"
                      className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={resetDisposeAsset}
                    >
                      Cancel Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
      <Modal
        isVisible={completeModal}
        setIsVisible={setCompleteModal}
        className="max-w-2xl"
        title="Asset Disposed"
      >
        <div className="flex w-full flex-col px-4 py-2">
          <div>
            <p className="text-center text-lg font-semibold">
              Asset successfully added to disposal.
            </p>
          </div>
          <div className="flex justify-end py-2">
            <Link href={"/assets"}>
              <button className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500">
                Return to assets tab
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CreateDisposeAccordion
