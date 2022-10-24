import React, { useEffect, useState } from "react"
import VendorTable from "../components/atoms/table/VendorTable"
import DashboardLayout from "../layouts/DashboardLayout"
import { vendorColumns } from "../lib/table"
import { VendorType } from "../types/assets"
import { trpc } from "../utils/trpc"
import { Image, Pagination } from "@mantine/core"
import PaginationPopOver from "../components/atoms/popover/PaginationPopOver"
import FilterPopOver from "../components/atoms/popover/FilterPopOver"
import Search from "../components/atoms/search/Search"
import Modal from "../components/asset/Modal"
import { z } from "zod"
import { VendorCreateInput } from "../server/common/schemas/vendor"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "../components/atoms/forms/InputField"
import AlertInput from "../components/atoms/forms/AlertInput"
import { Textarea, Loader } from '@mantine/core';
import { ImageJSON } from "../types/table"
import DropzoneCMP from "../components/dropzone/dropzonecmp"

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

  useEffect(() => {
    //get and parse all data
    if (data) {
      setVendors(data.vendors)
      setAccessiblePage(Math.ceil(data?.total / limit))
    }
  }, [data, limit])

  // Infer the TS type according to the zod schema.
  type Vendor = z.infer<typeof VendorCreateInput>

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Vendor>({
    resolver: zodResolver(VendorCreateInput), // Configuration the validation with the zod schema.
    defaultValues: {
    },
  })

  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string[]>([
    ...vendorColumns.map((i) => i.value),
  ])


  const value = (new Date())
  const [image, setImage] = useState<ImageJSON>({
    name: "",
    size: 0,
    file: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(vendors, null, 2)}</pre> */}
      <div className="space-y-4">
        <section className="space-y-4">
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
                  onClick={() => setOpenModalDel(true)}
                  className="flex gap-2 rounded-md p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none"
                >
                  {checkboxes.includes(-1)
                    ? `Delete all record/s ( ${vendors.length} ) ?`
                    : `Delete selected record/s ( ${checkboxes.length} )`}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
                <i className="fa-solid fa-print text-xs" />
                Print CVs
              </button>
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
            <p>Showing </p>
            <PaginationPopOver
              paginationPopover={paginationPopover}
              setPaginationPopover={setPaginationPopover}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
            <p> of {data?.total} entries</p>
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
        <Modal isOpen={openModalAdd} setIsOpen={setOpenModalAdd} size={12}>
          <div className="w-full py-4 px-8">
            <section className="flex items-center justify-between border-b py-2 text-light-primary">
              <h4>Add New Vendor</h4>
              <i className="fa-solid fa-xmark text-lg text-gray-500" />
            </section>
            <form className="p-2">
              <div className="grid grid-cols-10 gap-4">
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Company Name"
                    name="name"
                    type="text"
                  />
                  <AlertInput>{errors?.name?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Type"
                    name="type"
                    type="text"
                  />
                  <AlertInput>{errors?.type?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Company Address"
                    name="address"
                    type="text"
                  />
                  <AlertInput>{errors?.address?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Email"
                    name="email"
                    type="text"
                  />
                  <AlertInput>{errors?.email?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Phone Number"
                    name="phone_no"
                    type="text"
                  />
                  <AlertInput>{errors?.phone_no?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Alt Phone Number"
                    name="alt_phone_no"
                    type="text"
                  />
                  <AlertInput>{errors?.alt_phone_no?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Website"
                    name="url"
                    type="text"
                  />
                  <AlertInput>{errors?.url?.message}</AlertInput>
                </div>
                <div className="col-span-5">
                  <InputField
                    register={register}
                    label="Fax Number"
                    name="fax_no"
                    type="text"
                  />
                  <AlertInput>{errors?.fax_no?.message}</AlertInput>
                </div>
                <div className="col-span-10">
                  <Textarea
                    placeholder=""
                    label="Remarks"
                    minRows={6}
                    maxRows={6}
                    classNames={{ input: "w-full border-2 border-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 mt-2", label: "font-sans text-sm text-gray-600 text-light" }}
                  />
                </div>
                <div className="flex flex-wrap gap-4 py-2.5 px-5 col-span-10">
                  <div className="w-[48%] rounded-md border bg-white drop-shadow-2xl">
                    <div className="p-5">
                      <DropzoneCMP
                        setImage={setImage}
                        setIsLoading={setIsLoading}
                      />
                    </div>
                  </div>
                  <div className="flex w-[48%] flex-wrap content-center rounded-md border bg-white drop-shadow-2xl">
                    <div className="flex flex-wrap p-10">
                      {isLoading === true ? (
                        <Loader
                          color="orange"
                          variant="bars"
                          className="self-center"
                        />
                      ) : image.file === "" ? (
                        <text className="text-center">Image Preview</text>
                      ) : (
                        <div className="flex flex-row gap-4">
                          <Image
                            radius="md"
                            src={image.file}
                            alt="Image"
                            width={135}
                            height={135}
                            withPlaceholder
                          />
                          <div className="flex flex-col">
                            <text>{image.name}</text>
                            <text>{image.size} mb</text>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className=""></div>
                  </div>
                </div>

              </div>
              <div className="w-full flex justify-end gap-2 py-4">
                <button className="py-2 px-4 underline font-medium">Discard</button>
                <button className="rounded-md bg-tangerine-500 py-2 px-6 font-semibold text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
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
