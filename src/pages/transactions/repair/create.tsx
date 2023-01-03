import React from "react"
import AddRepairForm from "../../../components/transaction/AddRepair.tsx/AddRepairForm"
import DashboardLayout from "../../../layouts/DashboardLayout"

const RepairNew = () => {
  return (
    <DashboardLayout>
      <div className="shadow-mg flex h-full flex-col gap-2 rounded-md border bg-white p-4 shadow-lg">
        <div className="py-2">
          <AddRepairForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default RepairNew
