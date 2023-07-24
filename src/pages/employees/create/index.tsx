import React, { useState } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { CreateEmployee_new } from "./CreateNewEmp"
import { ImageJSON } from "../../../types/table"
import { trpc } from "../../../utils/trpc"
import { EmployeeType } from "../../../types/generic"
const NewEmp = () => {

  const [date, setDate] = useState<Date>(new Date())
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: allEmp } = trpc.employee.findAllNoLimit.useQuery()
  const employeesAll: EmployeeType[] = allEmp?.employees as EmployeeType[]
  function generateEmployeeId() {
    let numberArray = ""

    for (
      let x = 0;
      x <= (allEmp?.employees ? allEmp?.employees?.length : 0) + 1;

    ) {
      if (
        employeesAll.some((item) =>
          item?.employee_id?.includes(String(x + 1).padStart(4, "0"))
        )
      ) {
        x++
      } else {
        console.log("Chk: " + JSON.stringify(true))

        return (numberArray = String(x + 1).padStart(4, "0"))
      }
    }

    return numberArray
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Employees</h3>
        <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
          <CreateEmployee_new
            date={date}
            setDate={setDate}
            setImage={setImage}
            images={images}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            generateId={generateEmployeeId()}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NewEmp
