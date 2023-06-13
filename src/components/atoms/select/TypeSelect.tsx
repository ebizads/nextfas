import { Select } from "@mantine/core"
import { useEffect, useState } from "react"
import { UseFormSetValue } from "react-hook-form"

export type SelectValueType = {
  value: string
  label: string
}

/* tslint:disable-next-line */
const TypeSelect = (props: {
  defaultValue?: any
  isString?: boolean
  disabled?: boolean
  name: any
  setValue: UseFormSetValue<any>
  value?: string | null | undefined
  title: string
  placeholder: string
  data: string[] | SelectValueType[]
  required?: boolean
}) => {
  const [query, setQuery] = useState<string | null>(props.value ?? null)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-700">
        {props.title}
        {props.required && <span className="text-red-400">*</span>}
      </p>
      <Select
        placeholder={props.placeholder}
        searchable
        value={props.value ?? props.defaultValue}
        onChange={(q) => {
          console.log(q)
          if (q) {
            setQuery(q)
            //q(string) to number, q stands for query or value
            if (props.isString) {
              props.setValue(props.name, q, { shouldValidate: true })
            } else {
              props.setValue(props.name, Number(q), { shouldValidate: true })
            }
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
                text: theme.colorScheme === "dark" ? theme.white : theme.black,
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
          input:
            "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2",
          // item: "selected-item:bg-tangerine-400 "
        }}
      />
    </div>
  )
}
export const ClassTypeSelect = (props: {
  defaultValue?: any | null
  disabled?: boolean
  query: string | null
  setQuery: React.Dispatch<React.SetStateAction<string | null>>
  name: any
  setValue: UseFormSetValue<any>
  value?: string | null | undefined
  title: string
  placeholder: string
  data: string[] | SelectValueType[]
  required?: boolean
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-700">
        {props.title}
        {props.required && <span className="text-red-400">*</span>}
      </p>
      <Select
        placeholder={props.placeholder}
        searchable
        value={props.query ?? props.name}
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
                text: theme.colorScheme === "dark" ? theme.white : theme.black,
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
          input:
            "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2",
          // item: "selected-item:bg-tangerine-400 "
        }}
      />
    </div>
  )
}

export default TypeSelect
