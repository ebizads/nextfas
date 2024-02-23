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
import { renderToString } from "react-dom/server"
import TypeSelect, {
  ClassTypeSelect,
  SelectValueType,
} from "../select/TypeSelect"
import { Select } from "@mantine/core"

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
  AssetType,
} from "../../../types/generic"
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
      // assetProjectId: 0,
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
  const [assetTag, setAssetTag] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [buildingId, setBuildingId] = useState<string | null>(null)
  const [floorId, setFloorId] = useState<string | null>(null)

  const [employeeId, setEmployeeId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
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

  const selectedDepartment = useMemo(() => {
    const department = departmentData?.departments.filter(
      (department) => department.id === Number(departmentId)
    )[0]

    //set location === floor and room number
    // setValue('locationId', department?.locationId ?? undefined)
    return department?.location
  }, [departmentId, departmentData]) as Location

  const assetTagList = useMemo(
    () =>
      assetTagData?.assetTag
        .filter((item) => item.id != 0)
        .map((assetTag) => {
          return { value: assetTag.id.toString(), label: assetTag.name }
        }),
    [assetTagData]
  ) as SelectValueType[] | undefined

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
  const buildingLocation = useMemo(() => {
    if (departmentId) {
      const department = departmentData?.departments.filter(
        (department) => department.id === Number(departmentId)
      )[0]
      return department?.building ?? null
    }
  }, [departmentId, departmentData])

  useEffect(() => {
    setFloorId(String(selectedDepartment?.id))
  }, [selectedDepartment])

  useEffect(() => {
    setBuildingId(String(buildingLocation?.id))
  }, [buildingLocation])

  //asset description
  const [description, setDescription] = useState<string | null>(null)
  const [remarks, setRemarks] = useState<string | null>(null)

  //depreciation start and end period
  const [purchase_date, setPurchase_date] = useState<Date | null>(null)
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

  //filters data for company
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

  const [number, setNumber] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateAssetNumber = useMemo(() => {
    let numberArray = ""

    for (
      let x = 0;
      x <= (allAssets?.assets ? allAssets?.assets?.length : 0) + 1;

    ) {
      if (
        assetsAll?.some((item) =>
          item?.number?.includes(String(x + 1).padStart(4, "0"))
        )
      ) {
        x++
      } else {
        console.log("Chk: " + JSON.stringify(true))

        return (numberArray = String(x + 1).padStart(4, "0"))
      }
    }

    return numberArray
  }, [allAssets?.assets, assetsAll])

  const asset_number = useMemo(() => {
    console.log("aaa typeId", typeId)
    console.log("aaa departmentId", departmentId)
    console.log("aaa buildingId", buildingId)
    console.log("aaa floorId", floorId)
    console.log("aaa assetTag", assetTag)
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

    if (typeId && departmentId && buildingId && floorId && assetTag) {
      console.log(
        "AAAA parse",
        parseId(departmentId) +
          parseId(buildingId) +
          parseId(floorId) +
          "-" +
          parseId(assetTag)
      )
      return (
        parseId(departmentId) +
        parseId(buildingId) +
        parseId(floorId) +
        "-" +
        parseId(assetTag)
      )
    }

    return null
  }, [typeId, departmentId, buildingId, floorId, assetTag]) as string | null

  useEffect(() => {
    const checker = asset_number
    const assetNum = generateAssetNumber

    if (checker && assetNum) {
      const id = `${checker}` + "-"

      if (!number) {
        setNumber(id + assetNum)
      }
      setValue("number", id!)
      console.log(assetNum, "CHECK Gen", id, id + assetNum)
      // setValue("number", id + assetNum)
      console.log(number, "hhhhhh")
      if (id + assetNum) {
        setTimeout(() => {
          JsBarcode("#barcode", id + assetNum, {
            textAlign: "left",
            textPosition: "bottom",
            fontOptions: "",
            fontSize: 12,
            textMargin: 6,
            height: 50,
            width: 1,
          })
        }, 1000)
      }
    }
  }, [assetId, asset_number, generateAssetNumber, number])

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
      setDepartmentId(null)
      setBuildingId(null)
      setFloorId(null)
      setAssetTag(null)
      // router.push("/assets")
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
          defaultValue={["1", "2", "3", "4"]}
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
                  <div className="col-span-4">
                    <ClassTypeSelect
                      query={assetTag}
                      setQuery={setAssetTag}
                      required
                      name={"assetTagId"}
                      setValue={setValue}
                      value={getValues("assetTagId")?.toString()}
                      title={"Tag"}
                      placeholder={"Select Tag"}
                      data={assetTagList ?? []}
                    />
                    <AlertInput>{errors?.assetTagId?.message}</AlertInput>
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
                      placeholder={"Select Parent Asset"}
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
                    register={register}
                    label="Model Number"
                    placeholder="Model Number"
                    name="model.number"
                  />
                  <AlertInput>{errors?.model?.number?.message}</AlertInput>
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
                      label="Model Brand"
                      placeholder="Model Brand"
                      name="model.brand"
                    />
                    <AlertInput>{errors?.model?.brand?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <InputNumberField
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
                      required
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
                      required
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
                      required
                    />
                    <AlertInput>
                      {errors?.management?.residual_value?.message}
                    </AlertInput>
                  </div>
                  <div className=" col-span-3">
                    <InputField
                      type="number"
                      required
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
                  <div className="col-span-3">
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
                  <div className="col-span-4">
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
                  <div className="col-span-5">
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
                          : "Select room type"
                      }
                      data={departmentList ?? []}
                    />
                    <AlertInput>{errors?.departmentId?.message}</AlertInput>
                  </div>
                  <div className="col-span-12 grid grid-cols-9 gap-7">
                    <div className="col-span-3">
                      <label htmlFor="address" className="text-sm">
                        Building
                      </label>
                      <input
                        type="text"
                        id={"building"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder="Building will appear here"
                        value={
                          buildingLocation ? getBuilding(buildingLocation) : ""
                        }
                        disabled
                      />
                      <AlertInput>{errors?.subsidiaryId?.message}</AlertInput>
                    </div>

                    <div className="col-span-3">
                      <div className="text-gray-700">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="floor" className="text-sm">
                            Floor
                          </label>
                          <input
                            type="text"
                            id={"floor"}
                            className={
                              "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                            }
                            placeholder="Floor no."
                            value={selectedDepartment?.floor ?? ""}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-gray-700">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="address" className="text-sm">
                            Room
                          </label>
                          <input
                            type="text"
                            id={"address"}
                            className={
                              "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                            }
                            placeholder="Room no."
                            value={selectedDepartment?.room ?? ""}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 hidden">
                      <ClassTypeSelect
                        name={"custodianId"}
                        query={employeeId}
                        setQuery={setEmployeeId}
                        // required

                        setValue={setValue}
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
                      {/* <AlertInput>{errors?.custodianId?.message}</AlertInput> */}
                    </div>
                    <div className="col-span-2  hidden flex-col gap-2">
                      <label htmlFor="workMode" className="text-sm">
                        Work Mode
                      </label>
                      <input
                        type="text"
                        id={"workMode"}
                        className={
                          "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                        }
                        placeholder={
                          employee_workMode?.workMode
                            ? getWorkMode(employee_workMode)
                            : "N/A"
                        }
                        value={
                          employee_workMode?.workMode
                            ? getWorkMode(employee_workMode)
                            : ""
                        }
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-span-12 grid grid-cols-6 gap-7 ">
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
                        title={"Device type"}
                        placeholder={
                          !Boolean(categoryId)
                            ? "Select asset category first"
                            : "Select device type"
                        }
                        data={types ?? []}
                      />
                      <AlertInput>{errors?.model?.typeId?.message}</AlertInput>
                    </div>
                    <div className="col-span-4 hidden text-gray-700">
                      <div className="flex flex-1 flex-col gap-2 ">
                        <label htmlFor="address" className="text-sm">
                          Asset Location
                        </label>
                        <input
                          type="text"
                          id={"management.asset_location"}
                          className={
                            "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400"
                          }
                          placeholder="Asset address will appear here"
                          value={
                            employee_workMode?.workMode === "On-Site"
                              ? company_address?.address
                                ? getAddress(company_address)
                                : ""
                              : employee_workMode?.workMode === "WFH"
                              ? employee_workMode.address
                                ? getAddress(employee_workMode)
                                : ""
                              : employee_workMode?.workMode === "Hybrid"
                              ? (company_address?.address
                                  ? "[" + getAddress(company_address) + "]"
                                  : "") +
                                " & " +
                                (employee_workMode.address
                                  ? "[" + getAddress(employee_workMode) + "]"
                                  : "")
                              : "--"
                          }
                          disabled
                        />
                      </div>
                    </div>
                    {/* <div className="col-span-4">

                      <InputField
                        register={register}
                        label="Asset Location"
                        placeholder="Asset Location"
                        name="management.asset_location"
                        required
                      />
                    </div> */}
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-10 gap-7">
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="PO number"
                      placeholder="PO number"
                      name="purchaseOrder"
                    />
                  </div>
                  <div className="col-span-4">
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
                      placeholder={"Select currency"}
                      data={[
                        { value: "PHP", label: "Philippine Peso (Php)" },
                        { value: "USD", label: "US Dollar (USD)" },
                      ]}
                    />
                    <AlertInput>
                      {errors?.management?.currency?.message}
                    </AlertInput>
                  </div>

                  <div className="col-span-4">
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
                  <div className="col-span-4">
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
                      title={"Status"}
                      placeholder={"Select Status"}
                      data={["Deployed", "In-Stock"]}
                    />
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-9 gap-7">
                  <div className="col-span-3 space-y-2">
                    <p className="text-sm text-gray-700">Purchase Date</p>

                    <div className="relative">
                      <DatePicker
                        placeholder={""}
                        allowFreeInput
                        size="sm"
                        onChange={(value) => {
                          setPurchase_date(value),
                            setValue("management.purchase_date", value)
                        }}
                        classNames={{
                          input:
                            "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                        }}
                      />
                      <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                        <span className="opacity-50">
                          {purchase_date ? "" : "Month, Day, Year"}
                        </span>
                        <span className="pointer-events-none pr-3">📅</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 space-y-2">
                    <p className="text-sm text-gray-700">
                      Depreciation Start Date
                    </p>

                    <div className="relative">
                      <DatePicker
                        placeholder={""}
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
                      <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                        <span className="opacity-50">
                          {dep_start ? "" : "Month, Day, Year"}
                        </span>
                        <span className="pointer-events-none pr-3">📅</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 space-y-2">
                    <p className="text-sm text-gray-700">
                      Depreciation End Date
                    </p>

                    <div className="relative">
                      <DatePicker
                        placeholder={""}
                        allowFreeInput
                        size="sm"
                        value={dep_end}
                        disabled={!Boolean(dep_start)}
                        //
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
                      <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                        <span className="pointer-events-none opacity-50">
                          {dep_start
                            ? dep_end
                              ? ""
                              : "Month, Day, Year"
                            : "Select start date first"}
                        </span>
                        <span className="pointer-events-none pr-3">📅</span>
                      </div>
                    </div>
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
                  {/* <DatePicker
                    placeholder={
                      "Month, Day, Year                                                             📅"
                    }
                    // allowFreeInput
                    size="sm"
                    classNames={{
                      input:
                        "w-full rounded-md border-2 border-gray-500 bg-transparent px-4 py-5 text-gray-600 outline-none ring-tangerine-400/40 placeholder:text-sm  focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:text-gray-400",
                    }}

                    // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                  /> */}

                  <div className="relative">
                    <DatePicker
                      placeholder={""}
                      allowFreeInput
                      disabled
                      size="sm"
                      value={purchase_date} //TODO:usage date should not be the same as depreciation date (pwede mag depreciate ang item even before or after using it)
                      onChange={(value) => {
                        setPurchase_date(value),
                          setValue("management.purchase_date", value)
                      }}
                      classNames={{
                        input:
                          "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                      }}
                    />
                    <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-between px-3 align-middle text-sm text-gray-700 ">
                      <span className="opacity-50">
                        {purchase_date ? "" : "Month, Day, Year"}
                      </span>
                      <span className="pointer-events-none pr-3">📅</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <InputNumberField
                    placeholder="Month/s"
                    register={register}
                    label="Period (month/s)"
                    name="management.depreciation_period"
                  />
                  <AlertInput>
                    {errors?.management?.depreciation_period?.message}
                  </AlertInput>
                </div>
                {/* <div className="col-span-3">
                  <InputNumberField
                    register={register}
                    label="Asset Quantity"
                    placeholder="Asset Quantity"
                    value="0"
                    name="management.asset_quantity"
                  />
                </div> */}
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
              // disabled={!Boolean(typeId) || !Boolean(departmentId)}
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
              <div className="flex flex-col items-center justify-center">
                <div
                  id="printableArea"
                  className="flex min-h-[10rem] w-[25rem] flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-400"
                >
                  <div id="printSVG" ref={componentRef}>
                    <svg id="barcode" />
                  </div>
                  {!Boolean(typeId) || !Boolean(departmentId) ? (
                    <p className="text-center italic text-neutral-400">
                      Barcode will appear here, please select company and
                      department
                    </p>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div>
                  {/* <div id="printSVG" ref={componentRef}>
                    <svg id="barcode" />
                  </div> */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        handlePrint()
                        console.log("printing barcode")
                      }}
                      // disabled={!Boolean(typeId) || !Boolean(departmentId)}
                      className="m-2 flex items-center justify-center gap-2 rounded-md bg-tangerine-300 py-1 px-4 outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
                    >
                      <p>Print Barcode</p> <i className="fa-solid fa-print" />
                    </button>
                  </div>
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
            disabled={(!isValid && !isDirty) || isLoading}
            className="rounded-md bg-tangerine-300  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            onClick={() => {
              console.log("id", assetTag), console.log(errors)
            }}
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

        {/* */}
      </form>
    </div>
  )
}

export default CreateAssetAccordion
