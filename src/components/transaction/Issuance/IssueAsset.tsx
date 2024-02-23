import React, { useEffect, useState, useMemo } from "react"
import { useStepper } from "headless-stepper"
import {
  ArrowsExchange,
  Check,
  Checks,
  CircleNumber1,
  CircleNumber2,
  CircleNumber3,
} from "tabler-icons-react"
import { Accordion, Checkbox, Select, Textarea } from "@mantine/core"
import { trpc } from "../../../utils/trpc"
import { InputField } from "../../atoms/forms/InputField"
import { zodResolver } from "@hookform/resolvers/zod"
import { initialIssuance } from "../../../server/schemas/issuance"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { SelectValueType } from "../../atoms/select/TypeSelect"
import { getAddress, getLifetime } from "../../../lib/functions"
import Modal from "../../headless/modal/modal"
import Link from "next/link"
import { useTransferAssetStore } from "../../../store/useStore"
import { DatePicker } from "@mantine/dates"
import { AssetTransfer } from "@prisma/client"
import { AssetTransferValues } from "../../../types/generic"
import { stringify } from "superjson"
import { useSession } from "next-auth/react"
import router from "next/router"
export type Issuance = z.infer<typeof initialIssuance>

const Issue = ({}) => {
  const [assetNumber, setAssetNumber] = useState<string>("")
  const [searchAsset, setSearchAsset] = useState<string>("")
  const [userId, setUserId] = useState<number>(0)
  const { data: session } = useSession()
  const [issuedTo, setIssuedTo] = useState<number>(0)

  const [checked, setChecked] = useState(false)

  const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase())
  const { data: departmentData } = trpc.department.findAll.useQuery()

  const [selectedDept, setSelectedDept] = useState<string>("")
  const [selectedEMP, setSelectedEMP] = useState<string>("")

  const [selectedCustodian, setSelectedCustodian] = useState<string>("")

  const [searchModal, setSearchModal] = useState<boolean>(false)
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [validateModal, setValidateModal] = useState<boolean>(false)

  const [validateString, setValidateString] = useState<string>("")

  const { data: employeeData } = trpc.employee.findAll.useQuery({
    search: {
      team: {
        department: {
          id: Number(selectedDept) ?? 0,
        },
      },
    },
  })

  const { data: employee } = trpc.employee.findOne.useQuery(Number(selectedEMP))
  const { data: department } = trpc.department.findOne.useQuery(
    Number(selectedDept)
  )

  const employeeList = useMemo(() => {
    const list = employeeData?.employees.map((employee) => {
      return {
        value: employee.id.toString(),
        label: employee.name,
        emp_id: employee.employee_id,
      }
    }) as SelectValueType[]
    return list ?? []
  }, [employeeData]) as SelectValueType[]

  const departmentList = useMemo(() => {
    const list = departmentData?.departments.map((department) => {
      return { value: department.id.toString(), label: department.name }
    }) as SelectValueType[]
    return list ?? []
  }, [departmentData]) as SelectValueType[]

  useMemo(() => {
    if (asset === null && assetNumber !== "") {
      setSearchModal(true)
    }
  }, [asset, assetNumber])

  // const utils = trpc.useContext()

  const { mutate } = trpc.assetIssuance.create.useMutation({
    onSuccess() {
      setCompleteModal(true)
      // invalidate query of asset id when mutations is successful
      // utils.assetTransfer.findAll.invalidate()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Issuance>({
    resolver: zodResolver(initialIssuance),
  })

  useEffect(() => {
    setUserId(Number(session?.user?.id))
  }, [session?.user?.id])

  // useEffect(() => reset(asset as unknown as Issuance), [asset, reset])

  // const onSubmit = (asset: Issuance) => {
  //     // Register function
  //     console.log("oms")
  //     mutate({
  //         ...asset,
  //         departmentId: asset.departmentId ?? 2,
  //         custodianId: asset.custodianId ?? 2,
  //     })
  //     reset()
  // }

  const updateAsset = trpc.asset.edit.useMutation({
    onSuccess() {
      console.log("omsim")
    },
  })

  const onSubmit = (issue: Issuance) => {
    if (
      asset?.status === null ||
      asset?.status === undefined ||
      asset?.status === ""
    ) {
      mutate({
        ...issue,
        issuanceDate: transfer_date,
        issuanceStatus: "done",
        assetId: asset?.id ?? 0,
      })
      console.log(asset, "asset  mo to")
      updateAsset.mutate({
        ...asset,
        id: asset?.id ?? 0,
        custodianId: Number(selectedEMP),
        pastIssuanceId: asset?.issuedToId ?? 0,
        issuedToId: issuedTo,
        issuedById: userId,
        assetTagId: asset?.assetTagId ?? 0,
        management: {
          id: asset?.management?.id ?? 0,
        },
      })
      reset()
    } else {
      if (asset?.status === "disposal") {
        setValidateString("The asset is in for disposal")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.status === "repair") {
        setValidateString("The asset is in for repair.")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.status === "transfer") {
        setValidateString("The asset is being transferred.")
        setValidateModal(true)
        setAssetNumber("")
      } else if (asset?.status === "issuance") {
        setValidateString("The asset is being issued.")
        setValidateModal(true)
        setAssetNumber("")
      }
    }
  }

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
        label: "Issue Asset",
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

  const { transferAsset, setTransferAsset } = useTransferAssetStore()

  const resetTransferAsset = () => {
    router.push("/assets")
    setTransferAsset(null)
    console.log("dapat wala na")
  }

  const [companyId, setCompanyId] = useState<string>("")
  const { data: companyData } = trpc.company.findAll.useQuery()

  useEffect(() => {
    setAssetNumber(transferAsset?.number ?? "")
    setCompanyId(asset?.subsidiaryId?.toString() ?? "")
  }, [asset?.subsidiaryId, transferAsset?.number])

  const company_address = useMemo(() => {
    if (companyId) {
      const address = companyData?.companies.filter(
        (company: { id: number }) => company.id === Number(companyId)
      )[0]
      return address ?? null
    }
  }, [companyId, companyData])

  const [transfer_date, setTransfer_date] = useState<Date | null>(null)

  // console.log(company_address);
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
                        className={`border-full flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors ease-in-out group-focus:ring-2 group-focus:ring-offset-2 ${
                          state?.currentStep >= index
                            ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                            : ""
                        }`}
                      >
                        <Check size={25} strokeWidth={2} />
                      </span>
                    ) : (
                      <span
                        className={`border-full flex h-8 w-8 items-center justify-center rounded-full border bg-white text-black ring-tangerine-500 transition-colors ease-in-out group-focus:ring-2 group-focus:ring-offset-2 ${
                          state?.currentStep >= index
                            ? "bg-[#B45309] text-white ring-2 ring-offset-2"
                            : ""
                        }`}
                      >
                        {steps[index]?.icon}
                      </span>
                    )}

                    {
                      <div
                        className={`mr-4 h-2 flex-1 rounded border ${
                          index !== 2 ? "" : "invisible"
                        } ${
                          state?.currentStep > index
                            ? "bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 text-white"
                            : "bg-[#ECECEC]"
                        }`}
                      />
                    }
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">Step {index + 1}</span>
                    <span className="font-bold">{steps[index]?.label}</span>
                    {/* <div>
                                        {state.currentStep >= index ? <span className="rounded-3xl border px-2 text-sm bg-[#FEF3C7] border-[#FEF3C7] text-[#F59E0B]">{state.currentStep === index ? "Ongoing" : "Completed"}</span>
                                            : <span className="rounded-3xl border px-2 text-sm border-[#0f1a2a86] text-[#0f1a2a86]">Pending</span>}
                                    </div> */}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

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
      </Modal>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        {asset !== null && state.currentStep === 0 && (
          <div>
            <div className="rounded-md bg-white drop-shadow-lg">
              <div className="p-5">
                <Accordion multiple={true} defaultValue={["1", "2", "3"]}>
                  <Accordion.Item value={"1"} className="">
                    <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                      <div className=" flex items-center gap-2 text-gray-700">
                        {/* <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400 p-1 text-sm text-yellow-400">
                                                    1
                                                </div> */}
                        <CircleNumber1
                          className="h-7 w-7"
                          color="gold"
                        ></CircleNumber1>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          Asset Information
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="grid grid-cols-9 gap-7">
                        <div className="col-span-9 grid grid-cols-9 gap-7">
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Name"
                              name="name"
                              placeholder={asset?.name}
                              // className="placeholder:font-semibold"
                              disabled
                              // required
                            />
                            {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Alternate Asset Number"
                              placeholder={
                                asset?.alt_number == "" || null || undefined
                                  ? "--"
                                  : asset?.alt_number ?? "--"
                              }
                              name="alt_number"
                              disabled
                            />
                            {/* <AlertInput>{errors?.alt_number?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Tag"
                              name="asset_num"
                              placeholder={asset?.assetTag?.name}
                              // className="placeholder:font-semibold"
                              disabled
                              // required
                            />
                            {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                          </div>{" "}
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
                          <InputField
                            register={register}
                            label="Serial Number"
                            placeholder={asset?.serial_no ?? "--"}
                            name="serial_no"
                            disabled
                          />
                          {/* <AlertInput>{errors?.serial_no?.message}</AlertInput> */}
                        </div>
                        <div className="col-span-6 grid grid-cols-9 gap-7">
                          <div className="col-span-3">
                            <InputField
                              name={"parentId"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("parentId")?.toString()}
                              label={"Parent Asset"}
                              placeholder={
                                asset?.parentId === 0 || null
                                  ? "--"
                                  : asset?.project?.name
                              }
                              // data={assetsList ?? []}
                              disabled
                            />
                            {/* <AlertInput>{errors?.parentId?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              name={"assetProjectId"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("assetProjectId")?.toString()}
                              label={"Project"}
                              placeholder={
                                asset?.assetProjectId === 0 || null
                                  ? "--"
                                  : asset?.project?.name
                              }
                              // data={projectsList ?? []}
                              disabled
                            />
                            {/* <AlertInput>{errors?.assetProjectId?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              name={"vendorId"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("vendorId")?.toString()}
                              label={"Vendor"}
                              placeholder={
                                asset?.vendorId === 0 || null
                                  ? "--"
                                  : asset?.vendor?.name
                              }
                              // data={vendorsList ?? []}
                              disabled
                            />
                            {/* <AlertInput>{errors?.vendorId?.message}</AlertInput> */}
                          </div>
                        </div>
                        <div className="col-span-3">
                          <InputField
                            // required
                            register={register}
                            label="Model Name"
                            placeholder={
                              asset?.modelId === 0 || null
                                ? "--"
                                : asset?.model?.name
                            }
                            name="model.name"
                            disabled
                          />
                          {/* <AlertInput>{errors?.model?.name?.message}</AlertInput> */}
                        </div>
                        <div className="col-span-6 grid grid-cols-9 gap-7">
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Model Brand"
                              placeholder={
                                asset?.modelId === 0 || null
                                  ? "--"
                                  : asset?.model?.brand ?? "--"
                              }
                              name="model.brand"
                              disabled
                            />
                            {/* <AlertInput>{errors?.model?.brand?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Model Number"
                              placeholder={
                                asset?.modelId === 0 || null
                                  ? "--"
                                  : asset?.model?.number ?? "--"
                              }
                              name="model.number"
                              disabled
                            />
                            {/* <AlertInput>{errors?.model?.number?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Asset Lifetime"
                              placeholder={
                                String(asset?.management?.asset_lifetime) ??
                                "--"
                              }
                              name={"management.asset_lifetime"}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-span-9 grid grid-cols-12 gap-7">
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Original Cost"
                              placeholder={
                                String(asset?.management?.original_cost) ?? "--"
                              }
                              name="management.original_cost"
                              disabled
                            />
                            {/* <AlertInput>
                                                            {errors?.management?.original_cost?.message}
                                                        </AlertInput> */}
                          </div>
                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Current Cost"
                              placeholder={
                                String(asset?.management?.current_cost) ?? "--"
                              }
                              name="management.current_cost"
                              disabled
                            />
                            {/* <AlertInput>
                                                            {errors?.management?.current_cost?.message}
                                                        </AlertInput> */}
                          </div>

                          <div className="col-span-3">
                            <InputField
                              register={register}
                              label="Residual Value"
                              placeholder={
                                String(asset?.management?.residual_value) ??
                                "--"
                              }
                              name={"management.residual_value"}
                              disabled
                            />
                            {/* <AlertInput>
                                                            {errors?.management?.residual_value?.message}
                                                        </AlertInput> */}
                          </div>
                          <div className=" col-span-3">
                            <InputField
                              type="number"
                              register={register}
                              label="Residual Value Percentage"
                              placeholder={
                                String(asset?.management?.residual_percentage) +
                                  "%" ?? "--"
                              }
                              name={"management.residual_percentage"}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-span-9">
                          {/* <textarea
                                                        value={asset?.description ?? ""}
                                                        readOnly
                                                        className="h-[100%] resize-none rounded-md border-2 border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 w-[100%]"
                                                    >

                                                    </textarea> */}

                          <Textarea
                            value={asset?.description ?? "--"}
                            // onChange={(event) => {
                            //     const text = event.currentTarget.value
                            //     setDescription(text)
                            //     setValue("description", text)
                            // }}
                            // placeholder="Asset Description"
                            label="Asset Description"
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

                  {/* <Accordion.Item value="general_information">
                                        <Accordion.Control>
                                            <div className="flex flex-row">
                                                <CircleNumber2 className="h-7 w-7" color="gold"></CircleNumber2>{" "}
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
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="subsidiary.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>

                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">Custodian</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="custodian.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Purchase Date
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.purchase_date"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">Department</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="department.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">Class</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="model.class.name"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item> */}

                  <Accordion.Item value={"2"} className="">
                    <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CircleNumber2
                          className="h-7 w-7"
                          color="gold"
                        ></CircleNumber2>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          General Information
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="grid gap-7">
                        <div className="col-span-9 grid grid-cols-9 gap-7">
                          <div className="col-span-4">
                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"subsidiary.name"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Company"}
                              placeholder={
                                asset?.subsidiaryId === 0 || null
                                  ? "--"
                                  : asset?.subsidiary?.name
                              }
                              disabled
                              // data={companyList ?? []}
                            />
                            {/* <ClassTypeSelect
                                                            query={companyId}
                                                            setQuery={setCompanyId}
                                                            required
                                                            defaultValue={asset?.subsidiary?.name}
                                                            name={"subsidiary.name"}
                                                            setValue={setValue}
                                                            value={getValues("subsidiaryId")?.toString()}
                                                            title={"Company"}
                                                            placeholder={"Select company or subsidiary"}
                                                            data={companyList ?? []}
                                                        /> */}

                            {/* <AlertInput>{errors?.subsidiaryId?.message}</AlertInput> */}
                          </div>
                          <div className="col-span-8">
                            <div className="text-gray-700">
                              <div className="flex flex-1 flex-col gap-2">
                                {/* <label htmlFor="address" className="text-sm">
                                                                    Company Address
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id={"address"}
                                                                    className={
                                                                        "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                                                                    }
                                                                    placeholder="Company Address will appear here"
                                                                    value={
                                                                        company_address?.address
                                                                            ? getAddress(company_address)
                                                                            : ""
                                                                    }
                                                                    disabled
                                                                /> */}
                                {/* <InputField
                                                                    // query={companyId}
                                                                    // setQuery={setCompanyId}
                                                                    // required
                                                                    name={"getAddress(company_address)"}
                                                                    register={register}
                                                                    // setValue={setValue}
                                                                    // value={getValues("subsidiaryId")?.toString()}
                                                                    label={"Company"}
                                                                    // placeholder={"Select company or subsidiary"}
                                                                    disabled
                                                                // data={companyList ?? []}
                                                                /> */}
                                <label htmlFor="address" className="text-sm">
                                  Company Address
                                </label>
                                <input
                                  type="text"
                                  id={"address"}
                                  className={
                                    "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                                  }
                                  placeholder={
                                    company_address?.address
                                      ? getAddress(company_address)
                                      : ""
                                  }
                                  value={
                                    company_address?.address
                                      ? getAddress(company_address)
                                      : ""
                                  }
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12 grid grid-cols-12 gap-7">
                            <div className="col-span-3">
                              <InputField
                                // query={companyId}
                                // setQuery={setCompanyId}
                                // required
                                name={"department.name"}
                                register={register}
                                // setValue={setValue}
                                // value={getValues("subsidiaryId")?.toString()}
                                label={"Department"}
                                placeholder={
                                  asset?.departmentId === 0 || null
                                    ? "--"
                                    : asset?.department?.name
                                }
                                disabled
                                // data={companyList ?? []}
                              />
                            </div>
                            <div className="col-span-3">
                              <div className="text-gray-700">
                                <div className=" gap-2">
                                  <InputField
                                    // query={companyId}
                                    // setQuery={setCompanyId}
                                    // required
                                    name={"department.location.floor"}
                                    register={register}
                                    // setValue={setValue}
                                    // value={getValues("subsidiaryId")?.toString()}
                                    label={"Floor"}
                                    placeholder={
                                      asset?.departmentId === 0 || null
                                        ? "--"
                                        : String(
                                            asset?.department?.location?.floor
                                          )
                                    }
                                    disabled
                                    // data={companyList ?? []}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <div className="text-gray-700">
                                <div className=" gap-2">
                                  <InputField
                                    // query={companyId}
                                    // setQuery={setCompanyId}
                                    // required
                                    name={"department.location.room"}
                                    register={register}
                                    // setValue={setValue}
                                    // value={getValues("subsidiaryId")?.toString()}
                                    label={"Room"}
                                    placeholder={
                                      asset?.departmentId === 0 || null
                                        ? "--"
                                        : String(
                                            asset?.department?.location?.room
                                          )
                                    }
                                    disabled
                                    // data={companyList ?? []}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <InputField
                                // query={companyId}
                                // setQuery={setCompanyId}
                                // required
                                name={"custodian.name"}
                                register={register}
                                // setValue={setValue}
                                // value={getValues("subsidiaryId")?.toString()}
                                label={"Custodian"}
                                placeholder={
                                  asset?.custodianId === 0 || null
                                    ? "--"
                                    : asset?.custodian?.name ?? "--"
                                }
                                disabled
                                // data={companyList ?? []}
                              />
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

                              <InputField
                                // query={companyId}
                                // setQuery={setCompanyId}
                                // required
                                name={"model.class.name"}
                                register={register}
                                // setValue={setValue}
                                // value={getValues("subsidiaryId")?.toString()}
                                label={"Class"}
                                placeholder={
                                  asset?.modelId === 0 || null
                                    ? "--"
                                    : asset?.model?.name ?? "--"
                                }
                                disabled
                                // data={companyList ?? []}
                              />
                              {/* <AlertInput>{errors?.model?.classId?.message}</AlertInput> */}
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

                              <InputField
                                // query={companyId}
                                // setQuery={setCompanyId}
                                // required
                                name={"model.category.name"}
                                register={register}
                                // setValue={setValue}
                                // value={getValues("subsidiaryId")?.toString()}
                                label={"Category"}
                                placeholder={
                                  asset?.modelId === 0 || null
                                    ? "--"
                                    : asset?.model?.category?.name
                                }
                                disabled
                                // data={companyList ?? []}
                              />
                              {/* <AlertInput>{errors?.model?.categoryId?.message}</AlertInput> */}
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

                              <InputField
                                // query={companyId}
                                // setQuery={setCompanyId}
                                // required
                                name={"model.type.name"}
                                register={register}
                                // setValue={setValue}
                                // value={getValues("subsidiaryId")?.toString()}
                                label={"Type"}
                                placeholder={
                                  asset?.modelId === 0 || null
                                    ? "--"
                                    : asset?.model?.type?.name
                                }
                                disabled
                                // data={companyList ?? []}
                              />
                              {/* <AlertInput>{errors?.model?.typeId?.message}</AlertInput> */}
                            </div>
                            <div className="col-span-6">
                              <InputField
                                register={register}
                                label="Asset Location"
                                placeholder={
                                  asset?.management === undefined || null
                                    ? "--"
                                    : asset?.management?.asset_location ?? "--"
                                }
                                name="management.asset_location"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-9 grid grid-cols-9 gap-7">
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

                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"management.currency"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Currency"}
                              placeholder={
                                asset?.management === undefined || null
                                  ? "--"
                                  : asset?.management?.currency ?? "--"
                              }
                              disabled
                              // data={companyList ?? []}
                            />
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

                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"management.accounting_method"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Accounting Method"}
                              placeholder={
                                asset?.management === undefined || null
                                  ? "--"
                                  : asset?.management?.accounting_method ?? "--"
                              }
                              disabled
                              // data={companyList ?? []}
                            />
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
                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"management.purchase_date"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Purchase Date"}
                              placeholder={
                                asset?.management === undefined || null
                                  ? "--"
                                  : String(asset?.management?.purchase_date) ??
                                    "--"
                              }
                              disabled
                              // data={companyList ?? []}
                            />
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
                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"management.depreciation_rule"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Depreciation Method"}
                              placeholder={
                                asset?.management === undefined || null
                                  ? "--"
                                  : asset?.management?.depreciation_rule ?? "--"
                              }
                              disabled
                              // data={companyList ?? []}
                            />
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
                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"management.depreciation_start"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Depreciation Start Date"}
                              placeholder={
                                asset?.management === undefined || null
                                  ? "--"
                                  : String(
                                      asset?.management?.depreciation_start
                                    ) ?? "--"
                              }
                              disabled
                              // data={companyList ?? []}
                            />
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
                            <InputField
                              // query={companyId}
                              // setQuery={setCompanyId}
                              // required
                              name={"management.depreciation_end"}
                              register={register}
                              // setValue={setValue}
                              // value={getValues("subsidiaryId")?.toString()}
                              label={"Depreciation End Date"}
                              placeholder={
                                asset?.management === undefined || null
                                  ? "--"
                                  : String(
                                      asset?.management?.depreciation_end
                                    ) ?? "--"
                              }
                              disabled
                              // data={companyList ?? []}
                            />
                          </div>
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>

                  {/* <Accordion.Item value="asset_usage_info">
                                        <Accordion.Control>
                                            <div className="flex flex-row">
                                                <CircleNumber3 className="h-7 w-7" color="gold"></CircleNumber3>{" "}
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
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.depreciation_start"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Depreciation End Date
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.depreciation_end"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">Period</label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.depreciation_period"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Original Cost
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.original_cost"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Current Cost
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.current_cost"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-col py-2">
                                                        <label className="font-semibold">
                                                            Depreciation Method
                                                        </label>
                                                        <InputField
                                                            disabled={true}
                                                            register={register}
                                                            name="management.depreciation_rule"
                                                            type={"text"}
                                                            label={""}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                                                <div className="flex w-full flex-col py-2">
                                                    <label className="font-semibold">Currency</label>
                                                    <InputField
                                                        disabled={true}
                                                        register={register}
                                                        name="management.currency"
                                                        type={"text"}
                                                        label={""}
                                                    />
                                                </div>
                                                <div className="flex w-full flex-col py-2">
                                                    <label className="font-semibold">
                                                        Residual Value
                                                    </label>
                                                    <InputField
                                                        disabled={true}
                                                        register={register}
                                                        name="management.residual_value"
                                                        type={"text"}
                                                        label={""}
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item> */}
                  <Accordion.Item value={"3"} className="">
                    <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CircleNumber3
                          className="h-7 w-7"
                          color="gold"
                        ></CircleNumber3>{" "}
                        <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                          Asset Usage
                        </p>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="col-span-9 grid grid-cols-9 gap-7">
                        <div className="col-span-3 space-y-2">
                          <InputField
                            // query={companyId}
                            // setQuery={setCompanyId}
                            // required
                            name={"management.depreciation_start"}
                            register={register}
                            // setValue={setValue}
                            // value={getValues("subsidiaryId")?.toString()}
                            label={"Date of Usage"}
                            placeholder={
                              asset?.management === undefined || null
                                ? "--"
                                : String(
                                    asset?.management?.depreciation_start
                                  ) ?? "--"
                            }
                            disabled
                            // data={companyList ?? []}
                          />
                        </div>
                        <div className="col-span-3">
                          <InputField
                            // query={companyId}
                            // setQuery={setCompanyId}
                            // required
                            name={"management.depreciation_period"}
                            register={register}
                            // setValue={setValue}
                            // value={getValues("subsidiaryId")?.toString()}
                            label={"Period (month/s)"}
                            placeholder={
                              asset?.management === undefined || null
                                ? "--"
                                : String(
                                    asset?.management?.depreciation_period
                                  ) ?? "--"
                            }
                            disabled
                            // data={companyList ?? []}
                          />
                        </div>
                        {/* <div className="col-span-3">
                                                    <InputField
                                                        // query={companyId}
                                                        // setQuery={setCompanyId}
                                                        // required
                                                        name={"management.asset_quantity"}
                                                        register={register}
                                                        // setValue={setValue}
                                                        // value={getValues("subsidiaryId")?.toString()}
                                                        label={"Asset Quantity"}
                                                        placeholder={asset?.management === undefined || null ? "--" : String(asset?.management?.asset_quantity) ?? "--"}
                                                        disabled
                                                    // data={companyList ?? []}
                                                    />
                                                </div> */}
                        <div className="col-span-9">
                          <Textarea
                            value={asset?.remarks ?? ""}
                            // onChange={(event) => {
                            //     const text = event.currentTarget.value
                            //     setDescription(text)
                            //     setValue("description", text)
                            // }}
                            placeholder={
                              asset?.remarks === null || undefined
                                ? "--"
                                : asset?.remarks
                            }
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
                <div className="align-center flex w-full flex-col justify-center gap-4 py-4">
                  <div className="flex w-full justify-center gap-3">
                    <button
                      type="button"
                      className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex w-full justify-center ">
                    <button
                      type="button"
                      className=" px-4 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={resetTransferAsset}
                    >
                      Cancel Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {state.currentStep == 1 && (
          <div className="rounded-md bg-white drop-shadow-lg">
            <div className="p-5">
              <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text p-2 font-sans text-xl font-semibold uppercase text-transparent">
                Issuance Details
              </p>
              <div className=" grid grid-flow-row grid-cols-12  py-2">
                <div className="col-span-6 py-2 px-2">
                  <div className=" flex flex-col py-2">
                    <label className="font-semibold">Employee</label>

                    <Select
                      disabled={checked}
                      placeholder="Select Employee"
                      onChange={(value) => {
                        setSelectedEMP(value ?? "")
                        console.log(employeeList, "aaaa list")
                        setIssuedTo(Number(value))
                        console.log(transfer_date, "aaaaa")
                        console.log(issuedTo, "aaaa issued to")
                        setSelectedCustodian(value ?? "")
                      }}
                      value={selectedEMP}
                      data={employeeList}
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
                      className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                    />
                    {/* <div className="flex w-full flex-col">
                    <label className="py-2 font-semibold">Department</label>
                    <input
                      type="text"
                      id={"department"}
                      className={
                        "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                      }
                      placeholder="Select an employee"
                      value={
                        specificDepartment ? specificDepartment ?? "--" : ""
                      }
                      disabled
                    />
                  </div> */}
                  </div>
                </div>

                <div className="col-span-6 py-2 px-2">
                  <div className="flex flex-col py-2">
                    <label className="font-semibold">Issuance Date</label>
                    <div className="relative py-2">
                      <DatePicker
                        disabled={checked}
                        placeholder={""}
                        allowFreeInput
                        size="sm"
                        onChange={(value) => {
                          setTransfer_date(value),
                            setValue("issuanceDate", value)
                        }}
                        classNames={{
                          input:
                            "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100",
                        }}
                      />
                      <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                        <span className="opacity-50">
                          {transfer_date ? "" : "Month, Day, Year"}
                        </span>
                        <span className="pointer-events-none pr-3">📅</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="flex w-full flex-row justify-between gap-7 py-2 px-2">
                  <div className="flex w-full flex-col py-2">
                    <div className="mb-2 flex flex-row gap-2">
                      <label className="w-full font-semibold">Barangay</label>
                      <label className="w-full font-semibold">City</label>
                      <label className="w-full font-semibold">State</label>
                      <label className="w-full font-semibold">Country</label>
                      <label className="w-full font-semibold">Zip</label>
                    </div>

                    <div className="flex flex-row gap-2">
                      <input
                        type="text"
                        id={"street"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder="Barangay"
                        value={employee?.address?.street ?? ""}
                        disabled
                      />

                      <input
                        type="text"
                        id={"city"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder="City"
                        value={employee?.address?.city ?? ""}
                        disabled
                      />
                      <input
                        type="text"
                        id={"state"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder="State"
                        value={employee?.address?.region ?? ""}
                        disabled
                      />
                      <input
                        type="text"
                        id={"country"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder="Country"
                        value={employee?.address?.country ?? ""}
                        disabled
                      />
                      <input
                        type="text"
                        id={"zip"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder="Zip"
                        value={employee?.address?.zip ?? ""}
                        disabled
                      />
                    </div>
                  </div>
                </div> */}
              {/* <div className="py-2 px-2 flex flex-row justify-between w-full gap-7">
                                <div className="flex flex-col w-[60%] py-2">
                                    <label className="font-semibold">Remarks</label >
                                    <textarea rows={6} className="rounded-md border-2 resize-none border-gray-400 bg-transparent px-2 py-1 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"></textarea>
                                </div>
                            </div> */}
            </div>
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
                {(transfer_date && selectedEMP) !== null && (
                  <button
                    type="button"
                    className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                )}
              </div>
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={resetTransferAsset}
                >
                  Cancel Process
                </button>
              </div>
            </div>
          </div>
        )}

        {state.currentStep == 2 && (
          <div className="rounded-md bg-white drop-shadow-lg">
            <div className="p-5">
              <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text p-2 font-sans text-xl font-semibold uppercase text-transparent">
                Confirmation
              </p>
              <div className="flex items-center justify-around">
                <div className=" col-span-4 grid w-2/5 grid-cols-4 gap-5 p-2">
                  <div className="col-span-4 ">
                    <InputField
                      register={register}
                      label="Name"
                      name="name"
                      placeholder={asset?.name}
                      // className="placeholder:font-semibold"
                      disabled
                      // required
                    />
                    {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                  </div>
                  <div className="col-span-4 ">
                    <InputField
                      register={register}
                      label="Alternate Asset Number"
                      placeholder={
                        asset?.alt_number == "" || null || undefined
                          ? "--"
                          : asset?.alt_number ?? "--"
                      }
                      name="alt_number"
                      disabled
                    />
                    {/* <AlertInput>{errors?.alt_number?.message}</AlertInput> */}
                  </div>
                  <div className="col-span-4 ">
                    <InputField
                      register={register}
                      label="Tag"
                      name="assettag"
                      placeholder={asset?.assetTag?.name}
                      // className="placeholder:font-semibold"
                      disabled
                      // required
                    />
                    {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                  </div>{" "}
                  <div className="col-span-4 ">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Currently Issued to:
                      </label>
                      <div className="relative ">
                        <input
                          disabled
                          placeholder={
                            (asset?.custodian?.name ?? "Not Assigned") +
                              " | " +
                              asset?.custodian?.employee_id ?? "--"
                          }
                          className={
                            "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="invisible flex flex-col gap-2">
                      <label className="font-semibold">Transfer Date</label>
                      <div className="relative ">
                        <DatePicker
                          disabled
                          placeholder={
                            transfer_date
                              ? transfer_date?.toDateString()
                              : "Month, Day, Year"
                          }
                          allowFreeInput
                          size="sm"
                          classNames={{
                            input:
                              "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100",
                          }}
                        />
                        <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                          <span className="opacity-50">
                            {transfer_date ? "" : "Month, Day, Year"}
                          </span>
                          <span className="pointer-events-none pr-3">📅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  {/* <div className="thick-arrow-right "></div> */}
                  <div className="thick-arrow-right "></div>
                  {/* <div className="thick-arrow-right "></div> */}
                </div>

                <div className=" col-span-4 grid w-2/5 grid-cols-4 gap-5 p-2">
                  <div className="col-span-4 ">
                    <InputField
                      register={register}
                      label="Name"
                      name="name"
                      placeholder={asset?.name}
                      // className="placeholder:font-semibold"
                      disabled
                      // required
                    />
                    {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                  </div>
                  <div className="col-span-4 ">
                    <InputField
                      register={register}
                      label="Alternate Asset Number"
                      placeholder={
                        asset?.alt_number == "" || null || undefined
                          ? "--"
                          : asset?.alt_number ?? "--"
                      }
                      name="alt_number"
                      disabled
                    />
                    {/* <AlertInput>{errors?.alt_number?.message}</AlertInput> */}
                  </div>
                  <div className="col-span-4 ">
                    <InputField
                      register={register}
                      label="Tag"
                      name="assettag"
                      placeholder={asset?.assetTag?.name}
                      // className="placeholder:font-semibold"
                      disabled
                      // required
                    />
                    {/* <AlertInput>{errors?.name?.message}</AlertInput> */}
                  </div>{" "}
                  <div className="col-span-4 ">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">To be issued to:</label>
                      <div className="relative ">
                        <input
                          disabled
                          placeholder={
                            (employeeList[
                              employeeList.findIndex(
                                (employee) =>
                                  employee.value === selectedCustodian
                              )
                            ]?.label ?? "--") +
                            " | " +
                            (employeeList[
                              employeeList.findIndex(
                                (employee) =>
                                  employee.value === selectedCustodian
                              )
                            ]?.emp_id ?? "--")
                          }
                          // onChange={(event) => {
                          //   const { value } = event.target
                          //   setTransfer_location(value)
                          //   setValue("transferLocation", value)
                          // }}
                          className={
                            "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">Issuance Date</label>
                      <div className="relative ">
                        <DatePicker
                          disabled
                          placeholder={transfer_date?.toDateString() || ""}
                          allowFreeInput
                          size="sm"
                          classNames={{
                            input:
                              "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100",
                          }}
                        />
                        <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                          <span className="opacity-50">
                            {transfer_date ? "" : "Month, Day, Year"}
                          </span>
                          <span className="pointer-events-none pr-3">📅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  type="submit"
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    console.log("jejeje" + stringify(errors))
                  }}
                >
                  Submit
                </button>
              </div>
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  className=" px-4 py-1 font-medium text-gray-900 duration-150 hover:underline disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={resetTransferAsset}
                >
                  Cancel Process
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      <Modal
        isVisible={completeModal}
        setIsVisible={setCompleteModal}
        className="max-w-2xl"
        title="Issue Asset"
      >
        <div className="flex w-full flex-col items-center px-4 py-2">
          <div>
            <p className="text-center text-lg font-semibold">
              Asset Issued successfuly.
            </p>
          </div>
          <div className=" flex justify-end pt-2">
            <Link href={"/assets"}>
              <button
                className=" rounded bg-tangerine-500 px-4 py-1 pt-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={resetTransferAsset}
              >
                Return to Assets tab
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Issue

//{<i className={`fa-sharp fa-solid fa-arrow-right-arrow-left ${active == 1 ? "text-tangerine-600" : ""}`}
//E0E0E0

// <div>
// <Stepper size="xl" iconPosition="left" active={active} color="orange.4" onStepClick={setActive} completedIcon={<Check size={35} strokeWidth={2} color={'#FFFFFF'} />
// }>
//     <Stepper.Step icon={<i className="fa-solid fa-info text-[#F59E0B]" />} label="Step 1" description="Check Asset Details" />
//     <Stepper.Step icon={<ArrowsExchange
//         size={35}
//         strokeWidth={2}
//         color={active === 1 ? '#F59E0B' : "#E0E0E0"}
//     />} label="Issuance Asset" description="Verify email" />
//     <Stepper.Step icon={<Checks
//         size={35}
//         strokeWidth={2}
//         color={active === 2 ? '#F59E0B' : "#E0E0E0"}
//     />} label="Step 3" description="Confirmation" completedIcon={<Checks
//         size={35}
//         strokeWidth={2}
//         color={active === 2 ? '#F59E0B' : "#E0E0E0"}
//     />} />
// </Stepper>

// </div>

// <Link href={"/assets/create"}>
