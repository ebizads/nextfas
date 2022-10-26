import Head from "next/head"
import Link from "next/link"
import React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { trpc } from "../../../utils/trpc"
import { InputField } from "../../../components/atoms/forms/InputField"
import AlertInput from "../../../components/atoms/forms/AlertInput"
import { AssetCreateInput } from "../../../server/common/schemas/asset"

type Asset = z.infer<typeof AssetCreateInput>

const RegisterAsset = () => {
  const { mutate, isLoading, error } = trpc.asset.create.useMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Asset>({
    resolver: zodResolver(AssetCreateInput),
    defaultValues: {
      name: "",
      number: "",
    },
  })

  const onSubmit = async (asset: Asset) => {
    // Register function
    mutate({
      name: asset.name,
      number: asset.number,
      model: {
        name: "z-omsim",
        brand: "OMSKIRT",
        number: "2",
      },
      general: {
        purchase_date: new Date(),
        currency: "PHP",
        classId: 1,
        custodianId: 1,
        location: {
          department: "DevOps",
          floor: "7th",
          room: "7-1",
        },
      },
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
          Create Asset
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
          noValidate
        >
          <InputField
            register={register}
            label="Asset Name"
            name="name"
            className="border-b"
          />
          <AlertInput>{errors?.name?.message}</AlertInput>

          <InputField
            register={register}
            label="Asset Number"
            name="number"
            className="border-b"
          />
          <AlertInput>{errors?.number?.message}</AlertInput>

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
        <Link href="/auth/login">
          <a className="my-2 px-4 py-1 text-amber-300 underline hover:text-amber-400">
            Login
          </a>
        </Link>
      </main>
    </>
  )
}

export default RegisterAsset
