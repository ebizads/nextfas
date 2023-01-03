import { Accordion } from "@mantine/core"
import AlertInput from "../../atoms/forms/AlertInput"
import { InputField, InputNumberField } from "../../atoms/forms/InputField"
import TypeSelect, {
  ClassTypeSelect,
  SelectValueType,
} from "../../atoms/select/TypeSelect"
import { Textarea } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { trpc } from "../../../utils/trpc"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetCreateInput } from "../../../server/schemas/asset"
import { AssetClassType, AssetFieldValues } from "../../../types/generic"
import { useEffect, useMemo, useRef, useState } from "react"
import { getAddress } from "../../../lib/functions"
import { Location } from "@prisma/client"
import moment from "moment"
import JsBarcode from "jsbarcode"
import { useReactToPrint } from "react-to-print"

const AddRepairForm = () => {
  const { mutate, isLoading, error } = trpc.asset.create.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    // watch,
    formState: { errors, isDirty, isValid },
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetCreateInput),
    defaultValues: {
      // name: "",
      // alt_number: "",
      // barcode: "",
      // custodianId: 0,
      // departmentId: 0,
      // description: "",
      // model: {
      //   name: "",
      //   brand: "",
      //   number: "",
      // asset_category: {
      //   name: ""
      // },
      // asset_class: {
      //   name: ""
      // },
      // typeId: 0,
      // asset_type: {
      //   name: ""
      // },
      //   typeId: 0,
      //   categoryId: 0,
      //   classId: 0,
      // },
      // number: "",
      // parentId: 0,
      // projectId: 0,
      // remarks: "",
      // serial_no: "",
      // subsidiaryId: 0,
      // vendorId: 0,
      // subsidiaryId: undefined,
      management: {
        // original_cost: 0,
        // current_cost: 0,
        // residual_value: 0,
        depreciation_period: 1,
      },
    },
  })

  const [classId, setClassId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const assetsList = useMemo(
    () =>
      assetsData?.assets
        .filter((item) => item.id != 0)
        .map((asset) => {
          return { value: asset.id.toString(), label: asset.name }
        }),
    [assetsData]
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
      classData?.map((classItem) => {
        return { value: classItem.id.toString(), label: classItem.name }
      }),
    [classData]
  ) as SelectValueType[] | undefined

  //gets and sets all employee
  const { data: employeeData } = trpc.employee.findAll.useQuery()
  const employeeList = useMemo(
    () =>
      employeeData?.employees
        .filter((item) => item.id != 0)
        .map((employeeItem) => {
          return { value: employeeItem.id.toString(), label: employeeItem.name }
        }),
    [employeeData]
  ) as SelectValueType[] | undefined

  //gets and sets all class, categories, and types
  const { data: departmentData } = trpc.department.findAll.useQuery()

  const selectedDepartment = useMemo(() => {
    const department = departmentData?.departments.filter(
      (department) => department.id === Number(departmentId)
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
        const departments = dept?.map((department) => {
          return { value: department.id.toString(), label: department.name }
        }) as SelectValueType[]
        return departments ?? null
      }
    }
    // console.log(departmentData)
    setDepartmentId(null)
    // console.error("Error loading departments")
    return null
  }, [companyId, departmentData])

  //asset description
  const [description, setDescription] = useState<string | null>(null)
  const [notes, setNotes] = useState<string | null>(null)

  //depreciation start and end period
  const [dep_start, setDepStart] = useState<Date | null>(null)
  const [dep_end, setDepEnd] = useState<Date | null>(null)

  const [selectedClass, setSelectedClass] = useState<
    AssetClassType | undefined
  >(undefined)
  // const [types, setTypes] = useState<SelectValueType[] | null>(null)

  const categories = useMemo(() => {
    if (classId) {
      const selectedClass = classData?.filter(
        (classItem) => classItem.id === Number(classId)
      )[0]
      if (selectedClass) {
        //sets selected class
        setSelectedClass(selectedClass)

        //filters all the categories based on the selected class
        const categories = selectedClass.categories.map((category) => {
          return { value: category.id.toString(), label: category.name }
        }) as SelectValueType[]
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
        (category) => category.id === Number(categoryId)
      )[0]
      if (selectedCategory) {
        //filters all types in the selected category based on the selected class
        const types = selectedCategory?.types.map((type) => {
          return { value: type.id.toString(), label: type.name }
        }) as SelectValueType[]
        return types ?? null
      }
    } else {
      //clears type selection
      setTypeId(null)
      return null
    }

    console.error("Error loading types")
    return null
  }, [categoryId, selectedClass])

  const company_address = useMemo(() => {
    if (companyId) {
      const address = companyData?.companies.filter(
        (company) => company.id === Number(companyId)
      )[0]
      return address ?? null
    }
  }, [companyId, companyData])

  const [loading, setIsLoading] = useState<boolean>(false)
  const [assetId, setAssetId] = useState<string>(
    `-${moment().format("YYMDhms")}`
  )

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
  }, [assetId, asset_number])

  const onSubmit: SubmitHandler<AssetFieldValues> = (
    form_data: AssetFieldValues
  ) => {
    if (error) {
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", errors)
    } else {
      console.log("Submitting: ", form_data)

      mutate(form_data)

      setTimeout(function () {
        setIsLoading(false)
      }, 3000)

      reset()
      setClassId(null)
      setCategoryId(null)
      setTypeId(null)
      setCompanyId(null)
      setDepartmentId(null)
    }
  }

  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <div id="contents">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate
      >
        {/* <InputField register={register} label="Name" name="name" />
      <AlertInput>{errors?.name?.message}</AlertInput> */}
        <div className="flex items-center gap-2 text-gray-700">
          <i className="fa-fw fa-sharp fa-solid fa-circle-info fa-2x"></i>
          <p className="text-bold">Add Repair Asset</p>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 grid grid-cols-6 gap-2">
            <div className="col-span-12">
              <InputField
                register={register}
                label="Asset Number "
                name="name"
                placeholder="Name"
                required
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
          </div>
          <div className="col-span-12">
            <Textarea
              required
              value={description ?? ""}
              onChange={(event) => {
                const text = event.currentTarget.value
                setDescription(text)
                setValue("description", text)
              }}
              label="Asset Description "
              minRows={6}
              maxRows={6}
              classNames={{
                input:
                  "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                label: "font-sans text-sm font-normal text-gray-600 text-light",
              }}
            />
          </div>
          <div className="col-span-12">
            <InputField
              register={register}
              label="Asset to be repair "
              placeholder="Serial Number"
              name="serial_no"
              required
            />
            <AlertInput>{errors?.serial_no?.message}</AlertInput>
          </div>
          <div className="col-span-12">
            <Textarea
              value={notes ?? ""}
              onChange={(event) => {
                const text = event.currentTarget.value
                setNotes(text)
                setValue("description", text)
              }}
              label="Notes "
              required
              minRows={6}
              maxRows={6}
              classNames={{
                input:
                  "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                label: "font-sans text-sm font-normal text-gray-600 text-light",
              }}
            />
          </div>
        </div>
        <div className="mt-2 flex w-full justify-end gap-2 text-lg">
          <button type="button" className="px-4 py-2 underline">
            Clear
          </button>
          <button
            type="submit"
            disabled={(!isValid && !isDirty) || isLoading}
            className="rounded-md bg-tangerine-300  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
          >
            {isLoading || loading ? "Saving..." : "Add"}
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

export default AddRepairForm
