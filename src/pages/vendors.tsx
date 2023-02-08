
import React, { useEffect, useState } from "react"
import VendorTable from "../components/atoms/table/VendorTable"
import DashboardLayout from "../layouts/DashboardLayout"
import { vendorColumns } from "../lib/table"
import { VendorType } from "../types/generic"
import { trpc } from "../utils/trpc"
import { Pagination, Select } from "@mantine/core"
import PaginationPopOver from "../components/atoms/popover/PaginationPopOver"
import FilterPopOver from "../components/atoms/popover/FilterPopOver"
import Search from "../components/atoms/search/Search"
import { TypeOf, z } from "zod"
import { VendorCreateInput } from "../server/schemas/vendor"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "../components/atoms/forms/InputField"
import AlertInput from "../components/atoms/forms/AlertInput"
import { Textarea } from "@mantine/core"
import { ImageJSON } from "../types/table"
import DropZoneComponent from "../components/dropzone/DropZoneComponent"
import TypeSelect from "../components/atoms/select/TypeSelect"
import Modal from "../components/headless/modal/modal"

const Vendors = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)


  // Get asset by asset id
  const { data } = trpc.vendor.findAll.useQuery({
    limit,
    page,
  })


  const [vendors, setVendors] = useState<VendorType[]>([])
  const [accessiblePage, setAccessiblePage] = useState<number>(0)
  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  // const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false)


  const utils = trpc.useContext()


  const [filterBy, setFilterBy] = useState<string[]>(
    vendorColumns.map((i) => i.value)
  )


  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)


  useEffect(() => {
    //get and parse all data
    if (data) {
      setVendors(data.vendors)
      setAccessiblePage(Math.ceil(data?.count / limit))
    }
  }, [data, limit])


  // Infer the TS type according to the zod schema.
  type Vendor = z.infer<typeof VendorCreateInput>


  const {
    mutate,
  } = trpc.vendor.create.useMutation({
    onSuccess: () => {
      utils.vendor.findAll.invalidate()
      setOpenModalAdd(false);
    },
  })


  const deleteVendor = trpc.vendor.deleteMany.useMutation({
    onSuccess: () => {
      utils.vendor.findAll.invalidate()


    }
  })


  const {
    register,
    handleSubmit,
    watch,
    // clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Vendor>({
    resolver: zodResolver(VendorCreateInput), // Configuration the validation with the zod schema.
    defaultValues: {},
  })


  const watcher = watch()


  const onSubmit = async (vendor: Vendor) => {
    // Register function
    console.log(vendor)
    mutate({
      ...vendor
    })
  }


  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(vendors, null, 2)}</pre> */}
      <div className="space-y-4">

        <section className="space-y-6">
          <h3 className="text-xl font-medium">Vendors</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex w-fit items-center gap-2">
                <div className="flex-1">
                  <Search
                    data={[
                      ...vendors?.map((obj) => {
                        return {
                          value: obj ? obj.id.toString() : "",
                          label: obj ? obj.name.toString() : "",
                        }
                      }),
                    ]}
                  />
                </div>
                <FilterPopOver
                  openPopover={openPopover}
                  setOpenPopover={setOpenPopover}
                  filterBy={filterBy}
                  setFilterBy={setFilterBy}
                  columns={vendorColumns}
                />
              </div>
              {checkboxes.length > 0 && (
                <button
                  // onClick={() => setOpenModalDel(true)}
                  className="flex gap-2 rounded-md p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none"
                  onClick={() => { deleteVendor.mutate(checkboxes); setCheckboxes([]) }}
                >
                  {checkboxes.includes(-1)
                    ? `Delete all record/s ( ${vendors.length} ) ?`
                    : `Delete selected record/s ( ${checkboxes.length} )`}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* <button className="flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
                <i className="fa-solid fa-print text-xs" />
                Print CVs
              </button> */}
              <button
                onClick={() => {
                  setOpenModalAdd(true)
                }}
                className="flex gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none"
              >
                <i className="fa-regular fa-plus text-xs" />
                <p>Add New</p>
              </button>
            </div>
          </div>
        </section>
        <VendorTable
          checkboxes={checkboxes}
          columns={vendorColumns}
          filterBy={filterBy}
          rows={vendors}
          setCheckboxes={setCheckboxes}
        />
        <section className="mt-8 flex justify-between px-4">
          <div className="flex items-center gap-2">
            <p>Showing up to</p>
            <PaginationPopOver
              paginationPopover={paginationPopover}
              setPaginationPopover={setPaginationPopover}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
            <p> entries</p>
          </div>
          <Pagination
            page={page}
            onChange={setPage}
            total={accessiblePage}
            classNames={{
              item: "bg-transparent selected-page:bg-tangerine-500 border-none",
            }}
          />
        </section>
        <Modal title="Add New Vendor" isVisible={openModalAdd} setIsVisible={setOpenModalAdd} className="max-w-4xl" >
          <div className="w-full">

            <form
              // className="p-2"
              onSubmit={(e) => {
                e.preventDefault()
              }}
              noValidate
            >
              <div className="grid grid-cols-10 gap-y-9 gap-x-4">
                <div className="col-span-5 mt-1">
                  <InputField
                    register={register}
                    label="Company Name"
                    name="name"
                    type="text"
                  />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>


                <div className="col-span-5">
                  <label className="sm:text-sm">Vendor Type</label>
                  <Select
                    placeholder="Pick one"
                    onChange={(value) => {
                      setValue("type", value ?? "")
                    }}
                    data={["Manufacturer", "Supplier", "Servicing", "Others"]}
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


                <div className="col-span-5 -mt-1">
                  <InputField
                    register={register}
                    label="Email"
                    name="email"
                    type="text"
                  />
                  <AlertInput>{errors?.email?.message}</AlertInput>
                </div>
                <div className="col-span-5">


                  <label className="sm:text-sm">Phone Number: {`(use " , " for multiple phone numbers)`}</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-2 curs border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2"
                    onKeyDown={(e) => {
                      const regex = /^[0-9, ]|Backspace/
                      if (e.key === "e" || !regex.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={(event) => {
                      const convertToArray = event.currentTarget.value;


                      const phonenumString = convertToArray.replace(/[^0-9, ]/gi, "").split(",")
                      setValue("phone_no", phonenumString);
                    }}
                    value={watcher.phone_no}
                  />
                  <AlertInput>{errors?.phone_no?.message}</AlertInput>
                </div>


                <div className="col-span-5">
                  {/* <InputField
                    register={register}
                    label="Fax Number"
                    name="fax_no"
                    type="text"
                  /> */}
                  <label className="sm:text-sm mb-2">Fax Number</label>
                  <input
                    // disabled={!isEditable}

                    type="number"
                    pattern="[0-9]*"
                    className={'mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 '}
                    onKeyDown={(e) => {
                      if (e.key === "e") {
                        e.preventDefault()
                      }
                    }}
                    onChange={(event) => {

                      if (event.target.value.length > 8) {
                        console.log("more than 8")
                        event.target.value = event.target.value.slice(0, 8);
                      }
                      setValue(
                        "fax_no",
                        event.currentTarget.value.toString()
                      )
                    }}
                  />
                  <AlertInput>{errors?.fax_no?.message}</AlertInput>
                  {/* </div> */}
                  {/* <AlertInput>{errors?.fax_no?.message}</AlertInput> */}
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Website"
                    name="website"
                    type="text"
                  />
                  <AlertInput>{errors?.website?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <label className="sm:text-sm">Street</label>
                  <InputField
                    type={"text"}
                    label={""}
                    name="address.street"
                    register={register}
                  />
                </div>
                <div className="col-span-2">
                  <label className="sm:text-sm">Barangay</label>
                  <InputField
                    type={"text"}
                    label={""}
                    name={"address.state"}
                    register={register}
                  />


                  <AlertInput>{errors?.address?.state?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <label className="sm:text-sm">City</label>
                  <InputField
                    type={"text"}
                    label={""}
                    name={"address.city"}
                    register={register}
                  />


                  <AlertInput>{errors?.address?.city?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <label className="sm:text-sm">Zip Code</label>
                  <InputField
                    type={"text"}
                    label={""}
                    name={"address.zip"}
                    register={register}
                  />
                  <AlertInput>{errors?.address?.zip?.message}</AlertInput>
                </div>
                <div className="col-span-2">
                  <label className="sm:text-sm">Country</label>
                  <InputField
                    type={"text"}
                    label={""}
                    name={"address.country"}
                    register={register}
                  />


                  <AlertInput>{errors?.address?.country?.message}</AlertInput>
                </div>
                <div className="col-span-10">
                  <Textarea
                    placeholder=""
                    label="Remarks"
                    minRows={6}
                    maxRows={6}
                    classNames={{
                      input:
                        "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2",
                      label: "font-sans text-sm text-gray-600 text-light",
                    }}
                  />
                </div>
                <DropZoneComponent
                  images={images}
                  setImage={setImage}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  acceptingMany={true}
                />
              </div>
              <hr className="w-full"></hr>
              <div className="flex w-full justify-end gap-2 mt-4">
                {/* TODO: Reset form */}
                <button


                  type="reset"
                  // onClick={() => setOpenModalAdd(false)}


                  onClick={() => { console.log(errors) }}
                  className="px-4 font-medium underline"
                >
                  Discard
                </button>
                <button


                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  // className="rounded-md bg-tangerine-500 py-2 px-6 font-semibold text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none"
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}


export default Vendors



