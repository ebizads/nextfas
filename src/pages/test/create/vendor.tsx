
import Head from "next/head"
import Link from "next/link"
import React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { trpc } from "../../../utils/trpc"
import { InputField } from "../../../components/atoms/forms/InputField"
import AlertInput from "../../../components/atoms/forms/AlertInput"
import { VendorCreateInput } from "../../../server/schemas/vendor"
import { AddressCreateInput } from "../../../server/schemas/address"


type Vendor = z.infer<typeof VendorCreateInput>


const RegisterVendor = () => {
  const { mutate, isLoading, error } = trpc.vendor.create.useMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Vendor>({
    resolver: zodResolver(VendorCreateInput),
    defaultValues: {
      name: "",
      email: "",
    },
  })


  const onSubmit = async (vendor: Vendor) => {
    // Register function;


    mutate({
      name: vendor.name,
      email: vendor.email,
      address: vendor.address,
      phone_no: []
    })
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
          Create Vendor
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
          noValidate
        >
          <InputField
            register={register}
            label="Vendor Name"
            name="name"
            className="border-b"
          />
          <AlertInput>{errors?.name?.message}</AlertInput>


          <InputField
            register={register}
            label="Email"
            name="email"
            className="border-b"
          />
          <AlertInput>{errors?.email?.message}</AlertInput>


          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        {error && (
          <pre className="mt-2 text-sm italic text-red-500">
            Something went wrong!
            {JSON.stringify({ error }, null, 2)}
          </pre>
        )}
        <Link href="/auth/login">
          <a className="my-2 px-4 py-1 text-amber-300 underline hover:text-amber-400">
            Login
          </a>
        </Link>
      </main>
    </>
  )
}


export default RegisterVendor



