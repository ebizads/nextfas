/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { UseFormRegister } from "react-hook-form"

type InputFieldType = {
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
}

export const InputNumberField = ({
  label,
  name,
  className,
  register,
  required,
  placeholder,
  disabled,

}: InputFieldType) => {
  const [input, setInput] = useState<number | null>(null)

  const [value, setValue] = useState<string>('0');


  return (
    <div className="text-gray-700">
      <div className="relative z-0 flex">
        <div className="flex flex-1 flex-col gap-2">
          {!className && (
            <label htmlFor={name} className="text-sm">
              {label}{required && <span className="text-sm text-red-500">*</span>}
            </label>
          )}
          <input
            type={"number"}
            id={name}
            {...register(name, {
              //validate number type of inputs
              valueAsNumber: true,
              validate: (value) => value > 0,
            })}
            className={
              className
                ? className +
                " peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0  text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0 placeholder:text-sm"
                : "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm"
            }
            placeholder={placeholder ?? ""}
            disabled={disabled}
            // onChange={
            //   (e) => {
            //     const re = /^[0-9\b]+$/;
            //     // if (e.target.value === '' || re.test(e.target.value)) {
            //     // if (e.target.value === '') {
            //     //   setInput(0)
            //     // }
            //     if (e.target.value === '') {
            //       console.log('nabura')
            //       setInput(null)
            //     }
            //     else if (re.test(e.target.value)) {
            //       console.log(e.target.value)
            //       setInput(Number(e.target.value))
            //     } else {
            //       console.log("invalid")
            //     }
            //   }
            // }
            // value={input ?? 0}
            value={value}
            onChange={(e) => {
              let result = e.target.value.replace(/\D/g, '');
              // console.log(result)
              if (result) {
                if (result.length === 1) {
                  //value is reset to 0
                  setValue('0')
                } else {
                  //trim all leading zeroes if result length is more than 1
                  while (result.charAt(0) === '0' && result.length > 1) {
                    result = result.substring(1);
                  }
                  setValue(result);
                }
              }

            }}

          />
          {className && (
            <label
              htmlFor={name}
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-tangerine-600 dark:text-gray-400 peer-focus:dark:text-tangerine-500"
            >
              {label}
            </label>
          )}
        </div>
      </div>
    </div>
  )
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
  // displayOnly

}: InputFieldType) => {
  const [inputType, setInputType] = useState<string>(type ?? "text")

  return (
    <div className="text-gray-700">
      <div className="relative z-0 flex">
        <div className="flex flex-1 flex-col gap-2">
          {!className && (
            <label htmlFor={name} className="text-sm">
              {label}{required && <span className="text-sm text-red-500">*</span>}
            </label>
          )}
          <input
            type={inputType}
            id={name}
            {...register(name, {
              //validate number type of inputs
              valueAsNumber: inputType === "number" ? true : false,
              validate: inputType === "number" ? (value) => value > 0 : undefined,
            })}
            className={
              className
                ? className +
                " peer peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0  text-sm text-gray-900 focus:border-tangerine-500 focus:outline-none focus:ring-0 placeholder:text-sm"
                : "w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 placeholder:text-sm"
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
