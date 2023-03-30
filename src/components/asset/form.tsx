import React, { FormEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssetCreateInput,
  AssetUpdateInput,
} from "../../server/schemas/asset";
import { AssetClassType, AssetFieldValues } from "../../types/generic";
import { trpc } from "../../utils/trpc"


const { mutate, isLoading, error } = trpc.asset.create.useMutation()

const form = () => {
  const {
    register,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetCreateInput),
    defaultValues: {
      management: {
        depreciation_period: 1,
      },
    },
  });

  
  const onSubmit: SubmitHandler<AssetFieldValues> = (
    form_data: AssetFieldValues
  ) => {
    if (error) {
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", errors)
    } 
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate>
            
          
        </form>
      );
  };


  

export default form;
