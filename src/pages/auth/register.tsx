import Head from "next/head"
import Link from "next/link"
import React, { useState } from "react"
import { z } from "zod"
import { InputField } from "../../components/atoms/forms/InputField"
import { trpc } from "../../utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import AlertInput from "../../components/atoms/forms/AlertInput"
import PasswordChecker from "../../components/atoms/forms/PasswordChecker"
import { CreateUserInput } from "../../server/schemas/user"
import { generateRandomPass } from "../../lib/functions"
import { User } from "tabler-icons-react"
import Modal from "../../components/headless/modal/modal"

type User = z.infer<typeof CreateUserInput>

function Register() {
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [passwordCheck, setPassword] = useState<string>("")

  const { mutate, isLoading, error } = trpc.user.create.useMutation({
    onSuccess() {
      setCompleteModal(true)

      // invalidate query of asset id when mutations is successful
      //utils.asset.findAll.invalidate()
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(CreateUserInput), // Configuration the validation with the zod schema.
    defaultValues: {
      name: "test",
      email: "testing@fas.com",
      profile: {
        first_name: "",
        last_name: "",
      },
      firstLogin: true,
      password: "",
    },
  })

  // The onSubmit function is invoked by RHF only if the validation is OK.
  const onSubmit = async (user: User) => {
    // Register function
    mutate({
      ...user,
      oldPassword: user.oldPassword,
      password: passwordCheck,
      email: `test.${user.profile.last_name}@fas.com`,
      name: `${user.profile.first_name} ${user.profile.last_name}`,
      profile: {
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
      },
      address: {
        street: "Test",
        city: "Manila",
        country: "Philippines",
        state: "Metro Manila",
        zip: "1000",
      },
      inactivityDate: new Date(),
      passwordAge: new Date(),
    })
    console.log(passwordCheck)
    console.log(user)
    reset()
  }

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h3 className="mb-2 text-xl font-bold leading-normal text-gray-700 md:text-[2rem]">
          Register
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
          noValidate
        >
          <InputField
            register={register}
            label="First Name"
            name="profile.first_name"
            className="border-b"
          />
          <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>

          <InputField
            register={register}
            label="Last Name"
            name="profile.last_name"
            className="border-b"
          />
          <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>

          {/* <InputField
            label="Password"
            register={register}
            name="password"
            type="password"
            className="border-b"
            withIcon="fa-solid fa-eye"
            isPassword={true}
          />
          <PasswordChecker password={watch().password} /> */}

          <AlertInput>{errors?.password?.message}</AlertInput>
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isLoading}
            onClick={() => setPassword(generateRandomPass())}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        {error && (
          <pre className="mt-2 text-sm italic text-red-500">
            Something went wrong!
          </pre>
        )}
        <Link href="/auth/login">
          <a className="my-2 px-4 py-1 text-amber-300 underline hover:text-amber-400">
            Login
          </a>
        </Link>
        <Modal
          isVisible={completeModal}
          setIsVisible={setCompleteModal}
          className="max-w-2xl"
          title="New Account"
        >
          <div className="flex w-full flex-col px-4 py-2">
            <div>
              <p className="text-center text-lg font-semibold">
                New account registration successful.
              </p>

              <p className="text-center text-lg font-semibold">Password: {passwordCheck}</p>
            </div>
            <button
              className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={() => {
                setCompleteModal(false)
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      </main>
    </>
  )
}

export default Register
