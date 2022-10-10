import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AssetEditInput } from "../../../../server/common/input-types";
import { trpc } from "../../../../utils/trpc";
import { InputField } from "../../../../components/atoms/forms/InputField";
import AlertInput from "../../../../components/atoms/forms/AlertInput";
import { useRouter } from "next/router";
import _ from "lodash";
import {
  asset_class,
  category,
  employee,
  location,
  manufacturer,
  model,
  supplier,
  type,
  vendor,
} from "@prisma/client";

type Asset = z.infer<typeof AssetEditInput>;

const Register = () => {
  const { assetId } = useRouter().query;

  // Get asset by asset id
  const { data: asset } = trpc.asset.findOne.useQuery(Number(assetId), {
    //  only fetch when assetId is not undefined or null
    enabled: !!assetId,
  });

  // remove null values on asset data
  const editAsset = useMemo(() => {
    if (asset) {
      return _.pickBy(asset);
    }
  }, [asset]);

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h3 className="mb-2 text-xl font-bold leading-normal text-gray-700 md:text-[2rem]">
          Update Asset - {asset?.name}
        </h3>
        <EditForm asset={editAsset} />
        <Link href="/auth/login">
          <a className="my-2 px-4 py-1 text-amber-300 underline hover:text-amber-400">
            Login
          </a>
        </Link>
      </main>
    </>
  );
};

export default Register;

const EditForm = ({
  asset,
}: {
  asset:
    | _.Dictionary<
        | string
        | number
        | boolean
        | supplier
        | manufacturer
        | vendor
        | employee
        | location
        | type
        | asset_class
        | model
        | category
        | Date
        | null
      >
    | undefined;
}) => {
  // use utils from use context
  const utils = trpc.useContext();
  const { mutate, isLoading, error } = trpc.asset.edit.useMutation({
    onSuccess() {
      // invalidate query of asset id when mutations is successful
      utils.asset.findOne.invalidate(Number(asset?.id));
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Asset>({
    resolver: zodResolver(AssetEditInput),
    defaultValues: useMemo(
      () => ({ ...asset, id: Number(asset?.id) }),
      [asset]
    ),
  });

  useEffect(() => reset(asset), [asset, reset]);

  const onSubmit = async (asset: Asset) => {
    // Register function
    mutate(asset);
    reset();
  };

  return (
    <>
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
    </>
  );
};
