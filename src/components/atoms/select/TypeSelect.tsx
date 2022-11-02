import { Select } from '@mantine/core';

const TypeSelect = () => {
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-gray-700'>Type</p>
      <Select
        placeholder="Pick vendor type"
        searchable
        nothingFound="No options"
        data={['Company', 'Individual']}
        clearable
        classNames={{ input: "h-10 border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2" }}
      />
    </div>
  );
}

export default TypeSelect