import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CreateAssetAccordion from "../../components/atoms/accordions/CreateAssetAccordion";

const CreateAsset = () => {

  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <h3 className="text-xl font-medium">Add Asset</h3>
        <div className="h-full w-full">
          <div className="rounded-md bg-white border p-2 flex flex-col gap-2">
            <CreateAssetAccordion />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreateAsset;
