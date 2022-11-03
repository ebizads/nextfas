import { Select } from '@mantine/core';

const TypeSelect = (props: { title: string, placeholder: string, data: string[] }) => {
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-gray-700'>{props.title}</p>
      <Select
        placeholder={props.placeholder}
        searchable
        nothingFound="No options"
        data={[...props.data]}
        clearable
        classNames={{ input: "h-10 border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2" }}
      />
    </div>
  );
}

export default TypeSelect