/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultValue } from "@mantine/core/lib/MultiSelect/DefaultValue/DefaultValue"
import { useState, useEffect } from "react"
import { UseFormRegister } from "react-hook-form"

export type InputFieldType = {
  defaultValue?: string
  label: string
  name: string
  type?: string
  className?: string
  withIcon?: string
  isPassword?: boolean
  register: UseFormRegister<any>
  required?: boolean
  placeholder?: string
  disabled?: boolean
  displayOnly?: boolean
  value?: string
  onChange?: string
}

export const InputField = ({
  label,
  name,
  type,
  className,
  withIcon,
  isPassword,
  register,
  required,
  placeholder,
  disabled,
  value,
  onChange,
  defaultValue,
}: // displayOnly

InputFieldType) => {
  const [inputType, setInputType] = useState<string>(type ?? "text")
  useEffect(() => {
    if (Boolean(!value)) {
      value = defaultValue
    }
  }, [])

  return (
    <div className="text-gray-700">
      <div className="relative z-0 flex">
        <div className="flex flex-1 flex-col gap-2">
          {!className && (
            <label htmlFor={name} className="text-sm">
              {label}
              {required && <span className="text-sm text-red-500">*</span>}
            </label>
          )}
          <input
            type={inputType}
            id={name}
            {...register(name, {
              //validate number type of inputs
              valueAsNumber: inputType === "number" ? true : false,
              validate:
                inputType === "number" ? (value) => value > 0 : undefined,
            })}
            className={
              className
                ? className +
                  " peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0  text-sm text-gray-900 placeholder:text-sm focus:border-tangerine-500 focus:outline-none focus:ring-0"
                : "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
            }
            placeholder={placeholder ?? ""}
            disabled={disabled}
          />
          {className && (
            <label
              htmlFor={name}
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-tangerine-600 dark:text-gray-400 peer-focus:dark:text-tangerine-500"
            >
              {label}
            </label>
          )}
          <div
            className="absolute bottom-2 right-0 cursor-pointer text-gray-400 peer-focus:text-tangerine-500"
            onClick={() => {
              if (isPassword) {
                setInputType((prev) => (prev === "text" ? "password" : "text"))
              }
            }}
          >
            <i
              className={
                inputType === "password" ? "fa-solid fa-eye-slash" : withIcon
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputField
