import { Accordion } from "@mantine/core"
import AlertInput from "../forms/AlertInput"
import { InputField } from "../forms/InputField"
import TypeSelect, { ClassTypeSelect, SelectValueType } from "../select/TypeSelect"
import { Textarea } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { trpc } from "../../../utils/trpc"
import {
  useForm, SubmitHandler
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetCreateInput } from "../../../server/schemas/asset"
import { AssetClassType, AssetFieldValues } from "../../../types/generic"
import { useEffect, useMemo, useState } from "react"
import { getAddress } from "../../../lib/functions"
import { Location } from "@prisma/client"
import dayjs from "dayjs"
import Modal from "../../headless/modal/modal"
import moment from "moment"
import { env } from "process"


const CreateAssetAccordion = () => {

  const { mutate, isLoading, error } = trpc.asset.create.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetCreateInput),
    defaultValues: {
      // subsidiaryId: undefined,
      management: {
        original_cost: 0,
        current_cost: 0,
        residual_value: 0,
        depreciation_period: 1
      }
    },
  })

  const [classId, setClassId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const assetsList = useMemo(() => assetsData?.assets.map((asset) => { return { value: asset.id.toString(), label: asset.name } }), [assetsData]) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: projectsData } = trpc.assetProject.findAll.useQuery()
  const projectsList = useMemo(() => projectsData?.map((project) => { return { value: project.id.toString(), label: project.name } }), [projectsData]) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: vendorsData } = trpc.vendor.findAll.useQuery()
  const vendorsList = useMemo(() => vendorsData?.vendors.map((vendor) => { return { value: vendor.id.toString(), label: vendor.name } }), [vendorsData]) as SelectValueType[] | undefined

  //gets and sets all companies
  const { data: companyData } = trpc.company.findAll.useQuery()
  const companyList = useMemo(() => companyData?.companies.map((company) => { return { value: company.id.toString(), label: company.name } }), [companyData]) as SelectValueType[] | undefined

  //gets and sets all class, categories, and types
  const { data: classData } = trpc.assetClass.findAll.useQuery()
  const classList = useMemo(() => classData?.map((classItem) => { return { value: classItem.id.toString(), label: classItem.name } }), [classData]) as SelectValueType[] | undefined

  //gets and sets all employee
  const { data: employeeData } = trpc.employee.findAll.useQuery()
  const employeeList = useMemo(() => employeeData?.employees.map((employeeItem) => { return { value: employeeItem.id.toString(), label: employeeItem.name } }), [employeeData]) as SelectValueType[] | undefined

  //gets and sets all class, categories, and types
  const { data: departmentData } = trpc.department.findAll.useQuery()

  const selectedDepartment = useMemo(() => {
    const department = departmentData?.departments
      .filter((department) => department.id === Number(departmentId))[0]

    //set location === floor and room number
    setValue('locationId', department?.locationId ?? undefined)
    return department?.location
  }, [departmentId, departmentData]) as Location


  const departmentList = useMemo(() => {
    if (companyId) {
      const dept = departmentData?.departments.filter((department) => department.companyId === Number(companyId))
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
  const [remarks, setRemarks] = useState<string | null>(null)

  //depreciation start and end period
  const [dep_start, setDepStart] = useState<Date | null>(new Date)
  const [dep_end, setDepEnd] = useState<Date | null>(null)

  const [selectedClass, setSelectedClass] = useState<AssetClassType | undefined>(undefined)
  // const [types, setTypes] = useState<SelectValueType[] | null>(null)

  const categories = useMemo(() => {
    if (classId) {
      const selectedClass = classData?.filter((classItem) => classItem.id === Number(classId))[0]
      if (selectedClass) {

        //sets selected class
        setSelectedClass(selectedClass)

        //filters all the categories based on the selected class
        const categories = selectedClass.categories.map((category) => { return { value: category.id.toString(), label: category.name } }) as SelectValueType[]
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
      const selectedCategory = selectedClass?.categories.filter((category) => category.id === Number(categoryId))[0]
      if (selectedCategory) {

        //filters all types in the selected category based on the selected class
        const types = selectedCategory?.types.map((type) => { return { value: type.id.toString(), label: type.name } }) as SelectValueType[]
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
      const address = companyData?.companies.filter((company) => company.id === Number(companyId))[0]
      return address ?? null
    }
  }, [companyId, companyData])


  //submit modal trigger
  const [confirming, setConfirming] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [data, setData] = useState<AssetFieldValues | null>(null)
  const [loading, setIsLoading] = useState<boolean>(false)

  const onSubmit: SubmitHandler<AssetFieldValues> = (form_data: AssetFieldValues) => {

    if (error) {
      console.log("ERROR ENCOUNTERED")
      console.error(error)
    } else {
      setData(form_data)
      // console.log("omsim")
      // if (confirming) {
      console.log("Submitting: ", form_data)
      mutate(form_data)
      setTimeout(function () {
        setIsLoading(false)
      }, 3000)
      reset()
      // }
    }
  }

  // useEffect(() => {
  //   console.log(watch())
  // }, [watch()])

  useEffect(() => {

  }, [selectedDepartment])

  return (

    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate
      >
        {/* <InputField register={register} label="Name" name="name" />
      <AlertInput>{errors?.name?.message}</AlertInput> */}

        <Accordion transitionDuration={300} defaultValue={"1"} classNames={{}}>
          <Accordion.Item value={"1"}>
            <Accordion.Control className='uppercase'>
              <div className="flex gap-2 text-gray-700 items-center">
                <div className="rounded-full flex items-center justify-center h-6 w-6 border-gray-700 border-2 p-1 text-sm">
                  1
                </div>
                <p>General Information</p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="grid grid-cols-9 gap-2">
                <div className="col-span-9 grid grid-cols-6 gap-2">
                  <div className="col-span-3">
                    <InputField register={register} label="Name" name="name" placeholder="Name" required />
                    <AlertInput>{errors?.name?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <InputField register={register} label="Alternate Asset Number" placeholder="Alternate Asset Number" name="alt_number" />
                    <AlertInput>{errors?.alt_number?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-3">
                  <InputField register={register} label="Serial Number" placeholder="Serial Number" name="serial_no" />
                  <AlertInput>{errors?.serial_no?.message}</AlertInput>
                </div>
                <div className="col-span-6 grid grid-cols-9 gap-2">

                  <div className="col-span-3">
                    <TypeSelect name={"parentId"} setValue={setValue} title={"Parent Asset"} placeholder={"Select parent asset"} data={assetsList ? assetsList : ['Parent 1', 'Parent 2']} />
                    <AlertInput>{errors?.parentId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect name={"projectId"} setValue={setValue} title={"Project"} placeholder={"Select project"} data={projectsList ? projectsList : ['Project 1', 'Project 2']} />
                    <AlertInput>{errors?.projectId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect required name={"vendorId"} setValue={setValue} title={"Vendor"} placeholder={"Select vendor"} data={vendorsList ? vendorsList : ['Vendor 1', 'Vendor 2']} />
                    <AlertInput>{errors?.vendorId?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-3">
                  <ClassTypeSelect query={classId} setQuery={setClassId} required name={"model.classId"} setValue={setValue} title={"Class"} placeholder={"Select class type"} data={classList ? classList : ['Class A', 'Class B']} />
                  <AlertInput>{errors?.model?.classId?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <ClassTypeSelect disabled={!Boolean(classId)} query={categoryId} setQuery={setCategoryId} required name={"model.categoryId"} setValue={setValue} title={"Category"} placeholder={"Select category type"} data={categories ? categories : ['Category A', 'Category B']} />
                  <AlertInput>{errors?.model?.categoryId?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <ClassTypeSelect disabled={!Boolean(categoryId)} query={typeId} setQuery={setTypeId} required name={"model.typeId"} setValue={setValue} title={"Type"} placeholder={"Select asset type"} data={types ? types : ['Type 1', 'Type 2']} />
                  <AlertInput>{errors?.model?.typeId?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField required register={register} label="Model Name" placeholder="Model Name" name="model.name" />
                  <AlertInput>{errors?.model?.name?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} label="Model Brand" placeholder="Model Brand" name="model.brand" />
                  <AlertInput>{errors?.model?.brand?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} label="Model Number" placeholder="Model Number" name="model.number" />
                  <AlertInput>{errors?.model?.number?.message}</AlertInput>
                </div>

                <div className="col-span-10">
                  <Textarea
                    value={description ?? ""} onChange={(event) => {
                      const text = event.currentTarget.value
                      setDescription(text)
                      setValue("description", text)
                    }}
                    placeholder="Asset Description" label="Asset Description" minRows={6} maxRows={6} classNames={{
                      input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                      label: "font-sans text-sm font-normal text-gray-600 text-light"
                    }} />
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value={"2"}>
            <Accordion.Control className='uppercase'>
              <div className="flex gap-2 text-gray-700 items-center">
                <div className="rounded-full flex items-center justify-center h-6 w-6 border-gray-700 border-2 p-1 text-sm">
                  2
                </div>
                <p>Accounting Management</p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="grid grid-cols-9 gap-2">
                <div className="col-span-3">
                  <TypeSelect isString name={"management.currency"} setValue={setValue} title={"Currency"} placeholder={"Select currency type"} data={[{ value: "PHP", label: 'Philippine Peso (Php)' }, { value: "USD", label: 'US Dollar (USD)' }]} />
                  <AlertInput>{errors?.management?.currency?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} type={"number"} label="Original Cost" placeholder="Original Cost" name="management.original_cost" />
                  <AlertInput>{errors?.management?.original_cost?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} type={"number"} label="Current Cost" placeholder="Current Cost" name="management.current_cost" />
                  <AlertInput>{errors?.management?.current_cost?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <TypeSelect isString name={"management.accounting"} setValue={setValue} title={"Accounting Method"} placeholder={"Select accounting method"} data={['Accrual Basis', 'Cash Basis', 'Modified Cash Basis']} />
                  <AlertInput>{errors?.management?.accounting_method?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} type={"number"} label="Residual Value" placeholder="Residual Value" name={"management.residual_value"} />
                  <AlertInput>{errors?.management?.residual_value?.message}</AlertInput>
                </div>
                <div className="col-span-3 space-y-2">
                  <p className='text-sm text-gray-700'>Purchase Date</p>
                  <DatePicker placeholder="Month Day, Year" allowFreeInput size="sm"

                    onChange={value => {
                      setValue("management.purchase_date", value)
                    }} classNames={{
                      input: 'border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400'
                    }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value={"3"}>
            <Accordion.Control className='uppercase'>
              <div className="flex gap-2 text-gray-700 items-center">
                <div className="rounded-full flex items-center justify-center h-6 w-6 border-gray-700 border-2 p-1 text-sm">
                  3
                </div>
                <p>Logistics & Usage Information</p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="grid grid-cols-9 gap-2">
                <div className="col-span-3">
                  <ClassTypeSelect query={companyId} setQuery={setCompanyId} required name={"subsidiaryId"} setValue={setValue} title={"Company"} placeholder={"Select company or subsidiary"} data={companyList ? companyList : ['Company A', 'Company B']} />
                  <AlertInput>{errors?.subsidiaryId?.message}</AlertInput>
                </div>
                <div className="col-span-6">
                  <div className="text-gray-700">
                    <div className="flex flex-1 flex-col gap-2">
                      <label htmlFor="address" className="text-sm">Company Address</label>
                      <input
                        type="text"
                        id={"address"}
                        className={"w-full rounded-md border-2 border-gray-400 disabled:bg-gray-200 disabled:text-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm"
                        }
                        placeholder="Company Address will appear here"
                        value={company_address?.address ? getAddress(company_address) : ""}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-8 gap-2">
                  <div className="col-span-2">
                    <ClassTypeSelect query={departmentId} setQuery={setDepartmentId} disabled={!Boolean(companyId)} name={"locationId"} setValue={setValue} title={"Department"} placeholder={"Select department type"} data={departmentList ? departmentList : ['Department A', 'Department B']} />
                    <AlertInput>{errors?.locationId?.message}</AlertInput>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-700">
                      <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="floor" className="text-sm">Floor</label>
                        <input
                          type="text"
                          id={"floor"}
                          className={"w-full rounded-md border-2 border-gray-400 disabled:bg-gray-200 disabled:text-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm"
                          }
                          placeholder="Floor no."
                          value={selectedDepartment?.floor ?? ""}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-700">
                      <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="address" className="text-sm">Room</label>
                        <input
                          type="text"
                          id={"address"}
                          className={"w-full rounded-md border-2 border-gray-400 disabled:bg-gray-200 disabled:text-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm"
                          }
                          placeholder="Room no."
                          value={selectedDepartment?.room ?? ""}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <TypeSelect name={"custodianId"} setValue={setValue} title={"Custodian"} placeholder={"Assign custodian"} data={employeeList ? employeeList : ['Employee A', 'Employee B']} />
                    <AlertInput>{errors?.custodianId?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-8 gap-2">

                  <div className="col-span-2">
                    <TypeSelect isString name={"management.depreciation_rule"} setValue={setValue} title={"Depreciation Method"} placeholder={"Select method"} data={['Straight Line', 'Others']} />
                    <AlertInput>{errors?.management?.depreciation_rule?.message}</AlertInput>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className='text-sm text-gray-700'>Depreciation Start Date</p>
                    <DatePicker placeholder="Month Day, Year" allowFreeInput size="sm"
                      value={dep_start}
                      onChange={value => {
                        setDepStart(value)
                        setValue("management.depreciation_start", value)
                      }}
                      classNames={{
                        input: 'border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400'
                      }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className='text-sm text-gray-700'>Depreciation End Date</p>
                    <DatePicker placeholder={dep_start ? "Month Day, Year" : "Select start date first"} allowFreeInput size="sm"
                      value={dep_end}
                      disabled={!Boolean(dep_start)}
                      minDate={dep_start ? dep_start : new Date}
                      onChange={value => {
                        setDepEnd(value)
                        setValue("management.depreciation_end", value)
                      }}
                      classNames={{
                        input: 'border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400'
                      }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="col-span-2">
                    <InputField type={"number"} placeholder="Month/s" register={register} label="Period" name="management.depreciation_period" />
                    <AlertInput>{errors?.management?.depreciation_period?.message}</AlertInput>

                  </div>
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
        </Accordion>
        <div className="mt-2 flex w-full justify-end gap-2 text-lg">
          <button className="px-4 py-2 underline">Discard</button>
          <button disabled={!isValid && !isDirty} onClick={() => {
            // console.log(JSON.stringify(errors))
            //no form errors
            if (JSON.stringify(errors) !== "{}") {
              console.error(errors)
            } else {
              const id = `FAS-${moment().format("YY-MDhms")}`
              setValue('number', id)
              setSubmitting(true)
            }
          }}
            className="rounded-md disabled:cursor-not-allowed disabled:bg-tangerine-200 bg-tangerine-300 px-6 py-2 font-medium text-dark-primary hover:bg-tangerine-400">
            Save
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

export default CreateAssetAccordion
