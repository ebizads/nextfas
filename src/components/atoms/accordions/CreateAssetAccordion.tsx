import { Accordion } from "@mantine/core"
import AlertInput from "../forms/AlertInput"
import { InputField } from "../forms/InputField"
import { ArrowsExchange, Check, Checks, CircleNumber1, CircleNumber2, CircleNumber3, CircleNumber4, Disabled, Search } from "tabler-icons-react"
import { renderToString } from "react-dom/server"
import TypeSelect, { ClassTypeSelect, SelectValueType } from "../select/TypeSelect"
import { Select } from "@mantine/core"
import { Textarea } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { trpc } from "../../../utils/trpc"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetCreateInput, AssetUpdateInput } from "../../../server/schemas/asset"
import { AssetClassType, AssetEditFieldValues, AssetFieldValues, AssetType, } from "../../../types/generic"
import { useEffect, useMemo, useRef, useState } from "react"
import { getAddress, getBuilding, getWorkMode } from "../../../lib/functions"
import { Location } from "@prisma/client"
import moment from "moment"
import JsBarcode from "jsbarcode"
import { useReactToPrint } from "react-to-print"
import { useUpdateAssetStore } from "../../../store/useStore"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { FormErrorMessage } from "./UpdateAssetAccordion"
import InputNumberField from "../forms/InputNumberField"
import { clearAndGoBack } from "../../../lib/functions"
import Assets from "../../../pages/assets"
import Employee from "../../../pages/employees"


