import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Tabs } from '@mantine/core'
import { AssetCreateInput } from "../../server/common/schemas/asset";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputField } from "../../components/atoms/forms/InputField";
import AlertInput from "../../components/atoms/forms/AlertInput";
import TypeSelect from "../../components/atoms/select/TypeSelect";
import CreateAssetAccordion from "../../components/atoms/accordions/CreateAssetAccordion";

type Asset = z.infer<typeof AssetCreateInput>

const CreateAsset = () => {


  const { mutate, isLoading, error } = trpc.vendor.create.useMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Asset>({
    resolver: zodResolver(AssetCreateInput),
    // defaultValues: {
    //   name: "",
    //   email: "",
    // },
  })

  const onSubmit = async (asset: Asset) => {
    // Register function;

    //mutate({
    // name: vendor.name,
    // email: vendor.email,
    //})
    reset()
  }


  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <h3 className="text-xl font-medium">Add Asset</h3>
        <div className="h-full w-full">
          <Tabs defaultValue="first" className="space-y-2 h-full" classNames={{ tab: "border border-blue-200 aria-selected:text-tangerine-600 font-sans" }}>
            <Tabs.List>
              <Tabs.Tab value="first" color={"orange"}>Asset Info</Tabs.Tab>
              <Tabs.Tab value="second" color={"orange"}>General Subtab</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="first">
              <div className="rounded-md h-full bg-white border p-4 flex flex-col gap-2">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col space-y-4 p-4"
                  noValidate
                >
                  <CreateAssetAccordion register={register} errors={errors} />
                  <div className="w-full flex gap-2 text-lg justify-end">
                    <button className="underline px-4 py-2">Discard</button>
                    <button className="rounded-md bg-tangerine-300 hover:bg-tangerine-400 font-medium text-dark-primary px-6 py-2">Save</button>
                  </div>
                </form>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="second">Second panel</Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAsset;
