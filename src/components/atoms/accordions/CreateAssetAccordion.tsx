import { Accordion } from '@mantine/core';
import AlertInput from '../forms/AlertInput';
import { InputField } from '../forms/InputField';
import TypeSelect from '../select/TypeSelect';
import { Textarea } from '@mantine/core'
import { DatePicker } from '@mantine/dates';

const CreateAssetAccordion = ({ register, errors }: { register: any, errors: any }) => {

  return (
    <Accordion transitionDuration={500} classNames={{}}>
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
              <InputField
                register={register}
                label="Category"
                name="category"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-3">
              <InputField
                register={register}
                label="Asset Name"
                name="name"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-3">
              <TypeSelect title={"Type"} placeholder={"Pick asset type"} data={['Type 1', 'Type 2']} />
            </div>
            <div className="col-span-4">
              <InputField
                register={register}
                label="Location and Room"
                name="location"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-5 grid grid-cols-4 gap-2">
              <div className="col-span-2">
                <InputField
                  register={register}
                  label="Manufacturer"
                  name="manufacturer"
                />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
              <div className="col-span-2">
                <InputField
                  register={register}
                  label="Model"
                  name="model"
                />
                <AlertInput>{errors?.name?.message}</AlertInput>
              </div>
            </div>
            <div className="col-span-3">
              <InputField
                register={register}
                label="Parent Asset"
                name="parent_asset"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-3">
              <TypeSelect title={"Asset Status"} placeholder={"Pick asset status"} data={['Status 1', 'Status 2']} />
            </div>
            <div className="col-span-3">
              <InputField
                register={register}
                label="Original Cost"
                name="cost"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-10">
              <Textarea
                placeholder=""
                label="Asset Description"
                minRows={6}
                maxRows={6}
                classNames={{ input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2", label: "font-sans text-sm font-normal text-gray-600 text-light" }}
              />
            </div>
            <div className="col-span-3">
              <InputField
                register={register}
                label="Accounting Method"
                name="cost"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-3">
              <InputField
                register={register}
                label="Current Network Value"
                name="cost"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-3">
              <InputField
                register={register}
                label="Current Cost"
                name="cost"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
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
              <DatePicker
                dropdownType="modal"
                size="sm"
                // value={props.value}
                onChange={(value) => {
                  // setValue("hired_date", value)
                }}
                classNames={{ input: 'border-2 border-gray-400 h-11 rounded-md px-2', }}
              // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-4 space-y-2">
              <p className='text-sm text-gray-700'>Depreciation End</p>
              <DatePicker
                dropdownType="modal"
                size="sm"
                // value={props.value}
                onChange={(value) => {
                  // setValue("hired_date", value)
                }}
                classNames={{ input: 'border-2 border-gray-400 h-11 rounded-md px-2', }}
              // className="peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-3 text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-4">
              <InputField
                register={register}
                label="Depreciation Period"
                name="category"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-4">
              <InputField
                register={register}
                label="Asset Lifetime Usage"
                name="category"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-4">
              <InputField
                register={register}
                label="Residual Value"
                name="category"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
            <div className="col-span-4">
              <InputField
                register={register}
                label="Residual Percentage"
                name="category"
              />
              <AlertInput>{errors?.name?.message}</AlertInput>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default CreateAssetAccordion