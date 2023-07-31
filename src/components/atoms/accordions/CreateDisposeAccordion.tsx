import { Accordion, Select, Textarea } from "@mantine/core"
import { useStepper } from "headless-stepper"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import {
  ArrowsExchange,
  Check,
  Checks,
  CircleNumber1,
  CircleNumber2,
  CircleNumber3,
  Search,
} from "tabler-icons-react"
import { z } from "zod/lib"
import { AssetDisposalCreateInput } from "../../../server/schemas/asset"
import { trpc } from "../../../utils/trpc"
import Modal from "../../headless/modal/modal"
import InputField from "../forms/InputField"
import { zodResolver } from "@hookform/resolvers/zod"
import { getAddress, getLifetime } from "../../../lib/functions"
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
    const list = disposalTypes?.disposalTypes.map((employee: { id: { toString: () => any }; name: any }) => {
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


  const [companyId, setCompanyId] = useState<string>("")
  const { data: companyData } = trpc.company.findAll.useQuery()

  useEffect(() => {
    setCompanyId(asset?.subsidiaryId?.toString() ?? "")

  }, [asset?.subsidiaryId])


  const company_address = useMemo(() => {
    if (companyId) {
      const address = companyData?.companies.filter(
        (company: { id: number }) => company.id === Number(companyId)
      )[0]
      return address ?? null
    }
  }, [companyId, companyData])

  const companyList = useMemo(
    () =>
      companyData?.companies
        .filter((item: { id: number }) => item.id != 0)
        .map((company: { id: { toString: () => any }; name: any }) => {
          return { value: company.id.toString(), label: company.name }
        }),
    [companyData]
  ) as SelectValueType[] | undefined

  // console.log(asset?.management?.purchase_date);

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
      {/* {state.currentStep === 0 && (
        <div className="w-full py-4">
          <div className="flex w-80 flex-row rounded-sm border border-[#F2F2F2] bg-[#F2F2F2] px-4 py-2">
            <input
              type="text"
              onChange={(event) => {
                setSearchAsset(event.currentTarget.value)
              }}
              placeholder="Search/Input Asset Number"
              className="w-[100%] bg-transparent text-sm outline-none focus:outline-none"
            />
            <button
              onClick={() => {
                setAssetNumber(searchAsset)
              }}
            >
              <Search className="bg-transparent outline-none focus:outline-none" />
            </button>
          </div>
        </div>
      )}
  

      <Modal
        className="max-w-lg"
        isVisible={searchModal}
        setIsVisible={setSearchModal}
        title="NOTICE!!"
      >
        <div className="py-2">
          <p className="text-center text-lg font-semibold">No Data Found!</p>
        </div>
      </Modal>
      <Modal
        className="max-w-lg"
        isVisible={validateModal}
        setIsVisible={setValidateModal}
        title="NOTICE!!"
      >
        <div className="py-2">
          <p className="text-center text-lg font-semibold">{validateString}</p>
        </div>
      </Modal> */}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {asset !== null && state.currentStep === 0 && (
          <div>
            <div className="rounded-md bg-white drop-shadow-lg">
              <div className="p-5">
                <Accordion multiple={true} defaultValue={['1', '2', '3']}>
                  {/* <Accordion.Item value="asset_details">
                                        <Accordion.Control>
                                            <div className="flex flex-row">
                                                <CircleNumber1 className="h-7 w-7" color="gold"></CircleNumber1>{" "}
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
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="number"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">Asset Name</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Alternate Asset Number
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="alt_number"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Parent Asset
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="parent.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-[60%] flex-col py-2">
                                                        <label className="font-semibold">Project</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="project.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-[60%] flex-col py-2">
                                                        <label className="font-semibold">Asset Type</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="model.type.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
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
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.depreciation_rule"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Asset Lifetime
                                                        </label>
                                                        <p className="my-2 w-full rounded-md border-2 border-gray-400  px-4 py-2  outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 bg-gray-200 text-gray-400">
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
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="serial_no"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item> */}

                  <Accordion.Item value={"1"} className="">
                    <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                      <div className=" flex items-center gap-2 text-gray-700">
                        {/* <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400 p-1 text-sm text-yellow-400">
                                                    1
                                                </div> */}
                        <CircleNumber1 className="h-7 w-7" color="gold"></CircleNumber1>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">Asset Information</p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="grid grid-cols-9 gap-7">
                        <div className="col-span-9 grid grid-cols-8 gap-7">
                          <div className="col-span-4">
                            <label className="text-sm">
                              Asset Number
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 ">
                              {asset?.number ?? ""}
                            </p>
                          </div>
                          <div className="col-span-4">
                            <label className="text-sm">
                              (Alternate Asset Number)
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 ">
                              {asset?.alt_number ?? ""}
                            </p>
                          </div>
                          {/* <div className="col-span-2">
                                                        <InputField
                                                            register={register}
                                                            required
                                                            name={"model.typeId"}
                                                            label="Type"
                                                            placeholder="Enter Asset Type"
                                                        />
                                                    </div> */}
                        </div>
                        <div className="col-span-3">
                          <label className="text-sm">
                            Serial Number
                          </label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 ">
                            {asset?.serial_no ?? ""}
                          </p>
                        </div>
                        <div className="col-span-6 grid grid-cols-9 gap-7">
                          <div className="col-span-3">
                            <label className="text-sm">
                              Parent Asset
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.parent?.name ?? ""}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <label className="text-sm">
                              Project
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.project?.name}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <label className="text-sm">
                              Vendor
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.vendor?.name ?? ""}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <label className="text-sm">
                            Model Name
                          </label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                            {asset?.model?.name ?? ""}
                          </p>
                        </div>
                        <div className="col-span-6 grid grid-cols-9 gap-7">
                          <div className="col-span-3">
                            <label className="text-sm">
                              Model Brand
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.model?.brand ?? ""}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <label className="text-sm">
                              Model Number
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.model?.number ?? ""}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <label className="text-sm">
                              Asset Lifetime
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.asset_lifetime}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-9 grid grid-cols-12 gap-7">
                          <div className="col-span-3">
                            <label className="text-sm">
                              Original Cost
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.original_cost}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <label className="text-sm">
                              Current Cost
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.current_cost}
                            </p>
                          </div>

                          <div className="col-span-3">
                            <label className="text-sm">
                              Residual Value
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.residual_value}
                            </p>
                          </div>
                          <div className=" col-span-3">
                            <label className="text-sm">
                              Residual Value Percentage
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.residual_percentage}
                            </p>
                          </div>

                        </div>





                        <div className="col-span-9">
                          {/* <textarea
                                                        value={asset?.description ?? ""}
                                                        readOnly
                                                        className="h-[100%] resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 w-[100%]"
                                                    >

                                                    </textarea> */}
                          <label className="text-sm">
                            Asset Description
                          </label>
                          <Textarea
                            value={asset?.description ?? ""}
                            // onChange={(event) => {
                            //     const text = event.currentTarget.value
                            //     setDescription(text)
                            //     setValue("description", text)
                            // }}
                            // placeholder="Asset Description"
                            label=""
                            minRows={6}
                            maxRows={6}
                            readOnly
                            classNames={{
                              input:
                                " w-full border-2 border-gray-400 outline-none focus:border-gray-400 cursor-default focus:outline-none focus:ring-0 mt-2 bg-gray-200 text-gray-400",
                              label:
                                "font-sans text-sm font-normal text-gray-600 text-light",
                            }}
                          />
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>

                  <Accordion.Item value={"2"} className="">
                    <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CircleNumber2 className="h-7 w-7" color="gold"></CircleNumber2>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          General Information
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="grid gap-7">
                        <div className="grid grid-cols-9 col-span-9 gap-7">
                          <div className="col-span-4">
                            <label className="text-sm">
                              Company
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.subsidiary?.name ?? ""}
                            </p>
                          </div>
                          <div className="col-span-8">
                            <label className="text-sm">
                              Company Address
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {company_address?.address
                                ? getAddress(company_address)
                                : ""}
                            </p>
                          </div>
                          <div className="col-span-12 grid grid-cols-12 gap-7">
                            <div className="col-span-3">
                              <label className="text-sm">
                                Department
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.department?.name ?? ""}
                              </p>
                            </div>
                            <div className="col-span-3">
                              <label className="text-sm">
                                Floor
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.department?.location?.floor ?? ""}
                              </p>
                            </div>
                            <div className="col-span-3">
                              <label className="text-sm">
                                Room
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.department?.location?.room ?? ""}
                              </p>
                            </div>
                            <div className="col-span-3">
                              <label className="text-sm">
                                Custodian
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.custodian?.name ?? ""}
                              </p>
                            </div>

                          </div>
                          <div className="col-span-12 grid grid-cols-12 gap-7 ">
                            <div className="col-span-2">
                              {/* <ClassTypeSelect
                                                                query={classId}
                                                                setQuery={setClassId}
                                                                required
                                                                name={"model.classId"}
                                                                setValue={setValue}
                                                                value={getValues("model.classId")?.toString()}
                                                                title={"Class"}
                                                                placeholder={"Select asset class"}
                                                                data={classList ?? []}
                                                            /> */}

                              <label className="text-sm">
                                Class
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.model?.class?.name ?? ""}
                              </p>
                            </div>
                            <div className="col-span-2">
                              {/* <ClassTypeSelect
                                                                disabled={!Boolean(classId)}
                                                                query={categoryId}
                                                                setQuery={setCategoryId}
                                                                required
                                                                name={"model.categoryId"}
                                                                setValue={setValue}
                                                                value={getValues("model.categoryId")?.toString()}
                                                                title={"Category"}
                                                                placeholder={
                                                                    !Boolean(classId)
                                                                        ? "Select asset class first"
                                                                        : "Select asset category"
                                                                }
                                                                data={categories ?? []}
                                                            /> */}

                              <label className="text-sm">
                                Category
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.model?.category?.name ?? ""}
                              </p>
                            </div>
                            <div className="col-span-2">
                              {/* <ClassTypeSelect
                                                                disabled={!Boolean(categoryId)}
                                                                query={typeId}
                                                                setQuery={setTypeId}
                                                                required
                                                                name={"model.typeId"}
                                                                setValue={setValue}
                                                                value={getValues("model.typeId")?.toString()}
                                                                title={"Type"}
                                                                placeholder={
                                                                    !Boolean(categoryId)
                                                                        ? "Select asset category first"
                                                                        : "Select asset type"
                                                                }
                                                                data={types ?? []}
                                                            /> */}

                              <label className="text-sm">
                                Type
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.model?.type?.name ?? ""}
                              </p>
                            </div>
                            <div className="col-span-6">
                              <label className="text-sm">
                                Class
                              </label>
                              <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                                {asset?.management?.asset_location ?? ""}
                              </p>
                            </div>

                          </div>
                        </div>
                        <div className="grid grid-cols-9 col-span-9 gap-7">
                          <div className="col-span-3">
                            {/* <TypeSelect
                                                            isString
                                                            name={"management.currency"}
                                                            setValue={setValue}
                                                            value={getValues("management.currency")}
                                                            title={"Currency"}
                                                            placeholder={"Select currency type"}
                                                            data={[
                                                                { value: "PHP", label: "Philippine Peso (Php)" },
                                                                { value: "USD", label: "US Dollar (USD)" },
                                                            ]}
                                                        />
                                                        <AlertInput>
                                                            {errors?.management?.currency?.message}
                                                        </AlertInput> */}

                            <label className="text-sm">
                              Currency
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.currency ?? ""}
                            </p>
                          </div>

                          <div className="col-span-3">
                            {/* <TypeSelect
                                                            isString
                                                            name={"management.accounting_method"}
                                                            setValue={setValue}
                                                            value={getValues("management.accounting_method")}
                                                            title={"Accounting Method"}
                                                            placeholder={"Select accounting method"}
                                                            data={[
                                                                "Accrual Basis",
                                                                "Cash Basis",
                                                                "Modified Cash Basis",
                                                            ]}
                                                        /> */}
                            {/* <AlertInput>
                                                            {errors?.management?.accounting_method?.message}
                                                        </AlertInput> */}

                            <label className="text-sm">
                              Accounting Method
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.accounting_method ?? ""}
                            </p>
                          </div>

                          <div className="col-span-3 space-y-2">
                            {/* <p className="text-sm text-gray-700">Purchase Date</p> */}
                            {/* <DatePicker
                                                            placeholder="Month Day, Year"
                                                            allowFreeInput
                                                            size="sm"
                                                            onChange={(value) => {
                                                                setValue("management.purchase_date", value)
                                                            }}
                                                            classNames={{
                                                                input:
                                                                    "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                                                            }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                                                        /> */}
                            <label className="text-sm">
                              Purchase Date
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.purchase_date?.toString() ?? ""}
                            </p>
                          </div>

                        </div>


                        <div className="col-span-9 grid grid-cols-6 gap-7">
                          <div className="col-span-2">
                            {/* <TypeSelect
                                                            isString
                                                            name={"management.depreciation_rule"}
                                                            setValue={setValue}
                                                            value={getValues("management.depreciation_rule")}
                                                            title={"Depreciation Method"}
                                                            placeholder={"Select method"}
                                                            data={["Straight Line", "Others"]}
                                                        />
                                                        <AlertInput>
                                                            {errors?.management?.depreciation_rule?.message}
                                                        </AlertInput> */}
                            <label className="text-sm">
                              Depreciation Rule
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.depreciation_rule ?? ""}
                            </p>
                          </div>
                          <div className="col-span-2 space-y-2">
                            {/* <p className="text-sm text-gray-700">
                                                            Depreciation Start Date
                                                        </p>
                                                        <DatePicker
                                                            placeholder="Month, Day, Year"
                                                            allowFreeInput
                                                            size="sm"
                                                            value={dep_start}
                                                            onChange={(value) => {
                                                                setDepStart(value)
                                                                setValue("management.depreciation_start", value)
                                                            }}
                                                            classNames={{
                                                                input:
                                                                    "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                                                            }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                                                        /> */}
                            <label className="text-sm">
                              Depreciation Start Date
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.depreciation_start?.toString() ?? ""}
                            </p>
                          </div>
                          <div className="col-span-2 space-y-2">
                            {/* <p className="text-sm text-gray-700">
                                                            Depreciation End Date
                                                        </p>
                                                        <DatePicker
                                                            placeholder={
                                                                dep_start
                                                                    ? "Month, Day, Year"
                                                                    : "Select start ffirst"
                                                            }
                                                            allowFreeInput
                                                            size="sm"
                                                            value={dep_end}
                                                            disabled={!Boolean(dep_start)}
                                                            minDate={dep_start ? dep_start : new Date()}
                                                            onChange={(value) => {
                                                                setDepEnd(value)
                                                                setValue("management.depreciation_end", value)
                                                            }}
                                                            classNames={{
                                                                input:
                                                                    "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                                                            }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                                                        /> */}
                            <label className="text-sm">
                              Depreciation End Date
                            </label>
                            <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                              {asset?.management?.depreciation_end?.toString() ?? ""}
                            </p>
                          </div>

                        </div>

                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>

                  <Accordion.Item value={"3"} className="">
                    <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CircleNumber3 className="h-7 w-7" color="gold"></CircleNumber3>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">Asset Usage</p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="grid grid-cols-9 col-span-9 gap-7">
                        <div className="col-span-3 space-y-2">
                          <label className="text-sm">
                            Date of Usage
                          </label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                            {asset?.management?.depreciation_start?.toString() ?? ""}
                          </p>
                        </div>
                        <div className="col-span-3">
                          <label className="text-sm">
                            Period
                          </label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                            {asset?.management?.depreciation_period}
                          </p>
                        </div>
                        {/* <div className="col-span-3">
                          <label className="text-sm">
                            Asset Quantity
                          </label>
                          <p className="my-2 h-11 w-full rounded-md border-2 border-gray-400 bg-gray-200 px-4 py-2 text-gray-600  outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 truncate">
                            {asset?.management?.asset_quantity ?? ""}
                          </p>
                        </div> */}
                        <div className="col-span-9">
                          <Textarea
                            value={asset?.remarks ?? ""}
                            // onChange={(event) => {
                            //     const text = event.currentTarget.value
                            //     setDescription(text)
                            //     setValue("description", text)
                            // }}
                            // placeholder="Asset Description"
                            label="Remarks"
                            minRows={6}
                            maxRows={6}
                            readOnly
                            classNames={{
                              input:
                                " w-full border-2 border-gray-400 outline-none focus:border-gray-400 cursor-default focus:outline-none focus:ring-0 mt-2 bg-gray-200 text-gray-400",
                              label:
                                "font-sans text-sm font-normal text-gray-600 text-light",
                            }}
                          />
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
        title="Dispose Asset"
      >
        <div className="flex w-full flex-col px-4 pt-2">
          <div>
            <p className="text-center text-lg font-semibold">
              Asset successfully added to disposal.
            </p>
          </div>
          <div className="pt-5 flex justify-end py-2">
            <Link href={"/transactions/disposal"}>
              <button onClick={resetDisposeAsset} className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500">
                Return
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CreateDisposeAccordion
