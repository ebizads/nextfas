import { Select } from '@mantine/core';
import { useState } from 'react';
import { UseFormSetValue } from "react-hook-form"
import { AssetFieldValues } from '../../../types/generic';

export type SelectValueType = {
  value: string,
  label: string
}

//keyof returns strict keys of an object
const TypeSelect = (props: { name: any, setValue: UseFormSetValue<any>, title: string, placeholder: string, data: string[] | SelectValueType[], required?: boolean }) => {

  const [query, setQuery] = useState<string | null>(null)

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-gray-700'>{props.title}{props.required && <span className='text-red-400'>*</span>}</p>
      <Select
        placeholder={props.placeholder}
        searchable
        value={query}
        onChange={(q) => {
          if (q) {
            setQuery(q)
            //q(string) to number, q stands for query or value 
            props.setValue(props.name, Number(q), { shouldValidate: true })
          } else {
            //on clear event
            setQuery(null)
            props.setValue(props.name, undefined, { shouldValidate: true })
          }
        }}
        // styles={(theme) => ({
        //   item: {
        //     // applies styles to selected item
        //     "&[data-selected]": {
        //       "&, &:hover": {
        //         backgroundColor:
        //           theme.colorScheme === "light"
        //             ? theme.colors.orange[3]
        //             : theme.colors.orange[1],
        //         color:
        //           theme.colorScheme === "dark"
        //             ? theme.white
        //             : theme.black,
        //       },
        //     },

        //     // applies styles to hovered item (with mouse or keyboard)
        //     "&[data-hovered]": {},
        //   },
        // })}

        nothingFound="No options"
        data={[...props.data]}
        clearable
        classNames={{
          input: "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 selected:bg-tangerine-200 &[data-selected]:bg-red-50",
          item: "&[data-selected]:bg-tangerine-100"
        }}
      />
    </div>
  );
}

export default TypeSelect