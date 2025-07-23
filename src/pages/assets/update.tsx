import React, { useEffect } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { useRouter } from "next/router"
import { useUpdateAssetStore } from "../../store/useStore"
import UpdateAssetAccordion from "../../components/atoms/accordions/UpdateAssetAccordion"

const UpdateAsset = () => {
  const { selectedAsset } = useUpdateAssetStore()
  const router = useRouter()

  useEffect(() => {
    if (!selectedAsset) {
      router.push("/assets")
    }
    console.log(selectedAsset)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <h3 className="text-xl font-medium">Update Asset</h3>
        <div className="h-full w-full">
          <div className="flex h-full flex-col gap-2 rounded-md border bg-white p-4">
            <UpdateAssetAccordion />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UpdateAsset
