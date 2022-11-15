import { Accordion } from "@mantine/core"
import AlertInput from "../forms/AlertInput"
import { InputField } from "../forms/InputField"
import TypeSelect from "../select/TypeSelect"
import { Textarea } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { trpc } from "../../../utils/trpc"
import {
  useForm, SubmitHandler
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AssetCreateInput } from "../../../server/schemas/asset"
import { AssetFieldValues } from "../../../types/generic"

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
      model: { name: "test" },
      management: {}

    },
  })

  const onSubmit: SubmitHandler<AssetFieldValues> = (data: AssetFieldValues) => {
    console.log("Submitting: ", data)
    reset()
  }

  // const onSubmit = async (asset: AssetFieldValues) => {
  //   console.log("omsim")
  //   console.log(asset)
  //   // Register function;

  //   //mutate({
  //   // name: vendor.name,
  //   // email: vendor.email,
  //   //})
  //   reset()
  // }

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
              <div className="col-span-9 grid grid-cols-2 gap-2">
                <div className="">
                  <InputField register={register} label="Name" name="name" required />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="">
                  <InputField register={register} label="Alternate Asset Number" name="number" />
                  <AlertInput>{errors?.number?.message}</AlertInput>
                </div>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Parent Asset"} placeholder={"Select parent asset"} data={['Parent 1', 'Parent 2']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Project"} placeholder={"Select project"} data={['Project 1', 'Project 2']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Type"} placeholder={"Select asset type"} data={['Type 1', 'Type 2']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-9 grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <InputField register={register} label="Serial Number" name="serial_no" />
                  <AlertInput>{errors?.serial_no?.message}</AlertInput>
                </div>
                <div className="col-span-1">
                  <InputField register={register} label="Residual Value" name={"management.residual_value"} />
                  <AlertInput>{errors?.management?.residual_value?.message}</AlertInput>
                </div>
                {/* <div className="col-span-3">
                <InputField register={register} label="Residual Value Percentage" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div> */}
              </div>

              <div className="col-span-10">
                <Textarea placeholder="" label="Asset Description" minRows={6} maxRows={6} classNames={{
                  input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                  label: "font-sans text-sm font-normal text-gray-600 text-light"
                }} />
              </div>
              <div className='col-span-9 grid grid-cols-6 gap-2'>
                <div className="col-span-3">
                  <InputField register={register} label="Original Cost" name="name" />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} label="Current Cost" name="name" />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} label="Accounting Method" name="name" />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-3">
                  <InputField register={register} label="Asset Lifetime" name="name" />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
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
              <p>Additional Information</p>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="grid grid-cols-9 gap-2">
              <div className="col-span-3">
                <InputField register={register} label="Subsidiary" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Currency"} placeholder={"Select currency type"} data={['Philippine Peso (Php)', 'US Dollar (USD)']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={register} label="Custodian" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3 space-y-2">
                <p className='text-sm text-gray-700'>Purchase Date</p>
                <DatePicker allowFreeInput size="sm" // value={value}
                  onChange={value => {// setValue("hired_date", value)
                  }} classNames={{
                    input: 'border-2 border-gray-400 h-11 rounded-md px-2'
                  }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="col-span-6">
                <InputField register={register} label="Physical Location" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Department"} placeholder={"Select department type"} data={['Department A', 'Department B']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <TypeSelect name={"name"} setValue={setValue} title={"Class"} placeholder={"Select class type"} data={['Class A', ' B']} />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={register} label="Location" name="name" />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value={"3"}>
          <Accordion.Control className="uppercase">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-700 p-1 text-sm">
                3
              </div>
              <p>Asset Usage Information</p>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="grid grid-cols-9 gap-2">
              <div className="col-span-3 space-y-2">
                <p className="text-sm text-gray-700">Date</p>
                <DatePicker
                  dropdownType="modal"
                  size="sm" // value={value}
                  onChange={(value) => {
                    // setValue("hired_date", value)
                  }}
                  classNames={{
                    input: "border-2 border-gray-400 h-11 rounded-md px-2",
                  }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="col-span-3">
                <InputField
                  register={register}
                  label="Period"
                  name="name"
                />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField
                  register={register}
                  label="Units Used"
                  name="name"
                />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-9">
                <Textarea
                  placeholder=""
                  label="Comments"
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
