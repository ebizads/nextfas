import React, { useState } from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { CreateEmployee_new } from "./CreateNewEmp"
import { ImageJSON } from "../../../types/table"

const NewEmp = () => {

  const [date, setDate] = useState<Date>(new Date())
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NewEmp
