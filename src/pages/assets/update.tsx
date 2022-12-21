import React, { useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from 'next/router'
import { useUpdateAssetStore } from "../../store/useStore";
import UpdateAssetAccordion from "../../components/atoms/accordions/UpdateAssetAccordion";

const UpdateAsset = () => {

  const { selectedAsset } = useUpdateAssetStore()
  const router = useRouter()

  useEffect(() => {
    if (!selectedAsset) {
      router.push("/assets")
    }
    console.log(selectedAsset)
  }, [])

  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <h3 className="text-xl font-medium">Update Asset</h3>
        <div className="h-full w-full">
          <div className="rounded-md h-full bg-white border p-4 flex flex-col gap-2">
            <UpdateAssetAccordion />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UpdateAsset;