const CreateAssetAccordion = () => {
  const router = useRouter()


  const { mutate, isLoading, error } = trpc.asset.create.useMutation({
    onError() {
      console.log(JSON.stringify(error))
    },
    onSuccess() {
      reset()
      router.push("/assets")
    },
  })


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetCreateInput),
  })


  const [classId, setClassId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [assetTag, setAssetTag] = useState<string | null>(null)
  const [buildingId, setBuildingId] = useState<string | null>(null)
  const [floorId, setFloorId] = useState<string | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)


  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const { data: typesData } = trpc.assetType.findAll.useQuery()
  const { data: actionTypesData } = trpc.assetActionType.findAll.useQuery()
  const { data: allAssets } = trpc.asset.findAllNoLimit.useQuery()
  const assetsAll: AssetType[] = allAssets?.assets as AssetType[]


  const assetsList = useMemo(
    () =>
      assetsData?.assets
        .filter((item) => item.id != 0)
        .map((asset) => {
          return { value: asset.id.toString(), label: asset.name }
        }),
    [assetsData]
  ) as SelectValueType[] | undefined

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


  //gets and sets all projects
  const { data: projectsData } = trpc.assetProject.findAll.useQuery()
  const projectsList = useMemo(
    () =>
      projectsData
        ?.filter((item) => item.id != 0)
        .map((project) => {
          return { value: project.id.toString(), label: project.name }
        }),
    [projectsData]
  ) as SelectValueType[] | undefined


  //gets and sets all projects
  const { data: vendorsData } = trpc.vendor.findAll.useQuery()
  const vendorsList = useMemo(
    () =>
      vendorsData?.vendors
        .filter((item) => item.id != 0)
        .map((vendor) => {
          return { value: vendor.id.toString(), label: vendor.name }
        }),
    [vendorsData]
  ) as SelectValueType[] | undefined


  //gets and sets all companies
  const { data: companyData } = trpc.company.findAll.useQuery()
  const companyList = useMemo(
    () =>
      companyData?.companies
        .filter((item) => item.id != 0)
        .map((company) => {
          return { value: company.id.toString(), label: company.name }
        }),
    [companyData]
  ) as SelectValueType[] | undefined


  //gets and sets all class, categories, and types
  const { data: classData } = trpc.assetClass.findAll.useQuery()
  const classList = useMemo(
    () =>
      classData
        ?.filter((item) => item.id != 0)
        .map((classItem) => {
          return { value: classItem.id.toString(), label: classItem.name }
        }),
    [classData]
  ) as SelectValueType[] | undefined


  //gets and sets all employee
  const { data: employeeData } = trpc.employee.findAllCustodians.useQuery()


  const employeeList = useMemo(
    () =>
      employeeData?.employees
        .filter((item) => item.id != 0)
        .map((employeeItem) => {
          return { value: employeeItem.id.toString(), label: employeeItem.name }
        }),
    [employeeData]
  ) as SelectValueType[] | undefined


  const employee_workMode = useMemo(() => {
    if (employeeId) {
      const workMode = employeeData?.employees.filter(
        (employee) => employee.id === Number(employeeId)
      )[0]
      return workMode ?? null
    }
  }, [employeeId, employeeData])


  const { data: assetTagData } = trpc.assetTag.findAll.useQuery()


  //gets and sets all class, categories, and types
  const { data: departmentData } = trpc.department.findAll.useQuery()


  // const assetTagList = useMemo(() =>
  //   assetTagData?.assetTag.
  //     filter((item) => item.id != 0)
  //     .map((assetTag) => {
  //       return { value: assetTag.id.toString(), label: assetTag.name }
  //     }),
  //   [assetTagData]) as SelectValueType[] | undefined


  // const buildingLocation = useMemo(() => {
  //   if (buildingId) {
  //     const building = departmentData?.departments.filter(
  //       (department) => department.id === Number(buildingId)
  //     )[0]
  //     return building?.building ?? null
  //   }
  // }, [buildingId, departmentData])


  // useEffect(() => {
  //   setFloorId(String(buildingLocation?.id))
  // }, [buildingLocation])


  //asset description
  const [description, setDescription] = useState<string | null>(null)


  const [selectedClass, setSelectedClass] = useState<
    AssetClassType | undefined
  >(undefined)


  // const categories = useMemo(() => {
  //   if (classId) {
  //     const selectedClass = classData?.filter(
  //       (classItem) => classItem.id === Number(classId)
  //     )[0]
  //     if (selectedClass) {
  //       //sets selected class
  //       setSelectedClass(selectedClass)


  //       //filters all the categories based on the selected class
  //       const categories = selectedClass.categories.map((category) => {
  //         return { value: category.id.toString(), label: category.name }
  //       }) as SelectValueType[]
  //       return categories ?? null
  //     }
  //   } else {
  //     //clears category selection
  //     setCategoryId(null)
  //     return null
  //   }


  //   console.error("Error loading categories")
  //   return null
  // }, [classId, classData])


  // // const types = useMemo(() => {
  // //   if (categoryId) {
  // //     const selectedCategory = selectedClass?.categories.filter(
  // //       (category) => category.id === Number(categoryId)
  // //     )[0]
  // //     if (selectedCategory) {
  // //       //filters all types in the selected category based on the selected class
  // //       const types = selectedCategory?.types.map((type) => {
  // //         return { value: type.id.toString(), label: type.name }
  // //       }) as SelectValueType[]
  // //       return types ?? null
  // //     }
  // //   } else {
  // //     //clears type selection
  // //     setTypeId(null)
  // //     return null
  // //   }


  //   console.error("Error loading types")
  //   return null
  // }, [categoryId, selectedClass])


  //filters data for company
  // const company_address = useMemo(() => {
  //   if (companyId) {
  //     const address = companyData?.companies.filter(
  //       (company) => company.id === Number(companyId)
  //     )[0]
  //     return address ?? null
  //   }
  // }, [companyId, companyData])


  const [loading, setIsLoading] = useState<boolean>(false)
  const [assetId, setAssetId] = useState<string>(
    `-${moment().format("YYMDhms")}`
  )


  const { data: session } = useSession()


  const onSubmit: SubmitHandler<AssetFieldValues> = (
    form_data: AssetFieldValues
  ) => {
    if (error) {
      console.log(form_data)
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", error)
    } else {
      form_data.addedById = Number(session?.user?.id)
      console.log("Submitting: ", form_data)
      mutate(form_data)


      setTimeout(function () {
        setIsLoading(false)
      }, 3000)


      setClassId(null)
      setCategoryId(null)
      setTypeId(null)
      setCompanyId(null)
      setBuildingId(null)
      setFloorId(null)
      setAssetTag(null)
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
        <div className=" flex items-center gap-2 text-gray-700">
          <CircleNumber1 className="h-7 w-7" color="gold"></CircleNumber1>{" "}
          <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold capitalize text-transparent">
            General Details
          </p>
        </div>


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
                placeholder={`GUN-${String(assetsData?.count + 1).padStart(4, '0')}`}
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
            <div className="col-span-4 pt-1">
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
            <div className="col-span-4 pt-1">
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
        <div className="mt-2 flex w-full justify-center gap-2 text-lg">
          <button
            type="button"
            className="rounded-md bg-gray-300 px-4 py-2 font-medium text-dark-primary outline-none hover:bg-gray-400 focus:outline-none"
            onClick={() => clearAndGoBack()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={(!isValid && !isDirty) || isLoading}
            className="rounded-md bg-tangerine-300 px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            onClick={() => {
              console.log("id", assetTag);
              console.log(errors);
            }}
          >
            {isLoading || loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}


export default CreateAssetAccordion;