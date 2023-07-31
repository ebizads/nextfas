import React from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { UserType } from "../../../types/generic"
import { useSelectedUserStore } from "../../../store/useStore"
import { UpdateUser } from "./UpdateUser"


const UserUpdate = () => {


  const { selectedUser } = useSelectedUserStore()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Users</h3>
        <div className="flex h-fit flex-col gap-2 rounded-md border bg-white p-10">
          <UpdateUser
            user={selectedUser as UserType}
          // setIsVisible={setUpdateRecord}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserUpdate
