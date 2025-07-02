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
import { getAddress, getBuilding, getWorkMode } from "../../../lib/functions"
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
  const { mutate, isLoading, error } = trpc.asset.update.useMutation({
    onSuccess() {
      console.log("successfully updated");
      router.push("/assets")
    },
    onError(error){
      console.error("error updating")
    }
  })

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
  const [buildingId, setBuildingId] = useState<string | null>(null)

  const [workMode, setWorkMode] = useState<string | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const { data: typesData } = trpc.assetType.findAll.useQuery()
  const { data: actionTypesData } = trpc.assetActionType.findAll.useQuery()

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

  const buildingLocation = useMemo(() => {
    if (departmentId) {
      const department = departmentData?.departments.filter(
        (department) => department.id === Number(departmentId)
      )[0]
      return department?.building ?? null
    }
  }, [departmentId, departmentData])

  const [description, setDescription] = useState<string | null>(
    selectedAsset?.description ?? null
  )

  const [remarks, setRemarks] = useState<string | null>(
    selectedAsset?.management?.remarks ?? null
  )

  const [period, setPeriod] = useState<number | null>(
    selectedAsset?.management?.depreciation_period ?? null
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

  // Gun Types
  const typesList = useMemo(
    () =>
      typesData?.assetTypes
        .filter((item) => item.id != 0)
        .map((assetType) => {
          return { value: assetType.id.toString(), label: assetType.name }
        }),
    [typesData]
  ) as SelectValueType[] | undefined

  const actionTypesList = useMemo(
    () =>
      actionTypesData?.assetActionTypes
        .filter((item) => item.id != 0)
        .map((assetActionType) => {
          return { value: assetActionType.id.toString(), label: assetActionType.name }
        }),
    [actionTypesData]
  ) as SelectValueType[] | undefined

  useEffect(() => {
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

  useEffect(() => {
    setBuildingId(String(buildingLocation?.id))
  }, [buildingLocation])

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

      console.log("Submitting: ",  selectedAsset?.id )
      console.log("Type Id: ",  form_data?.typeId )

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
      setBuildingId(null)
      setDepartmentId(null)
      setSelectedAsset(null)
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
                <div className="col-span-9 grid grid-cols-12 gap-7">
                  <div className="col-span-6">
                    <InputField
                      register={register}
                      label="Asset Name"
                      name="name"
                      placeholder="Asset Name"
                      required
                    />
                    <AlertInput>{errors?.name?.message}</AlertInput>
                  </div>

                  <div className="col-span-6">
                    <InputField
                      register={register}
                      label="Asset ID"
                      placeholder="Asset ID"
                      name="number"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-12 gap-7">
                  <div className="col-span-6">
                    <InputField
                      register={register}
                      label="RFID Tag ID / Barcode"
                      name="barcode"
                      placeholder="RFID Tag ID / Barcode"
                      required
                    />
                    <AlertInput>{errors?.barcode?.message}</AlertInput>
                  </div>
                  <div className="col-span-6">
                    <InputField
                      register={register}
                      label="Firearm Serial Number"
                      placeholder="Firearm Serial Number"
                      name="serial_no"
                    />
                    <AlertInput>{errors?.serial_no?.message}</AlertInput>
                  </div>
                </div>

                <div className="col-span-9 grid grid-cols-12 gap-7">
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Brand"
                      name="brand"
                      placeholder="Brand"
                      required
                    />
                    <AlertInput>{errors?.brand?.message}</AlertInput>
                  </div>
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Model"
                      name="models"
                      placeholder="Model"
                      required
                    />
                    <AlertInput>{errors?.models?.message}</AlertInput>
                  </div>
                  <div className="col-span-4">
                    <TypeSelect
                      name={"typeId"}
                      setValue={setValue}
                      value={getValues("typeId")?.toString()}
                      title={"Type"}
                      placeholder={"Select Type"}
                      data={typesList ?? []}
                    />
                    <AlertInput>{errors?.typeId?.message}</AlertInput>
                  </div>
                </div>

                <div className="col-span-9 grid grid-cols-12 gap-7">
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Caliber"
                      name="caliber"
                      placeholder="Caliber"
                      required
                    />
                    <AlertInput>{errors?.name?.message}</AlertInput>
                  </div>
                  <div className="col-span-4">
                    <TypeSelect
                      name={"actionTypeId"}
                      setValue={setValue}
                      value={getValues("actionTypeId")?.toString()}
                      title={"Action Type"}
                      placeholder={"Select Action Type"}
                      data={actionTypesList ?? []}
                    />
                    <AlertInput>{errors?.actionTypeId?.message}</AlertInput>
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
                    placeholder="Description"
                    label="Description"
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
