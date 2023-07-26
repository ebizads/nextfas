import React, { useState } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { UpdateEmployee } from "./UpdateEmployee"
import { ImageJSON } from "../../../types/table"
import { EmployeeType } from "../../../types/generic"
import { useSelectedEmpStore } from "../../../store/useStore"


const NewEmp = () => {

  const { selectedEmp } = useSelectedEmpStore()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Employees</h3>
        <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
          <UpdateEmployee
            employee={selectedEmp as EmployeeType}
          // setIsVisible={setUpdateRecord}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NewEmp
