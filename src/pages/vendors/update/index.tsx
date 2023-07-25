import React, { useState } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { UpdateVendor } from "./UpdateVendor"
import { ImageJSON } from "../../../types/table"
import { VendorType } from "../../../types/generic"
import { useSelectedVendorStore } from "../../../store/useStore"


const NewEmp = () => {

    const [date, setDate] = useState<Date>(new Date())
    const [images, setImage] = useState<ImageJSON[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { selectedEmp } = useSelectedEmpStore()

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Vendors</h3>
                <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
                    <UpdateVendor
                        employee={selectedVendor as VendorType}
                    // setIsVisible={setUpdateRecord}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default NewEmp
