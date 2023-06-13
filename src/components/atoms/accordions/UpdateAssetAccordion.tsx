import { Accordion } from "@mantine/core"
import AlertInput from "../forms/AlertInput"
import { InputField } from "../forms/InputField"
import {
  ArrowsExchange,
  Check,
  Checks,
  CircleNumber1,
  CircleNumber2,
  CircleNumber3,
  CircleNumber4,
  Disabled,
  Search,
} from "tabler-icons-react"
import TypeSelect, {
  ClassTypeSelect,
  SelectValueType,
} from "../select/TypeSelect"
import { Textarea } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { trpc } from "../../../utils/trpc"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AssetCreateInput,
  AssetUpdateInput,
} from "../../../server/schemas/asset"
import {
  AssetClassType,
  AssetEditFieldValues,
  AssetFieldValues,
  TicketHandlerValues,
} from "../../../types/generic"
import { useEffect, useMemo, useRef, useState } from "react"
import JsBarcode from "jsbarcode"
import { useReactToPrint } from "react-to-print"
import { useUpdateAssetStore } from "../../../store/useStore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import InputNumberField from "../forms/InputNumberField"
import { getAddress, getWorkMode } from "../../../lib/functions"
import { Location } from "@prisma/client"
import { ticketTableCreate } from "../../../server/schemas/ticket"
import { clearAndGoBack } from "../../../lib/functions"
import { get } from "lodash"

export const FormErrorMessage = (props: {
  setFormError: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="flex justify-between rounded-md border-red-400 bg-red-50 p-6">
      <p className="text-red-400">There seems to be a problem with the form.</p>
      <i
        className="fa-solid fa-xmark hover:cursor-pointer"
        onClick={() => {
          props.setFormError(false)
        }}
      />
    </div>
  )
}

const UpdateAssetAccordion = () => {
  const { mutate, isLoading, error } = trpc.asset.update.useMutation()

  const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()

  const ticketTable = trpc.ticketTable.create.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    // watch,
    formState: { errors, isDirty, isValid },
  } = useForm<AssetEditFieldValues>({
    resolver: zodResolver(AssetUpdateInput),
    // defaultValues: {
    //   name: selectedAsset?.name,
    //   alt_number: selectedAsset?.alt_number,
    //   // barcode: "",
    //   custodianId: selectedAsset?.custodianId ?? undefined,
    //   departmentId: selectedAsset?.departmentId ?? undefined,
    //   description: selectedAsset?.description,
    //   // model: {
    //   //   name: "",
    //   //   brand: "",
    //   //   number: "",
    //   // asset_category: {
    //   //   name: ""
    //   // },
    //   // asset_class: {
    //   //   name: ""
    //   // },
    //   // typeId: 0,
    //   // asset_type: {
    //   //   name: ""
    //   // },
    //   //   typeId: 0,
    //   //   categoryId: 0,
    //   //   classId: 0,
    //   // },
    //   number: selectedAsset?.number,
    //   parentId: selectedAsset?.parentId ?? undefined,
    //   assetProjectId: selectedAsset?.parent?.assetassetProjectId ?? undefined,
    //   remarks: selectedAsset?.remarks,
    //   serial_no: selectedAsset?.serial_no,
    //   subsidiaryId: selectedAsset?.subsidiaryId ?? undefined,
    //   vendorId: selectedAsset?.vendorId ?? undefined,
    //   management: {
    //     original_cost: selectedAsset?.management?.original_cost,
    //     current_cost: selectedAsset?.management?.current_cost,
    //     residual_value: selectedAsset?.management?.residual_value,
    //     depreciation_period: selectedAsset?.management?.depreciation_period,
    //   },
    // },
  })

  useEffect(() => {
    if (selectedAsset) {
      reset(selectedAsset as AssetEditFieldValues)
      setValue("assetProjectId", selectedAsset.assetProjectId ?? 1)
      setValue("description", selectedAsset.description ?? "")
      setWorkMode(selectedAsset.custodian?.workMode ?? "")
      console.log(selectedAsset.assetProjectId)

      setValue("purchaseOrder", selectedAsset.purchaseOrder)
      setValue("invoiceNum", selectedAsset.invoiceNum)
      setValue("deployment_status", selectedAsset.deployment_status)
      setValue(
        "management.original_cost",
        selectedAsset.management?.original_cost
      )
      setValue(
        "management.current_cost",
        selectedAsset.management?.current_cost
      )
      setValue(
        "management.residual_value",
        selectedAsset.management?.residual_value
      )
      setValue(
        "management.purchase_date",
        selectedAsset.management?.purchase_date
      )
      setValue(
        "management.depreciation_start",
        selectedAsset.management?.depreciation_start
      )
      setValue(
        "management.depreciation_end",
        selectedAsset.management?.depreciation_end
      )
      setValue(
        "management.depreciation_period",
        selectedAsset.management?.depreciation_period
      )
      setValue("management.remarks", selectedAsset.management?.remarks)
    }
  }, [selectedAsset, reset, setValue])

  const [classId, setClassId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [workMode, setWorkMode] = useState<string | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const assetsList = useMemo(
    () =>
      assetsData?.assets
        .filter((item: { id: number }) => item.id != 0)
        .map((asset: { id: { toString: () => any }; name: any }) => {
          return { value: asset.id.toString(), label: asset.name }
        }),
    [assetsData]
  ) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: projectsData } = trpc.assetProject.findAll.useQuery()
  const projectsList = useMemo(
    () =>
      projectsData
        ?.filter((item: { id: number }) => item.id != 0)
        .map((project: { id: { toString: () => any }; name: any }) => {
          return { value: project.id.toString(), label: project.name }
        }),
    [projectsData]
  ) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: vendorsData } = trpc.vendor.findAll.useQuery()
  const vendorsList = useMemo(
    () =>
      vendorsData?.vendors
        .filter((item: { id: number }) => item.id != 0)
        .map((vendor: { id: { toString: () => any }; name: any }) => {
          return { value: vendor.id.toString(), label: vendor.name }
        }),
    [vendorsData]
  ) as SelectValueType[] | undefined

  const { data: companyData } = trpc.company.findAll.useQuery()

  //gets and sets all class, categories, and types
  const { data: classData } = trpc.assetClass.findAll.useQuery()
  const classList = useMemo(
    () =>
      classData
        ?.filter((item: { id: number }) => item.id != 0)
        .map((classItem: { id: { toString: () => any }; name: any }) => {
          return { value: classItem.id.toString(), label: classItem.name }
        }),
    [classData]
  ) as SelectValueType[] | undefined

  const { data: employeeData } = trpc.employee.findAll.useQuery()
  const employeeList = useMemo(
    () =>
      employeeData?.employees
        .filter((item: { id: number }) => item.id != 0)
        .map((employeeItem: { id: { toString: () => any }; name: any }) => {
          return { value: employeeItem.id.toString(), label: employeeItem.name }
        }),
    [employeeData]
  ) as SelectValueType[] | undefined

  //gets and sets all class, categories, and types
  const { data: departmentData } = trpc.department.findAll.useQuery()

  const selectedDepartment = useMemo(() => {
    const department = departmentData?.departments.filter(
      (department: { id: number }) => department.id === Number(departmentId)
    )[0]

    //set location === floor and room number
    // setValue('locationId', department?.locationId ?? undefined)
    return department?.location
  }, [departmentId, departmentData]) as Location

  const departmentList = useMemo(() => {
    if (companyId) {
      const dept = departmentData?.departments.filter(
        (department) => department.companyId === Number(companyId)
      )
      if (dept) {
        const departments = dept?.map(
          (department: { id: { toString: () => any }; name: any }) => {
            return { value: department.id.toString(), label: department.name }
          }
        ) as SelectValueType[]
        return departments ?? null
      }
    }
    // console.log(departmentData)
    setDepartmentId(null)
    // console.error("Error loading departments")
    return null
  }, [companyId, departmentData])

  const [description, setDescription] = useState<string | null>(
    selectedAsset?.description ?? null
  )

  const [remarks, setRemarks] = useState<string | null>(
    selectedAsset?.management?.remarks ?? null
  )

  const [period, setPeriod] = useState<number | null>(
    selectedAsset?.management?.depreciation_period ?? null
  )
  const [quantity, setQuantity] = useState<number | null>(
    selectedAsset?.management?.asset_quantity ?? null
  )

  const [dep_purchase, setPurchase] = useState<Date | null>(
    selectedAsset?.management?.purchase_date ?? null
  )

  //depreciation start and end period
  const [dep_start, setDepStart] = useState<Date | null>(
    selectedAsset?.management?.depreciation_start ?? null
  )
  const [dep_end, setDepEnd] = useState<Date | null>(
    selectedAsset?.management?.depreciation_end ?? null
  )

  const [selectedClass, setSelectedClass] = useState<
    AssetClassType | undefined
  >(undefined)

  // const [types, setTypes] = useState<SelectValueType[] | null>(null)

  const categories = useMemo(() => {
    if (classId) {
      const selectedClass = classData?.filter(
        (classItem: { id: number }) => classItem.id === Number(classId)
      )[0]
      if (selectedClass) {
        //sets selected class
        setSelectedClass(selectedClass)

        //filters all the categories based on the selected class
        const categories = selectedClass.categories.map(
          (category: { id: { toString: () => any }; name: any }) => {
            return { value: category.id.toString(), label: category.name }
          }
        ) as SelectValueType[]
        return categories ?? null
      }
    } else {
      //clears category selection
      setCategoryId(null)
      return null
    }

    console.error("Error loading categories")
    return null
  }, [classId, classData])

  const types = useMemo(() => {
    if (categoryId) {
      const selectedCategory = selectedClass?.categories.filter(
        (category: { id: number }) => category.id === Number(categoryId)
      )[0]
      if (selectedCategory) {
        //filters all types in the selected category based on the selected class
        const types = selectedCategory?.types.map(
          (type: { id: { toString: () => any }; name: any }) => {
            return { value: type.id.toString(), label: type.name }
          }
        ) as SelectValueType[]
        return types ?? null
      }
    } else {
      //clears type selection
      setTypeId(null)
      return null
    }

    // console.error("Error loading types")
    return null
  }, [categoryId, selectedClass])

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

  const [companyName, setCompanyName] = useState<string>(
    company_address?.name ?? " "
  )

  const [loading, setIsLoading] = useState<boolean>(false)
  // const [assetId, setAssetId] = useState<string>(
  //   `-${moment().format("YYMDhms")}`
  // )

  const assetId = useMemo(() => {
    const asset_number = selectedAsset ? selectedAsset?.number.split("-") : "-"
    return "-" + asset_number[1]
  }, [])

  const asset_number = useMemo(() => {
    const parseId = (id: string | null) => {
      if (!id) {
        return "00"
      }
      if (id?.length === 1) {
        return 0 + id
      } else {
        return id
      }
    }

    if (typeId && departmentId) {
      return parseId(departmentId) + parseId(typeId)
    }

    return null
  }, [typeId, departmentId]) as string | null

  useEffect(() => {
    setCompanyId(getValues("subsidiaryId")?.toString() ?? "")
    setDepartmentId(getValues("departmentId")?.toString() ?? "")
    setEmployeeId(getValues("custodianId")?.toString() ?? " ")
    setCategoryId(getValues("model.categoryId")?.toString() ?? " ")
    setTypeId(getValues("model.typeId")?.toString() ?? " ")
    setClassId(getValues("model.classId")?.toString() ?? " ")

    if (asset_number) {
      const id = `${asset_number}${assetId}`
      setValue("number", id)
      JsBarcode("#barcode2", id, {
        textAlign: "left",
        textPosition: "bottom",
        fontOptions: "",
        fontSize: 12,
        textMargin: 6,
        height: 50,
        width: 1,
      })
    }
  }, [assetId, asset_number, companyId, getValues, selectedAsset, setValue])
  const employee_workMode = useMemo(() => {
    if (employeeId) {
      const workMode = employeeData?.employees.filter(
        (employee) => employee.id === Number(employeeId)
      )[0]
      return workMode ?? null
    }
  }, [employeeId, employeeData])

  const router = useRouter()

  // const ticketHandler = useMemo(() => {
  //   //
  // }, [])

  const onSubmit: SubmitHandler<AssetEditFieldValues> = (
    form_data: AssetEditFieldValues
  ) => {
    // console.log(form_data)

    if (error) {
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", errors)
    } else {
      // if (form_data.parentId === undefined) {
      //   form_data.parentId = 0
      //   console.log("Submitting: ", form_data)
      // } else {
      //   console.log("ERROR ENCOUNTERED")
      // }
      // form_data.parentId === undefined
      //   ? (form_data.parentId = 0)
      //   : console.log("")
      // form_data.custodianId === undefined
      //   ? (form_data.custodianId = 0)
      //   : console.log("")
      // form_data.vendorId === undefined
      //   ? (form_data.vendorId = 0)
      //   : console.log("")
      // form_data.departmentId === undefined
      //   ? (form_data.departmentId = 0)
      //   : console.log("")
      // form_data.subsidiaryId === undefined
      //   ? (form_data.subsidiaryId = 0)
      //   : console.log("")

      console.log("Submitting: ", form_data.parentId)
      mutate({ ...form_data, id: selectedAsset?.id ?? 0 })

      // ticketTable.mutate({ addedById});
      setTimeout(function () {
        setIsLoading(false)
      }, 3000)

      reset()
      setClassId(null)
      setCategoryId(null)
      setTypeId(null)
      setCompanyId(null)
      setDepartmentId(null)
      setSelectedAsset(null)
      router.push("/assets")
    }
  }

  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const [formError, setFormError] = useState<boolean>(false)
  useEffect(() => {
    setFormError(Object.keys(errors).length > 0 ? true : false)
  }, [errors])

  return (
    <div id="contents">
      {formError && <FormErrorMessage setFormError={setFormError} />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate
      >
        {/* <InputField register={register} label="Name" name="name" />
      <AlertInput>{errors?.name?.message}</AlertInput> */}

        <Accordion
          transitionDuration={300}
          multiple={true}
          defaultValue={["1", "2", "3"]}
          classNames={{}}
        >
          <Accordion.Item value={"1"} className="">
            <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
              <div className=" flex items-center gap-2 text-gray-700">
                {/* <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400 p-1 text-sm text-yellow-400">
                  1
                </div> */}
                <CircleNumber1 className="h-7 w-7" color="gold"></CircleNumber1>{" "}
                <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                  Asset Information
                </p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="grid grid-cols-9 gap-7">
                <div className="col-span-9 grid grid-cols-8 gap-7">
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Asset Name"
                      name="name"
                      placeholder="Asset Name"
                      required
                    />
                    <AlertInput>{errors?.name?.message}</AlertInput>
                  </div>
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Alternate Asset Number"
                      placeholder="(Optional)"
                      name="alt_number"
                    />
                    <AlertInput>{errors?.alt_number?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-3">
                  <InputField
                    register={register}
                    label="Serial Number"
                    placeholder="Serial Number"
                    name="serial_no"
                  />
                  <AlertInput>{errors?.serial_no?.message}</AlertInput>
                </div>
                <div className="col-span-6 grid grid-cols-9 gap-7">
                  <div className="col-span-3">
                    <TypeSelect
                      name={"parentId"}
                      setValue={setValue}
                      value={getValues("parentId")?.toString()}
                      title={"Parent Asset"}
                      placeholder={"Select parent asset"}
                      data={assetsList ?? []}
                    />
                    <AlertInput>{errors?.parentId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect
                      name={"assetProjectId"}
                      setValue={setValue}
                      value={getValues("assetProjectId")?.toString()}
                      title={"Project"}
                      placeholder={"Select project"}
                      data={projectsList ?? []}
                    />
                    <AlertInput>{errors?.assetProjectId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect
                      name={"vendorId"}
                      setValue={setValue}
                      value={getValues("vendorId")?.toString()}
                      title={"Vendor"}
                      placeholder={"Select vendor"}
                      data={vendorsList ?? []}
                    />
                    <AlertInput>{errors?.vendorId?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-3">
                  <InputField
                    required
                    register={register}
                    label="Model Brand"
                    placeholder="Model Brand"
                    name="model.brand"
                  />
                  <AlertInput>{errors?.model?.brand?.message}</AlertInput>
                </div>
                <div className="col-span-6 grid grid-cols-9 gap-7">
                  <div className="col-span-3">
                    <InputField
                      register={register}
                      label="Model Name"
                      placeholder="Model Name"
                      name="model.name"
                    />
                    <AlertInput>{errors?.model?.name?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <InputField
                      register={register}
                      label="Model Number"
                      placeholder="Model Number"
                      name="model.number"
                    />
                    <AlertInput>{errors?.model?.number?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <InputField
                      type="number"
                      register={register}
                      label="Asset Lifetime"
                      placeholder="Months"
                      name={"management.asset_lifetime"}
                    />
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-12 gap-7">
                  <div className="col-span-3">
                    <InputField
                      type="number"
                      register={register}
                      label="Original Cost"
                      placeholder="Original Cost"
                      name="management.original_cost"
                    />
                    <AlertInput>
                      {errors?.management?.original_cost?.message}
                    </AlertInput>
                  </div>
                  <div className="col-span-3">
                    <InputField
                      type="number"
                      register={register}
                      label="Current Cost"
                      placeholder="Current Cost"
                      name="management.current_cost"
                    />
                    <AlertInput>
                      {errors?.management?.current_cost?.message}
                    </AlertInput>
                  </div>

                  <div className="col-span-3">
                    <InputField
                      type="number"
                      register={register}
                      label="Residual Value"
                      placeholder="Residual Value"
                      name={"management.residual_value"}
                    />
                    <AlertInput>
                      {errors?.management?.residual_value?.message}
                    </AlertInput>
                  </div>
                  <div className=" col-span-3">
                    <InputField
                      type="number"
                      register={register}
                      label="Residual Value Percentage"
                      placeholder="Residual Value Percentage"
                      name={"management.residual_percentage"}
                    />
                  </div>
                </div>
                <div className="col-span-9">
                  <Textarea
                    value={description ?? ""}
                    onChange={(event) => {
                      const text = event.currentTarget.value
                      setDescription(text)
                      setValue("description", text)
                    }}
                    placeholder="Asset Description"
                    label="Asset Description"
                    minRows={6}
                    maxRows={6}
                    classNames={{
                      input:
                        "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                      label:
                        "font-sans text-sm font-normal text-gray-600 text-light",
                    }}
                  />
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          {/* General Information */}
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
                <div className="col-span-9 grid grid-cols-9 gap-7">
                  <div className="col-span-4">
                    <ClassTypeSelect
                      query={companyId}
                      setQuery={setCompanyId}
                      required
                      name={"subsidiaryId"}
                      setValue={setValue}
                      value={getValues("subsidiaryId")?.toString()}
                      title={"Company"}
                      placeholder={"Select company or subsidiary"}
                      data={companyList ?? []}
                    />
                    <AlertInput>{errors?.subsidiaryId?.message}</AlertInput>
                  </div>
                  <div className="col-span-8">
                    <div className="text-gray-700">
                      <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="address" className="text-sm">
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
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 grid grid-cols-12 gap-7">
                    <div className="col-span-3">
                      <ClassTypeSelect
                        query={departmentId}
                        setQuery={setDepartmentId}
                        required
                        disabled={!Boolean(companyId)}
                        name={"departmentId"}
                        setValue={setValue}
                        value={getValues("departmentId")?.toString()}
                        title={"Department"}
                        placeholder={
                          !Boolean(companyId)
                            ? "Select company first"
                            : "Select department type"
                        }
                        data={departmentList ?? []}
                      />
                      <AlertInput>{errors?.departmentId?.message}</AlertInput>
                    </div>
                    <div className="col-span-3">
                      <div className="text-gray-700">
                        <div className=" gap-2">
                          <label htmlFor="floor" className="text-sm">
                            Floor
                          </label>
                          <input
                            type="text"
                            id={"floor"}
                            className={
                              "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                            }
                            disabled={!Boolean(departmentId)}
                            placeholder={
                              !Boolean(companyId)
                                ? "Select company first"
                                : "Select Floor type"
                            }
                            // placeholder="Floor no."
                            value={selectedDepartment?.floor ?? ""}
                            // disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-gray-700">
                        <div className=" gap-2">
                          <label htmlFor="address" className="text-sm">
                            Room
                          </label>
                          <input
                            type="text"
                            id={"address"}
                            className={
                              "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                            }
                            disabled={!Boolean(departmentId)}
                            placeholder={
                              !Boolean(companyId)
                                ? "Select company first"
                                : "Select Floor type"
                            }
                            // placeholder="Room no."
                            value={selectedDepartment?.room ?? ""}
                            // disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <ClassTypeSelect
                        name={"custodianId"}
                        setValue={setValue}
                        query={employeeId}
                        setQuery={setEmployeeId}
                        required
                        value={getValues("custodianId")?.toString()}
                        title={"Custodian"}
                        disabled={!Boolean(departmentId)}
                        placeholder={
                          !Boolean(departmentId)
                            ? "Select department first"
                            : "Assign custodian"
                        }
                        data={employeeList ?? []}
                      />
                      <AlertInput>{errors?.custodianId?.message}</AlertInput>
                    </div>
                  </div>
                  <div className="col-span-12 grid grid-cols-12 gap-7 ">
                    <div className="col-span-2">
                      <ClassTypeSelect
                        query={classId}
                        setQuery={setClassId}
                        required
                        name={"model.classId"}
                        setValue={setValue}
                        value={getValues("model.classId")?.toString()}
                        title={"Class"}
                        placeholder={"Select asset class"}
                        data={classList ?? []}
                      />
                      <AlertInput>{errors?.model?.classId?.message}</AlertInput>
                    </div>
                    <div className="col-span-2">
                      <ClassTypeSelect
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
                      />
                      <AlertInput>
                        {errors?.model?.categoryId?.message}
                      </AlertInput>
                    </div>
                    <div className="col-span-2">
                      <ClassTypeSelect
                        disabled={!Boolean(categoryId)}
                        query={typeId}
                        setQuery={setTypeId}
                        required
                        name={"model.typeId"}
                        setValue={setValue}
                        value={getValues("model.typeId")?.toString()}
                        title={"Device Type"}
                        placeholder={
                          !Boolean(categoryId)
                            ? "Select asset category first"
                            : "Select Device type"
                        }
                        data={types ?? []}
                      />
                      <AlertInput>{errors?.model?.typeId?.message}</AlertInput>
                    </div>
                    <div className="col-span-6">
                      <InputField
                        register={register}
                        label="Asset Location"
                        placeholder="Asset Location"
                        name="management.asset_location"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-9 gap-7">
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="PO number"
                      placeholder="PO number"
                      name="purchaseOrder"
                    />
                  </div>
                  <div className="col-span-3">
                    <InputField
                      register={register}
                      label="Invoice Number"
                      placeholder="Invoice Number"
                      name="invoiceNum"
                    />
                  </div>
                  <div className="col-span-2">
                    <TypeSelect
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
                    </AlertInput>
                  </div>

                  <div className="col-span-3">
                    <TypeSelect
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
                    />
                    <AlertInput>
                      {errors?.management?.accounting_method?.message}
                    </AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect
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
                    </AlertInput>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <TypeSelect
                      isString
                      name={"deployment_status"}
                      setValue={setValue}
                      value={getValues("deployment_status")?.toString() ?? "--"}
                      title={"Status"}
                      placeholder={"Select Status"}
                      data={["Deployed", "In-Stock"]}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label htmlFor="workMode" className="text-sm">
                      Work Mode
                    </label>
                    <input
                      type="text"
                      id={"workMode"}
                      className={
                        "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                      }
                      placeholder={"--"}
                      value={
                        employee_workMode?.workMode
                          ? getWorkMode(employee_workMode)
                          : ""
                      }
                      disabled
                    />
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-9 gap-7">
                  <div className="col-span-3 space-y-2">
                    <p className="text-sm text-gray-700">Purchase Date</p>
                    <DatePicker
                      placeholder="Month Day, Year"
                      allowFreeInput
                      size="sm"
                      value={dep_purchase}
                      onChange={(value) => {
                        setPurchase(value)
                        setValue("management.purchase_date", value)
                      }}
                      classNames={{
                        input:
                          "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                      }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <p className="text-sm text-gray-700">
                      Depreciation Start Date
                    </p>
                    <DatePicker
                      placeholder={
                        "Month, Day, Year                                                                📅"
                      }
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
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-gray-700">
                      Depreciation End Date
                    </p>
                    <DatePicker
                      placeholder={
                        dep_start ? "Month, Day, Year" : "Select start ffirst"
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
                    />
                  </div>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value={"3"} className="">
            <Accordion.Control className="uppercase outline-none focus:outline-none active:outline-none">
              <div className="flex items-center gap-2 text-gray-700">
                <CircleNumber3 className="h-7 w-7" color="gold"></CircleNumber3>{" "}
                <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                  Asset Usage
                </p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="col-span-9 grid grid-cols-9 gap-7">
                <div className="col-span-3 space-y-2">
                  <p className="text-sm text-gray-700">Date of Usage</p>
                  <DatePicker
                    placeholder={
                      "Month, Day, Year                                                             📅"
                    }
                    // allowFreeInput
                    size="sm"
                    value={dep_start}
                    disabled
                    classNames={{
                      input:
                        "w-full rounded-md border-2 border-gray-500 bg-transparent px-4 py-5 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:text-gray-400",
                    }}

                    // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="col-span-3">
                  <InputNumberField
                    placeholder="Month/s"
                    register={register}
                    label="Period (month/s)"
                    value={period?.toString() ?? "--"}
                    name="management.depreciation_period"
                  />
                  <AlertInput>
                    {errors?.management?.depreciation_period?.message}
                  </AlertInput>
                </div>
                <div className="col-span-3">
                  <InputNumberField
                    register={register}
                    value={quantity?.toString() ?? "--"}
                    label="Asset Quantity"
                    placeholder="Asset Quantity"
                    name="management.asset_quantity"
                  />
                </div>
                <div className="col-span-9">
                  <Textarea
                    placeholder="Remarks"
                    label="Remarks"
                    minRows={6}
                    maxRows={6}
                    value={remarks ?? ""}
                    onChange={(event) => {
                      const text = event.currentTarget.value
                      setRemarks(text)
                      setValue("management.remarks", text)
                    }}
                    classNames={{
                      input:
                        "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                      label:
                        "font-sans text-sm font-normal text-gray-600 text-light",
                    }}
                  />
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value={"4"} className="">
            <Accordion.Control
              disabled={!Boolean(typeId) || !Boolean(departmentId)}
              className="uppercase outline-none focus:outline-none active:outline-none"
            >
              <div className="flex items-center gap-2 text-gray-700">
                <CircleNumber4 className="h-7 w-7" color="gold"></CircleNumber4>{" "}
                <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                  Print Bar Code
                </p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="flex items-center justify-center">
                {!Boolean(typeId) || !Boolean(departmentId) ? (
                  <div
                    id="printableArea"
                    className="flex h-[10rem] w-[25rem] items-center justify-center rounded-md border-2 border-dashed border-neutral-400"
                  >
                    <p className="text-center italic text-neutral-400">
                      Barcode will appear here, please select `company a`nd
                      department
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-2">
                      <div id="printSVG" ref={componentRef}>
                        <svg id="barcode2" />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handlePrint()
                          console.log("printing barcode")
                        }}
                        disabled={!Boolean(typeId) || !Boolean(departmentId)}
                        className="m-2 flex items-center justify-center gap-2 rounded-md bg-tangerine-300 py-1 px-4 outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
                      >
                        <p>Print Barcode</p> <i className="fa-solid fa-print" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <div className="mt-2 flex w-full justify-end gap-2 text-lg">
          <button
            type="button"
            className="px-4 py-2 underline"
            onClick={() => clearAndGoBack()}
          >
            Discard
          </button>
          <button
            type="submit"
            className="rounded-md bg-tangerine-300  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            onClick={() => console.log(errors)}
          >
            {isLoading || loading ? "Saving..." : "Save"}
          </button>
        </div>
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
      </form>
    </div>
  )
}

export default UpdateAssetAccordion
