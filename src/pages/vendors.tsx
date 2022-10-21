import Link from "next/link"
import React, { useEffect, useState } from "react"
import VendorTable from "../components/atoms/table/VendorTable"
import DashboardLayout from "../layouts/DashboardLayout"
import { vendorColumns } from "../lib/table"
import { VendorType } from "../types/assets"
import { trpc } from "../utils/trpc"
import { Select, Popover, Checkbox, Pagination } from "@mantine/core"
import PaginationPopOver from "../components/atoms/popover/PaginationPopOver"
import FilterPopOver from "../components/atoms/popover/FilterPopOver"
import Search from "../components/atoms/search/Search"
import Modal from "../components/asset/Modal"
import { InputField } from "../components/atoms/forms/InputField"
import { useForm } from "react-hook-form"

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

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   clearErrors,
  //   formState: { errors, isSubmitting },
  // } = useForm<User>({
  //   resolver: zodResolver(userSchema), // Configuration the validation with the zod schema.
  //   defaultValues: {
  //     username: "",
  //     password: "",
  //   },
  // })

  const [checkboxes, setCheckboxes] = useState<number[]>([])
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false)
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string[]>([
    ...vendorColumns.map((i) => i.value),
  ])
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
        <Modal isOpen={openModalAdd} setIsOpen={setOpenModalAdd} size={10}>
          <div className="w-full p-4">
            <section className="flex items-center justify-between border-b py-2 text-light-primary">
              <h4>Add New Vendor</h4>
              <i className="fa-solid fa-xmark text-lg text-gray-500" />
            </section>
            <form className="py-2">
              <div className="flex flex-wrap gap-2">
                {/* <InputField label="Vendor ID" ></InputField> */}
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Vendors
