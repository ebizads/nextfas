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


function GeneralSubtab(props: { register: any, errors: any }) {
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
              <DatePicker dropdownType="modal" size="sm" // value={props.value}
                onChange={value => {// setValue("hired_date", value)
                }} classNames={{
                  input: 'border-2 border-gray-400 h-11 rounded-md px-2'
                }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-3 space-y-2">
              <p className='text-sm text-gray-700'>Depreciation Start Date</p>
              <DatePicker dropdownType="modal" size="sm" // value={props.value}
                onChange={value => {// setValue("hired_date", value)
                }} classNames={{
                  input: 'border-2 border-gray-400 h-11 rounded-md px-2'
                }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-3 space-y-2">
              <p className='text-sm text-gray-700'>Depreciation End Date</p>
              <DatePicker dropdownType="modal" size="sm" // value={props.value}
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
            <DatePicker dropdownType="modal" size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="col-span-3 space-y-2">
            <p className='text-sm text-gray-700'>Last Depreciation Period</p>
            <DatePicker dropdownType="modal" size="sm" // value={props.value}
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
          <p>Asset Details</p>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="grid grid-cols-9 gap-2">
          <div className="col-span-3">
            <InputField register={props.register} label="Category" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Asset Name" name="name" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Type"} placeholder={"Pick asset type"} data={['Type 1', 'Type 2']} />
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Location and Room" name="location" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-5 grid grid-cols-4 gap-2">
            <div className="col-span-2">
              <InputField register={props.register} label="Manufacturer" name="manufacturer" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-2">
              <InputField register={props.register} label="Model" name="model" />
              <AlertInput>{props.errors?.name?.message}</AlertInput>
            </div>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Parent Asset" name="parent_asset" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <TypeSelect title={"Asset Status"} placeholder={"Pick asset status"} data={['Status 1', 'Status 2']} />
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Original Cost" name="cost" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-10">
            <Textarea placeholder="" label="Asset Description" minRows={6} maxRows={6} classNames={{
              input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
              label: "font-sans text-sm font-normal text-gray-600 text-light"
            }} />
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Accounting Method" name="cost" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Current Network Value" name="cost" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-3">
            <InputField register={props.register} label="Current Cost" name="cost" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
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
          <p>Depreciation Info</p>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-4 space-y-2">
            <p className='text-sm text-gray-700'>Depreciation Start</p>
            <DatePicker dropdownType="modal" size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="col-span-4 space-y-2">
            <p className='text-sm text-gray-700'>Depreciation End</p>
            <DatePicker dropdownType="modal" size="sm" // value={props.value}
              onChange={value => {// setValue("hired_date", value)
              }} classNames={{
                input: 'border-2 border-gray-400 h-11 rounded-md px-2'
              }} // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Depreciation Period" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Asset Lifetime Usage" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Residual Value" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
          </div>
          <div className="col-span-4">
            <InputField register={props.register} label="Residual Percentage" name="category" />
            <AlertInput>{props.errors?.name?.message}</AlertInput>
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
    form === "asset info" ?
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
      :
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 p-4"
          noValidate
        >
          <GeneralSubtab register={register} errors={errors} />
          <div className="w-full flex gap-2 text-lg justify-end mt-2">
            <button className="underline px-4 py-2">Discard</button>
            <button className="rounded-md bg-tangerine-300 hover:bg-tangerine-400 font-medium text-dark-primary px-6 py-2">Save</button>
          </div>
        </form>
      </div>
  );
}

export default CreateAssetAccordion