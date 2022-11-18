import { Select } from '@mantine/core';
import { useState } from 'react';
import { UseFormSetValue } from "react-hook-form"

export type SelectValueType = {
  value: string,
  label: string
}

//keyof returns strict keys of an object
const TypeSelect = (props: { disabled?: boolean, name: any, setValue: UseFormSetValue<any>, title: string, placeholder: string, data: string[] | SelectValueType[], required?: boolean }) => {

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
        disabled={props.disabled}
        styles={(theme) => ({
          item: {
            // applies styles to selected item
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor:
                  theme.colorScheme === "light"
                    ? theme.colors.orange[4]
                    : theme.colors.orange[1],
                text:
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.black,
              },
            },

            // applies styles to hovered item (with mouse or keyboard)
            "&[data-hovered]": {},
          },
        })}

        nothingFound="No options"
        data={[...props.data]}
        clearable
        classNames={{
          input: "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2",
          // item: "selected-item:bg-tangerine-400 "
        }}
      />
    </div>
  );
}
export const ClassTypeSelect = (props: { disabled?: boolean, query: string | null, setQuery: React.Dispatch<React.SetStateAction<string | null>>, name: any, setValue: UseFormSetValue<any>, title: string, placeholder: string, data: string[] | SelectValueType[], required?: boolean }) => {

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-gray-700'>{props.title}{props.required && <span className='text-red-400'>*</span>}</p>
      <Select
        placeholder={props.placeholder}
        searchable
        value={props.query}
        onChange={(q) => {
          if (q) {
            props.setQuery(q)
            //q(string) to number, q stands for query or value 
            props.setValue(props.name, Number(q), { shouldValidate: true })
          } else {
            //on clear event
            props.setQuery(null)
            props.setValue(props.name, undefined, { shouldValidate: true })
          }
        }}
        disabled={props.disabled}
        styles={(theme) => ({
          item: {
            // applies styles to selected item
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor:
                  theme.colorScheme === "light"
                    ? theme.colors.orange[4]
                    : theme.colors.orange[1],
                text:
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.black,
              },
            },

            // applies styles to hovered item (with mouse or keyboard)
            "&[data-hovered]": {},
          },
        })}

        nothingFound="No options"
        data={[...props.data]}
        clearable
        classNames={{
          input: "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2",
          // item: "selected-item:bg-tangerine-400 "
        }}
      />
    </div>
  );
}


export default TypeSelect