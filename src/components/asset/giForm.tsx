import React, { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssetCreateInput,
  AssetUpdateInput,
  AssetOnlyInput
} from "../../server/schemas/asset";
import { Pagination, Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { AssetClassType, AssetFieldValues, AssetFieldnPurchase } from "../../types/generic";
import { trpc } from "../../utils/trpc"
import InputField from "../atoms/forms/InputField";
import AlertInput from "../atoms/forms/AlertInput";
import TypeSelect, {
  ClassTypeSelect,
  SelectValueType,}
 from "../atoms/select/TypeSelect";
 import JsBarcode from "jsbarcode";
import moment from "moment";
import { useRouter } from "next/router";
import InputNumberField from "../atoms/forms/InputNumberField";
import { Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";




const giForm = () => {
    const { mutate, isLoading, error } = trpc.asset.create.useMutation()
    const [loading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<AssetFieldValues>({
    resolver: zodResolver(AssetOnlyInput),
    defaultValues: {
      management: {
        depreciation_period: 1,
      },
    },
  });
 


  return (

   <div>
    
   </div>

 
  )


}

export default giForm 