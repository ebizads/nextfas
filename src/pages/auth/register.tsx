import Head from "next/head"
import Link from "next/link"
import React from "react"
import { z } from "zod"
import { InputField } from "../../components/common/InputField"
import { trpc } from "../../utils/trpc"
import { RegisterUserInput } from "../../server/common/input-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import AlertInput from "../../components/common/AlertInput"

// TODO input validations
type User = z.infer<typeof RegisterUserInput>

const Register = () => {
  const { mutate, isLoading, error } = trpc.auth.register.useMutation()
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitted, isDirty, isValid },
  } = useForm<User>({
    resolver: zodResolver(RegisterUserInput), // Configuration the validation with the zod schema.
    defaultValues: {
      profile: {
        first_name: "",
        last_name: "",
      },
      email: "",
      password: "",
    },
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  const onSubmit = async (user: User) => {
    // Register function
    mutate({
      email: user.email,
      password: user.password,
      name: `${user.profile.first_name} ${user.profile.last_name}`,
      profile: {
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
      },
    })
  }

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h3 className="text-xl md:text-[2rem] leading-normal font-bold text-gray-700 mb-2">
          Register
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <InputField
            register={register}
            label="First Name"
            name="profile.first_name"
          />
          <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>

          <InputField
            register={register}
            label="Last Name"
            name="profile.last_name"
          />
          <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>

          <InputField label="Email" name="email" register={register} />
          <AlertInput>{errors?.email?.message}</AlertInput>

          <InputField
            label="Password"
            register={register}
            name="password"
            type="password"
          />
          <AlertInput>{errors?.password?.message}</AlertInput>
          <button
            type="submit"
            className="px-4 py-1 bg-amber-300 hover:bg-amber-400 text-white rounded"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        {error && (
          <pre className="text-red-500 text-sm mt-2 italic">
            Something went wrong!
          </pre>
        )}
        <Link href="/auth/login">
          <a className="px-4 py-1 text-amber-300 hover:text-amber-400 underline my-2">
            Login
          </a>
        </Link>
      </main>
    </>
  )
}

export default Register
