import { Checkbox } from "@mantine/core"
import { signIn } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import React, { useState } from "react"
import { InputField } from "../../components/atoms/forms/InputField"

import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { useForm } from "react-hook-form"
import AlertInput from "../../components/atoms/forms/AlertInput"
import { router } from "trpc"
import { userRouter } from "../../server/trpc/router/user"
import { useRouter } from "next/router"
// input validations
// Describe the correctness of data's form.
const userSchema = z.object({
  username: z.string().min(1, { message: "The username is required" }).trim(),
  password: z
    .string()
    .min(1, { message: "The password is invalid" })
    .max(20, { message: "The password is invalid" }),
  firstLogin:  z.boolean().nullish(),
})

// Infer the TS type according to the zod schema.
type User = z.infer<typeof userSchema>

// Global Alert div.
export function Alert({
  children,
  clearErrors,
}: {
  children: string
  clearErrors: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border-2 border-red-200 bg-red-100 p-4 text-sm text-red-500">
      {children}
      <i
        className="fa-solid fa-xmark cursor-pointer text-xs"
        onClick={() => clearErrors()}
      />
    </div>
  )
}

function LoginForm() {
  
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)


  //get client ip address
  // const { data } = useQuery(["ip"], async () => {
  //   return await fetch("/api/ip").then((res) => res.json())
  // })

  //get user
  // const { data: session, status } = useSession()

  const {
    register,
    handleSubmit,
    // watch,
    clearErrors,
    formState: { errors, isSubmitting },
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
      callbackUrl: "/assets",
    })

     setError(res?.error as string)
    if (res?.error) {
       console.log("May error ", res?.error)
    } else {
      router.push(res?.url as string)
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-[65%] space-y-8">
        <h3 className="text-xl font-bold leading-normal text-tangerine-500 md:text-[2rem]">
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
              withIcon="fa-solid fa-eye"
              isPassword
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
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
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
        <div className="text-xs italic text-light-secondary">
          ver.0.0.1-test
        </div>
        {error && (
          <div className="text-wrap mt-2 font-sans text-sm italic text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

const Login = () => {
  const router = useRouter();
  function onRegister() {
    router.push("../auth/register")
  }

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center border">
        <div className="grid h-[495px] w-[70%] grid-cols-2 rounded-3xl shadow-md transition-width duration-150 xl:w-[55%]">
          <div className="relative h-full w-full">
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
        <button
          onClick={() => {
            onRegister()
          }}
        >
        </button>
      </main>
    </>
  )
}

export default Login
