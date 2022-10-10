/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type InputFieldType = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  withIcon?: string;
  isPassword?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
};

export function InputField({
  label,
  name,
  type,
  className,
  withIcon,
  isPassword,
  register,
}: InputFieldType) {
  const [inputType, setInputType] = useState<string>(type ?? "text");

  return (
    <div className="text-gray-700">
      <div className="relative z-0 flex">
        <div className="flex-1">
          <input
            type={inputType}
            id={name}
            {...register(name)}
            className={
              className
                ? className +
                  " block py-2.5 px-0 w-full peer text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-tangerine-500 focus:outline-none focus:ring-0 peer"
                : "outline-none focus:outline-none focus:ring-2 ring-amber-200/40 px-4 py-2 rounded-md border-2  bg-transparent border-gray-400 focus:border-amber-200 text-gray-600"
            }
            placeholder=" "
          />
          <label
            htmlFor={name}
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-tangerine-600 peer-focus:dark:text-tangerine-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {label}
          </label>
          <div
            className="peer-focus:text-tangerine-500 cursor-pointer text-gray-400 absolute bottom-2 right-0"
            onClick={() => {
              if (isPassword) {
                setInputType((prev) => (prev === "text" ? "password" : "text"));
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
  );
}
