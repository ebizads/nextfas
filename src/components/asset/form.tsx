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






const AssetsForm = () => {
  
const { mutate, isLoading, error } = trpc.asset.create.useMutation()

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

  const [classId, setClassId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)
  const [serialId, setSerialId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(null)

  //gets and sets all assets
  const { data: assetsData } = trpc.asset.findAll.useQuery()
  const assetsList = useMemo(
    () =>
      assetsData?.assets
        .filter((item) => item.id != 0)
        .map((asset) => {
          return { value: asset.id.toString(), label: asset.name }
        }),
    [assetsData]
  ) as SelectValueType[] | undefined



  //gets and sets all vendors
  const { data: vendorsData } = trpc.vendor.findAll.useQuery()
  const vendorsList = useMemo(
    () =>
      vendorsData?.vendors
        .filter((item) => item.id != 0)
        .map((vendor) => {
          return { value: vendor.id.toString(), label: vendor.name }
        }),
    [vendorsData]
  ) as SelectValueType[] | undefined

  //gets and sets all companies
  const { data: companyData } = trpc.company.findAll.useQuery()
  const companyList = useMemo(
    () =>
      companyData?.companies
        .filter((item) => item.id != 0)
        .map((company) => {
          return { value: company.id.toString(), label: company.name }
        }),
    [companyData]
  ) as SelectValueType[] | undefined

  //gets and sets all projects
  const { data: projectsData } = trpc.assetProject.findAll.useQuery()
  const projectsList = useMemo(
    () =>
      projectsData
        ?.filter((item) => item.id != 0)
        .map((project) => {
          return { value: project.id.toString(), label: project.name }
        }),
    [projectsData]
  ) as SelectValueType[] | undefined


  //gets and sets all class, categories, and types
  const { data: classData } = trpc.assetClass.findAll.useQuery()
  const classList = useMemo(
    () =>
      classData
        ?.filter((item) => item.id != 0)
        .map((classItem) => {
          return { value: classItem.id.toString(), label: classItem.name }
        }),
    [classData]
  ) as SelectValueType[] | undefined

  //gets and sets all employee
  const { data: employeeData } = trpc.employee.findAll.useQuery()
  const employeeList = useMemo(
    () =>
      employeeData?.employees
        .filter((item) => item.id != 0)
        .map((employeeItem) => {
          return { value: employeeItem.id.toString(), label: employeeItem.name }
        }),
    [employeeData]
  ) as SelectValueType[] | undefined

  //gets and sets all class, categories, and types
  const { data: departmentData } = trpc.department.findAll.useQuery()

 

  const departmentList = useMemo(() => {
    if (companyId) {
      const dept = departmentData?.departments.filter(
        (department) => department.companyId === Number(companyId)
      )
      if (dept) {
        const departments = dept?.map((department) => {
          return { value: department.id.toString(), label: department.name }
        }) as SelectValueType[]
        return departments ?? null
      }
    }
    // console.log(departmentData)
    setDepartmentId(null)
    // console.error("Error loading departments")
    return null
  }, [companyId, departmentData])

  //asset description
  const [description, setDescription] = useState<string | null>(null)
  const [remarks, setRemarks] = useState<string | null>(null)

  //depreciation start and end period
  const [dep_start, setDepStart] = useState<Date | null>(null)
  const [dep_end, setDepEnd] = useState<Date | null>(null)

  const [selectedClass, setSelectedClass] = useState<
    AssetClassType | undefined
  >(undefined)
  // const [types, setTypes] = useState<SelectValueType[] | null>(null)

  const categories = useMemo(() => {
    if (classId) {``
      const selectedClass = classData?.filter(
        (classItem) => classItem.id === Number(classId)
      )[0]
      if (selectedClass) {
        //sets selected class
        setSelectedClass(selectedClass)

        //filters all the categories based on the selected class
        const categories = selectedClass.categories.map((category) => {
          return { value: category.id.toString(), label: category.name }
        }) as SelectValueType[]
        return categories ?? null
      }
    } else {
      //clears category selection
      setCategoryId(null)
      return null
    }

    console.error("Error loading categories")
    return null
  }, [classId, classData])

  const types = useMemo(() => {
    if (categoryId) {
      const selectedCategory = selectedClass?.categories.filter(
        (category) => category.id === Number(categoryId)
      )[0]
      if (selectedCategory) {
        //filters all types in the selected category based on the selected class
        const types = selectedCategory?.types.map((type) => {
          return { value: type.id.toString(), label: type.name }
        }) as SelectValueType[]
        return types ?? null
      }
    } else {
      //clears type selection
      setTypeId(null)
      return null
    }

    console.error("Error loading types")
    return null
  }, [categoryId, selectedClass])

  //filters data for company
  const company_address = useMemo(() => {
    if (companyId) {
      const address = companyData?.companies.filter(
        (company) => company.id === Number(companyId)
      )[0]
      return address ?? null
    }
  }, [companyId, companyData])

  const [loading, setIsLoading] = useState<boolean>(false)
  const [assetId, setAssetId] = useState<string>(
    `-${moment().format("YYMDhms")}`
  )

  const asset_number = useMemo(() => {
    const parseId = (id: string | null) => {
      if (!id) {
        return "00"
      }
      if (id?.length === 1) {
        return 0 + id
      } else {
        return id
      }
    }

    if (typeId && departmentId) {
      return parseId(departmentId) + parseId(typeId)
    }

    return null
  }, [typeId, departmentId]) as string | null

  useEffect(() => {
    if (asset_number) {
      const id = `${asset_number}${assetId}`
      setValue("number", id)
      JsBarcode("#barcode2", id, {
        textAlign: "left",
        textPosition: "bottom",
        fontOptions: "",
        fontSize: 12,
        textMargin: 6,
        height: 50,
        width: 1,
      })
    }
  }, [assetId, asset_number, setValue])

  const router = useRouter()
  const { data: session } = useSession()

  const onSubmit: SubmitHandler<AssetFieldValues> = (
    form_data: AssetFieldValues
  ) => {
    if (error) {
      console.log("ERROR ENCOUNTERED")
      console.error("Prisma Error: ", error)
      console.error("Form Error:", errors)
    } else {
      form_data.addedById = Number(session?.user?.id)
      console.log("Submitting: ", form_data)
      mutate(form_data)

      setTimeout(function () {
        setIsLoading(false)
      }, 3000)

      reset()
      setClassId(null)
      setCategoryId(null)
      setTypeId(null)
      setCompanyId(null)
      setDepartmentId(null)
      router.push("/asset")
    }
  }

  const componentRef = useRef(null)
  

  const [formError, setFormError] = useState<boolean>(false)
  useEffect(() => {
    setFormError(Object.keys(errors).length > 0 ? true : false)
  }, [errors])

  // const handleChange = (e) => {
  //   const inputValue = e.target.value;
  //   const formattedValue = `₱ ${inputValue}`;
  //   setValue('cost', formattedValue);
  // };

    return (
      
        <form onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
        noValidate>
          <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                  Asset Information
                </p>
          <div className="grid grid-cols-9 gap-7">
                <div className="col-span-9 grid grid-cols-8 gap-7">
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Asset Name"
                      name="name"
                      placeholder="Asset Name"
                      />
                    <AlertInput>{errors?.name?.message}</AlertInput>
                  </div>
                  <div className="col-span-4">
                    <InputField
                      register={register}
                      label="Alternate Asset Number"
                      placeholder="(Optional)"
                      name="alt_number"
                    />
                    <AlertInput>{errors?.alt_number?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-2">
                <TypeSelect
                      name={"category"}
                      setValue={setValue}
                      value={getValues("parentId")?.toString()}
                      title={"Category"}
                      placeholder={"Select Category"}

                      data={assetsList ?? []}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                <label className="sm:text-sm">Status</label>
                  <Select
                    placeholder="Pick one"
                    data={["New Asset", "Old Asset"]}
                    styles={(theme) => ({
                      item: {
                        // applies styles to selected item
                        "&[data-selected]": {
                          "&, &:hover": {
                            backgroundColor:
                              theme.colorScheme === "light"
                                ? theme.colors.orange[3]
                                : theme.colors.orange[1],
                            color:
                              theme.colorScheme === "dark"
                                ? theme.white
                                : theme.black,
                          },
                        },


                        // applies styles to hovered item (with mouse or keyboard)
                        "&[data-hovered]": {},
                      },
                    })}
                    variant="unstyled"
                    className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="col-span-2">
                    <TypeSelect
                      name={"parentId"}
                      setValue={setValue}
                      value={getValues("parentId")?.toString()}
                      title={"Parent Asset"}
                      placeholder={"Select Parent Asset"}

                      data={assetsList ?? []}
                    />
                    <AlertInput>{errors?.parentId?.message}</AlertInput>
                  </div>
                <div className="col-span-3">
                  <InputField
                    register={register}
                    label="Serial Number"
                    placeholder="Serial Number"
                    name="serial_no"
                  />
                  <AlertInput>{errors?.serial_no?.message}</AlertInput>
                </div>
                <div className="col-span-6 grid grid-cols-9 gap-7">
                  <div className="col-span-3">
                    <TypeSelect
                      name={"parentId"}
                      setValue={setValue}
                      value={getValues("parentId")?.toString()}
                      title={"Model Brand"}
                      placeholder={"Select Brand"}
                      data={assetsList ?? []}
                    />
                    <AlertInput>{errors?.parentId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect
                      name={"assetProjectId"}
                      setValue={setValue}
                      value={getValues("assetProjectId")?.toString()}
                      title={"Model Name"}
                      placeholder={"Select Model Name"}
                      data = {projectsList ?? []}
                      // data={projectsList ?? []}
                    />

                    <AlertInput>{errors?.assetProjectId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                    <TypeSelect
                      name={"vendorId"}
                      setValue={setValue}
                      value={getValues("vendorId")?.toString()}
                      title={"Model Number"}
                      placeholder={"Select Model Number"}
                      data={vendorsList ?? []}
                    />
                    <AlertInput>{errors?.vendorId?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="sm:text-sm">Asset Location</label>
                  <Select
                    placeholder="Select Location"
                    data={["PMJ(Makati)", "KMC Armstrong", "Warehouse", "Stock Room"]}
                    styles={(theme) => ({
                      item: {
                        // applies styles to selected item
                        "&[data-selected]": {
                          "&, &:hover": {
                            backgroundColor:
                              theme.colorScheme === "light"
                                ? theme.colors.orange[3]
                                : theme.colors.orange[1],
                            color:
                              theme.colorScheme === "dark"
                                ? theme.white
                                : theme.black,
                          },
                        },


                        // applies styles to hovered item (with mouse or keyboard)
                        "&[data-hovered]": {},
                      },
                    })}
                    variant="unstyled"
                    className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="col-span-6 grid grid-cols-9 gap-7">
                  <div className="col-span-3 space-y-1">
                  <label className="sm:text-sm">Department</label>
                  <Select
                    placeholder="Select Department"
                    data={["IT", "HR", "Accounting", "Admin","Engineering"]}
                    styles={(theme) => ({
                      item: {
                        // applies styles to selected item
                        "&[data-selected]": {
                          "&, &:hover": {
                            backgroundColor:
                              theme.colorScheme === "light"
                                ? theme.colors.orange[3]
                                : theme.colors.orange[1],
                            color:
                              theme.colorScheme === "dark"
                                ? theme.white
                                : theme.black,
                          },
                        },


                        // applies styles to hovered item (with mouse or keyboard)
                        "&[data-hovered]": {},
                      },
                    })}
                    variant="unstyled"
                    className="my-2 w-full rounded-md border-2 border-gray-400 bg-transparent px-2 py-0.5 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
                  />
                  </div>
                  <div className="col-span-3">
                    <ClassTypeSelect
                        query={departmentId}
                        setQuery={setDepartmentId}
                        // required
                        // disabled={!Boolean(companyId)}
                        name={"departmentId"}
                        setValue={setValue}
                        value={getValues("departmentId")?.toString()}
                        title={"Floor"}
                        placeholder={"Select Floor"}
                        data={departmentList ?? []}
                      />
                      <AlertInput>{errors?.departmentId?.message}</AlertInput>
                  </div>
                  <div className="col-span-3">
                  <TypeSelect
                        name={"custodianId"}
                        setValue={setValue}
                        value={getValues("custodianId")?.toString()}
                        title={"Custodian"}
                        placeholder={
                          !Boolean(departmentId)
                            ? "Select department first"
                            : "Assign custodian"
                        }
                        data={employeeList ?? []}
                      />
                      <AlertInput>{errors?.custodianId?.message}</AlertInput>
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <p className="text-sm text-gray-700">Date of Issuance</p>
                  <DatePicker
                      placeholder={
                         "Month, Day, Year                 📅"
                        }
                      allowFreeInput
                      size="sm"
                      onChange={(value) => {
                        setValue("management.purchase_date", value)
                      }}
                      classNames={{
                        input:
                          "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                      }}
                     />
                  </div>
                  <div className="col-span-9">
                  <Textarea
                    value={description ?? ""}
                    onChange={(event) => {
                      const text = event.currentTarget.value
                      setDescription(text)
                      setValue("description", text)
                    }}
                    placeholder="Asset Description"
                    label="Asset Description"
                    minRows={6}
                    maxRows={6}
                    classNames={{
                      input:
                        "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                      label:
                        "font-sans text-sm font-normal text-gray-600 text-light",
                    }}
                  />
                </div>
              </div>

              {/* purchase information section */}
              <p className="bg-gradient-to-r from-yellow-400 via-tangerine-200 to-yellow-500 bg-clip-text px-2 font-sans text-xl font-semibold uppercase text-transparent">
                  Purchase Information
                </p>
                <div className="grid grid-cols-9 gap-7">
                <div className="col-span-2">
                  {/* Vendor Section */}
                <TypeSelect
                      name={"vendorId"}
                      setValue={setValue}
                      value={getValues("vendorId")?.toString()}
                      title={"Vendor"}
                      placeholder={"Select Vendor"}
                      data={vendorsList ?? []}
                    />
                    <AlertInput>{errors?.vendorId?.message}</AlertInput>
                  </div>
                  {/* purchase order */}
                    <div className="col-span-2">
                  <InputField
                      register={register}
                      label="Purchase Order Number"
                      name="PO"
                      placeholder="Order Number"
                      />
                      </div>
                      {/* Date section */}
                <div className="col-span-2 space-y-2">
                  <p className="text-sm text-gray-700">Purchase Date</p>
                  <DatePicker
                      placeholder={
                         "Month, Day, Year                 📅"
                        }
                      allowFreeInput
                      size="sm"
                      onChange={(value) => {
                        setValue("management.purchase_date", value)
                      }}
                      classNames={{
                        input:
                          "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                      }}
                     />
                  </div>
                  <div className="col-span-2">
                  <InputField
                      register={register}
                      label="Invoice Number"
                      placeholder="Invoice Number"
                      name="Invoice"
                    />
                    </div>
                    </div>
                  <div className="grid grid-cols-9 gap-7">
                    <div className="col-span-2">
                    <InputField
                      register={register}
                      label="Cost"
                      placeholder="Cost"
                      name="Cost"
                      // onChange={handleChange}
                    />
                    </div>
                    <div className="col-span-2">
                    <InputField
                      register={register}
                      label="Quantity"
                      placeholder="Input Quantity"
                      name="Quantity"
                    />
                    </div>
                    <div className="col-span-2 space-y-2">
                    <p className="text-sm text-gray-700">Delivery Date</p>
                    
                    <DatePicker
                      placeholder={
                         "Month, Day, Year                 📅"
                        }
                      allowFreeInput
                      size="sm"
                      onChange={(value) => {
                        setValue("management.purchase_date", value)
                      }}
                      classNames={{
                        input:
                          "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                      }}
                     />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-gray-700">Waranty Date</p>
                    
                    <DatePicker
                      placeholder={
                         "Month, Day, Year                 📅"
                        }
                      allowFreeInput
                      size="sm"
                      onChange={(value) => {
                        setValue("management.purchase_date", value)
                      }}
                      classNames={{
                        input:
                          "border-2 border-gray-400 h-11 rounded-md px-2 outline-none focus:outline-none focus:border-tangerine-400",
                      }}
                     />
                  </div>
                  </div>

               
                {/* button section  */}
              <div className="mt-2 flex w-full justify-end gap-2 text-lg">
                 <button
            type="submit"
            disabled={(!isValid && !isDirty) || isLoading}
            className="rounded-md bg-tangerine-300  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
            onClick={() => console.log(errors)}
          >
            {isLoading || loading ? "Saving..." : "Save"}
          </button>
          </div>
        </form>
      );
  };


  

export default AssetsForm;
