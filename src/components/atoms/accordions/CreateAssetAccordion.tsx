import { Accordion } from '@mantine/core';
import AlertInput from '../forms/AlertInput';
import { InputField } from '../forms/InputField';
import TypeSelect from '../select/TypeSelect';
import { Textarea, Switch } from '@mantine/core'
import { DatePicker } from '@mantine/dates';
import { trpc } from '../../../utils/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AssetCreateInput } from '../../../server/common/schemas/asset';


function AdditionalInfo(props: { register: any, errors: any }) {
  return (<Accordion transitionDuration={300} defaultValue={"1"} classNames={{}}>
    <Accordion.Item value={"1"}>
      <Accordion.Control className='uppercase'>
        <div className="flex gap-2 text-gray-700 items-center">
          <div className="rounded-full flex items-center justify-center h-6 w-6 border-gray-700 border-2 p-1 text-sm">
            1
          </div>
          <p>General Info</p>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="grid grid-cols-9 gap-2">
          <div className='col-span-9 grid grid-cols-8 gap-2'>
            <div className="col-span-2">
              <InputField register={props.register} label="Subsidiary" name="category" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-2">
              <InputField register={props.register} label="Currency" name="name" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-2">
              <InputField register={props.register} label="Custodian" name="name" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-2">
              <InputField register={props.register} label="Physical Location" name="name" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-11 gap-2">
            <div className="col-span-3 space-y-2">
              <p className='text-sm text-gray-700'>Purchase Date</p>
              <DatePicker allowFreeInput size="sm" // value={props.value}
                onChange={value => {// setValue("hired_date", value)
                }} classNames={{
                  input: 'border-2 border-gray-400 h-11 rounded-md'
                }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-3 space-y-2">
              <p className='text-sm text-gray-700'>Depreciation Start Date</p>
              <DatePicker allowFreeInput size="sm" // value={props.value}
                onChange={value => {// setValue("hired_date", value)
                }} classNames={{
                  input: 'border-2 border-gray-400 h-11 rounded-md px-2'
                }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-3 space-y-2">
              <p className='text-sm text-gray-700'>Depreciation End Date</p>
              <DatePicker allowFreeInput size="sm" // value={props.value}
                onChange={value => {// setValue("hired_date", value)
                }} classNames={{
                  input: 'border-2 border-gray-400 h-11 rounded-md px-2'
                }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className='col-span-2'>
              <p className='text-sm text-gray-700'>Depreciation Active</p>
              <Switch color={'yellow'} size="md" />
            </div>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Last Depreciation Amount" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3 space-y-2">
            <p className='text-sm text-gray-700'>Target Depreciation Date</p>
            <DatePicker allowFreeInput size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="col-span-3 space-y-2">
            <p className='text-sm text-gray-700'>Last Depreciation Period</p>
            <DatePicker allowFreeInput size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
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
          <p>Depreciation Rules</p>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-4">
            <InputField register={props.register} label="Acquisition" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Pro-rata" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Disposal" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Mid-Month" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
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
          <p>Revision Rules</p>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <InputField register={props.register} label="Financial Year Start" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Annual Method Entry"} placeholder={"Pick annual method entry"} data={['Method 1', 'Method 2']} />
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Convention" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Period Convention" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Depreciation Period" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <div className='col-span-1'>
              <InputField register={props.register} label="Prior Year NBV" name="category" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className='col-span-1'>
              <InputField register={props.register} label="Group Depreciation" name="category" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-7 gap-2">
            <div className="col-span-2">
              <InputField register={props.register} label="Group Master" name="category" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-2">
              <InputField register={props.register} label="Allow Override" name="category" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-2">
              <InputField register={props.register} label="Add Alternate Method" name="category" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className='col-span-1'>
              <p className='text-sm text-gray-700'>Store History</p>
              <Switch color={'yellow'} size="md" />
            </div>
          </div>
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>);
}
function AssetInfo(props: { register: any, errors: any }) {
  return (<Accordion transitionDuration={300} defaultValue={"1"} classNames={{}}>
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
          <div className="col-span-3">
            <InputField register={props.register} label="Asset Number" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Name" name="name" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Alternate Asset Number" name="name" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Parent Asset"} placeholder={"Select parent asset"} data={['Parent 1', 'Parent 2']} />
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Project"} placeholder={"Select project"} data={['Project 1', 'Project 2']} />
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Type"} placeholder={"Select asset type"} data={['Type 1', 'Type 2']} />
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Serial Number" name="cost" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Residual Value" name="location" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Residual Value Percentage" name="location" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>

          <div className="col-span-10">
            <Textarea placeholder="" label="Asset Description" minRows={6} maxRows={6} classNames={{
              input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
              label: "font-sans text-sm font-normal text-gray-600 text-light"
            }} />
          </div>

          <div className='col-span-9 grid grid-cols-9 gap-2'>
            <div className='col-span-6 grid grid-cols-6 gap-2'>
              <div className="col-span-3">
                <InputField register={props.register} label="Original Cost" name="cost" />
                <AlertInput>{props.errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={props.register} label="Current Cost" name="cost" />
                <AlertInput>{props.errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={props.register} label="Accounting Method" name="cost" />
                <AlertInput>{props.errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-3">
                <InputField register={props.register} label="Asset Lifetime" name="cost" />
                <AlertInput>{props.errors?.name?.message}</AlertInput>
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-2">
              <div className='rounded-md flex items-center text-sm justify-center border-2 border-dashed w-full h-[65%] text-light-muted'>
                <p>Preview of Barcode will appear here</p>
              </div>
              <button className="rounded-md border bg-tangerine-400 hover:bg-tangerine-500 outline-none focus:outline-none text-dark-primary h-[35%] font-semibold w-full px-4 py-2">
                Generate Barcode
              </button>
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
            <InputField register={props.register} label="Subsidiary" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Currency"} placeholder={"Select currency type"} data={['Philippine Peso (Php)', 'US Dollar (USD)']} />
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Custodian" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3 space-y-2">
            <p className='text-sm text-gray-700'>Purchase Date</p>
            <DatePicker allowFreeInput size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="col-span-6">
            <InputField register={props.register} label="Physical Location" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Department"} placeholder={"Select department type"} data={['Department A', 'Department B']} />
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Class"} placeholder={"Select class type"} data={['Class A', ' B']} />
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Location" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
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
          <p>Asset Usage Information</p>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3 space-y-2">
            <p className='text-sm text-gray-700'>Date</p>
            <DatePicker allowFreeInput size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
            <i className=''></i>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Period" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Units Used" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-9">
            <Textarea placeholder="" label="Comments" minRows={6} maxRows={6} classNames={{
              input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
              label: "font-sans text-sm font-normal text-gray-600 text-light"
            }} />
          </div>
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>);
}

type Asset = z.infer<typeof AssetCreateInput>


const CreateAssetAccordion = ({ form }: { form: string }) => {

  const { mutate, isLoading, error } = trpc.vendor.create.useMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Asset>({
    resolver: zodResolver(AssetCreateInput),
    // defaultValues: {
    //   name: "",
    //   email: "",
    // },
  })

  const onSubmit = async (asset: Asset) => {
    // Register function;

    //mutate({
    // name: vendor.name,
    // email: vendor.email,
    //})
    reset()
  }


  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate
      >
        <AssetInfo register={register} errors={errors} />
        <div className="w-full flex gap-2 text-lg justify-end mt-2">
          <button className="underline px-4 py-2">Discard</button>
          <button className="rounded-md bg-tangerine-300 hover:bg-tangerine-400 font-medium text-dark-primary px-6 py-2">Save</button>
        </div>
      </form>
    </div>
  );
}

export default CreateAssetAccordion