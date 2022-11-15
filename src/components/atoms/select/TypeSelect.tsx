import { Select } from '@mantine/core';
import { useState } from 'react';
import { UseFormSetValue } from "react-hook-form"
import { AssetFieldValues } from '../../../types/generic';

//keyof returns strict keys of an object
const TypeSelect = (props: { name: keyof AssetFieldValues, setValue: UseFormSetValue<AssetFieldValues>, title: string, placeholder: string, data: string[] }) => {

  const [query, setQuery] = useState<string | null>(null)

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-gray-700'>{props.title}</p>
      <Select
        placeholder={props.placeholder}
        searchable
        value={query}
        onChange={(q) => {
          if (q) {
            setQuery(q)
            props.setValue(props.name, q, { shouldValidate: true })
          }
        }}
        nothingFound="No options"
        data={[...props.data]}
        clearable
        classNames={{ input: "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2" }}
      />
    </div>
  );
}

export default TypeSelect