import { Checkbox } from "@mantine/core"
import { signIn } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { InputField } from "../../components/common/InputField"

import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { useForm } from "react-hook-form"
import AlertInput from "../../components/common/AlertInput"

// TODO input validations
// Describe the correctness of data's form.
const userSchema = z.object({
  username: z.string().min(1, { message: "The username is required" }).trim(),
  password: z
    .string()
    .min(1, { message: "The password is invalid" })
    .max(20, { message: "The password is invalid" }),
})

// Infer the TS type according to the zod schema.
type User = z.infer<typeof userSchema>

// Global Alert div.
function Alert({
  children,
  clearErrors,
}: {
  children: string
  clearErrors: any
}) {
  return (
    <div className="rounded-lg p-4 border-2 border-red-200 bg-red-100 text-sm text-red-500 flex gap-2 justify-between items-center">
      {children}
      <i
        className="fa-solid fa-xmark text-xs cursor-pointer"
        onClick={() => clearErrors()}
      />
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitted, isDirty, isValid },
  } = useForm<User>({
    resolver: zodResolver(userSchema), // Configuration the validation with the zod schema.
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  const onSubmit = async (user: User) => {
    // Login function

    const res = await signIn("credentials", {
      redirect: false,
      username: user.username,
      password: user.password,
      callbackUrl: "/",
    })

    if (res?.error) {
      setError(res.error)
    } else {
      router.push(res?.url as string)
    }
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="space-y-8 w-[65%]">
        <h3 className="text-xl md:text-[2rem] leading-normal font-bold text-tangerine-500">
          Login
        </h3>
        {Boolean(Object.keys(errors)?.length) && (
          <Alert clearErrors={clearErrors}>There are errors in the form.</Alert>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div>
            <InputField
              register={register}
              label="Username"
              name="username"
              className="border-b"
              withIcon="fa-solid fa-user"
            />
            <AlertInput>{errors?.username?.message}</AlertInput>
          </div>
          <div>
            <InputField
              register={register}
              label="Password"
              name="password"
              type="password"
              className="border-b"
              withIcon="fa-solid fa-lock"
            />
            <AlertInput>{errors?.password?.message}</AlertInput>
          </div>

          <Checkbox
            label="Remember me"
            classNames={{
              label: "font-sans",
              input:
                "checked:bg-tangerine-500 checked:border-tangerine-500 border-tangerine-500",
            }}
          />
          <button
            type="submit"
            className="px-4 py-1 bg-tangerine-500 hover:bg-tangerine-400 duration-150 text-white rounded font-medium disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="w-full text-end">
          <a
            className="text-xs italic text-light-secondary hover:underline"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
        {error && (
          <pre className="text-red-500 text-sm mt-2 italic font-sans">
            {error}
          </pre>
        )}
      </div>
    </div>
  )
}

const Login = () => {
  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center min-h-screen border">
        <div className="grid grid-cols-2 w-[70%] xl:w-[55%] duration-150 transition-width h-[495px] rounded-3xl shadow-md">
          <div className="relative w-full h-full">
            <Image
              src="/login.svg"
              alt="no image"
              objectFit="cover"
              layout="fill"
              className="rounded-tl-3xl rounded-bl-3xl"
            />
          </div>
          <LoginForm />
        </div>
        {/* <Link href="/auth/register">
          <a className="px-4 py-1 text-amber-300 hover:text-amber-400 underline my-2">
            Register
          </a>
        </Link> */}
      </main>
    </>
  )
}

export default Login
