import React from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import Register2 from "./register"

const Register = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Register New Account</h3>
        <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
          <Register2 />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Register
