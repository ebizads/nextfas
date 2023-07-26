import React, { useState } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { UpdateVendor } from "./UpdateVendor"
import { ImageJSON } from "../../../types/table"
import { VendorType } from "../../../types/generic"
import { useSelectedVendorStore } from "../../../store/useStore"


const NewVendor = () => {

    const { selectedVendor } = useSelectedVendorStore()

    console.log(selectedVendor, "lololololol")

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Vendors</h3>
                <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
                    <UpdateVendor
                        vendor={selectedVendor as VendorType}
                    // setIsVisible={setUpdateRecord}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default NewVendor
