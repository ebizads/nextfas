import React, { useState } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { CreateVendor } from "./CreateNewVendor"
// import { ImageJSON } from "../../../types/table"
import { trpc } from "../../../utils/trpc"
// import { EmployeeType } from "../../../types/generic"
const NewVendor = () => {



    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Employees</h3>
                <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
                    <CreateVendor />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default NewVendor
