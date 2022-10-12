import Head from "next/head"
import Link from "next/link"
import React, { useEffect, useMemo } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { trpc } from "../../../../utils/trpc"
import { InputField } from "../../../../components/atoms/forms/InputField"
import AlertInput from "../../../../components/atoms/forms/AlertInput"
import { useRouter } from "next/router"
import { VendorEditInput } from "../../../../server/common/schemas/vendor"

type Vendor = z.infer<typeof VendorEditInput>

const EmployeeEdit = () => {
  const { vendorId } = useRouter().query

  // Get asset by asset id
  const { data: vendor } = trpc.vendor.findOne.useQuery(Number(vendorId), {
    //  only fetch when assetId is not undefined or null
    enabled: !!vendorId,
  })

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h3 className="mb-2 text-xl font-bold leading-normal text-gray-700 md:text-[2rem]">
          Update Employee - {vendor?.name}
        </h3>
        <EditForm
          vendor={
            {
              id: vendor?.id ?? 0,
              ...vendor,
            } ?? ({} as Vendor)
          }
        />
        <Link href="/auth/login">
          <a className="my-2 px-4 py-1 text-amber-300 underline hover:text-amber-400">
            Login
          </a>
        </Link>
      </main>
    </>
  )
}

export default EmployeeEdit

const EditForm = ({ vendor }: { vendor: Vendor }) => {
  // use utils from use context
  const utils = trpc.useContext()
  const { mutate, isLoading, error } = trpc.vendor.edit.useMutation({
    onSuccess() {
      // invalidate query of vendor id when mutations is successful
      utils.vendor.findOne.invalidate(Number(vendor?.id))
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Vendor>({
    resolver: zodResolver(VendorEditInput),
    defaultValues: useMemo(
      () => ({ ...vendor, id: Number(vendor?.id) }),
      [vendor]
    ),
  })

  useEffect(() => reset(vendor), [vendor, reset])

  const onSubmit = async (employee: Vendor) => {
    // Register function
    mutate(employee)
    reset()
  }

  return (
    <>
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
          {JSON.stringify(error, null, 2)}
        </pre>
      )}
    </>
  )
}
