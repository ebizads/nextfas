import React, { useState, useEffect } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { CreateEmployee_new } from "../../../components/employee/CreateNewEmp"
import { ImageJSON } from "../../../types/table"
import { trpc } from "../../../utils/trpc"
import { EmployeeType } from "../../../types/generic"

const NewEmp = () => {
  const [date, setDate] = useState<Date>(new Date())
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: allEmp, isLoading: isEmpLoading } =
    trpc.employee.findAllNoLimit.useQuery()
  const [nextEmpId, setNextEmpId] = useState<string>("")

  useEffect(() => {
    if (allEmp?.employees?.length) {
      const existingIds = allEmp.employees.map(
        (emp: EmployeeType) => emp?.employee_id
      )
      let id = 1

      while (existingIds.includes(String(id).padStart(4, "0"))) {
        id++
      }

      setNextEmpId(String(id).padStart(4, "0"))
    }
  }, [allEmp])

  // const generateEmployeeId = () => {
  //   let numberArray = ""

  //   for (let x = 0; x <= (allEmployees ? allEmployees?.length : 0) + 1; ) {
  //     if (
  //       allEmployees.find((item) =>
  //         item?.employee_id?.includes(String(x + 1).padStart(4, "0"))
  //       )
  //     ) {
  //       x++
  //     } else {
  //       console.log("Chk: " + JSON.stringify(true))

  //       return (numberArray = String(x + 1).padStart(4, "0"))
  //     }
  //   }

  //   return numberArray
  // }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Employees</h3>
        <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
          {isEmpLoading ? (
            <p>Loading employees...</p>
          ) : nextEmpId ? (
            <CreateEmployee_new
              date={date}
              setDate={setDate}
              setImage={setImage}
              images={images}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              generateId={nextEmpId}
            />
          ) : (
            <p>Failed to generate Employee ID</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NewEmp
