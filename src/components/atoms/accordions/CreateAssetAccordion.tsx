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
import { useMemo, useState } from "react"


const CreateAssetAccordion = () => {

  const { mutate, isLoading, error } = trpc.asset.create.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetCreateInput),
    defaultValues: {
      management: {}
    },
  })


  //gets and sets all assets
  const { data: assetsData, isLoading: assetsDataLoading, error: assetsDataError } = trpc.asset.findAll.useQuery()
  const assetsList = useMemo(() => assetsData?.assets.map((asset) => { return { value: asset.id.toString(), label: asset.name } }), [assetsData]) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: projectsData, isLoading: projectsDataLoading, error: projectsDataError } = trpc.assetProject.findAll.useQuery()
  const projectsList = useMemo(() => projectsData?.map((project) => { return { value: project.id.toString(), label: project.name } }), [projectsData]) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: vendorsData, isLoading: vendorsDataLoading, error: vendorsDataError } = trpc.vendor.findAll.useQuery()
  const vendorsList = useMemo(() => vendorsData?.vendors.map((vendor) => { return { value: vendor.id.toString(), label: vendor.name } }), [vendorsData]) as SelectValueType[] | undefined

  //gets and sets all class, categories, and types
  const { data: classData, isLoading: classDataLoading, error: classDataError } = trpc.assetClass.findAll.useQuery()
  const classList = useMemo(() => classData?.map((classItem) => { return { value: classItem.id.toString(), label: classItem.name } }), [classData]) as SelectValueType[] | undefined

  const [classId, setClassId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)

  //asset description
  const [description, setDescription] = useState<string | null>(null)

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
  }, [categoryId, classData])


  // console.log(classData)
  // console.log(watch())

  const onSubmit: SubmitHandler<AssetFieldValues> = (data: AssetFieldValues) => {
    console.log("Submitting: ", data)
    reset()
  }

  return (

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
                <TypeSelect name={"management.currency"} setValue={setValue} title={"Currency"} placeholder={"Select currency type"} data={[{ value: "PHP", label: 'Philippine Peso (Php)' }, { value: "USD", label: 'US Dollar (USD)' }]} />
                <AlertInput>{errors?.management?.currency?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={register} label="Original Cost" placeholder="Original Cost" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={register} label="Current Cost" placeholder="Current Cost" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Accounting Method"} placeholder={"Select accounting method"} data={['Accrual Basis', 'Cash Basis', 'Modified Cash Basis']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={register} label="Residual Value" placeholder="Residual Value" name={"management.residual_value"} />
                <AlertInput>{errors?.management?.residual_value?.message}</AlertInput>
              </div>
              <div className="col-span-3 space-y-2">
                <p className='text-sm text-gray-700'>Purchase Date</p>
                <DatePicker placeholder="Month Day, Year" allowFreeInput size="sm" // value={value}
                  onChange={value => {// setValue("hired_date", value)
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
                <TypeSelect required name={"name"} setValue={setValue} title={"Company"} placeholder={"Select company or subsidiary"} data={['Company A', 'Company B']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-6">
                <InputField disabled register={register} label="Company address" placeholder="Company Address " name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-9 grid grid-cols-8 gap-2">
                <div className="col-span-2">
                  <TypeSelect name={"name"} setValue={setValue} title={"Department"} placeholder={"Select department type"} data={['Department A', 'Department B']} />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <TypeSelect name={"name"} setValue={setValue} title={"Floor"} placeholder={"Select floor"} data={['Department A', 'Department B']} />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <TypeSelect name={"name"} setValue={setValue} title={"Room"} placeholder={"Select room"} data={['Room A', 'Room B']} />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <TypeSelect name={"name"} setValue={setValue} title={"Custodian"} placeholder={"Assign custodian"} data={['Employee A', 'Employee B']} />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
              </div>
              <div className="col-span-2">
                <TypeSelect name={"name"} setValue={setValue} title={"Depreciation Method"} placeholder={"Select depreciation method"} data={['Straight Line', 'Others']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3 space-y-2">
                <p className='text-sm text-gray-700'>Depreciation Start Date</p>
                <DatePicker placeholder="Month Day, Year" allowFreeInput size="sm" // value={value}
                  onChange={value => {// setValue("hired_date", value)
                  }} classNames={{
                    input: 'border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400'
                  }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="col-span-3 space-y-2">
                <p className='text-sm text-gray-700'>Depreciation End Date</p>
                <DatePicker placeholder="Month Day, Year" allowFreeInput size="sm" // value={value}
                  onChange={value => {// setValue("hired_date", value)
                  }} classNames={{
                    input: 'border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400'
                  }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="col-span-1">
                <InputField disabled placeholder="Day/s" register={register} label="Lifetime" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-9">
                <Textarea
                  placeholder="Remarks"
                  label="Remarks"
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
        <button className="px-4 py-2 underline">Discard</button>
        <button type="submit" onClick={() => {
          console.log(errors)
        }} className="rounded-md bg-tangerine-300 px-6 py-2 font-medium text-dark-primary hover:bg-tangerine-400">
          Save
        </button>
      </div>
    </form>
  )
}

export default CreateAssetAccordion
