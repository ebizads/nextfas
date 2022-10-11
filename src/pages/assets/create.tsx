import React from "react";
import CreateStepper from "../../components/asset/CreateStepper";
import DashboardLayout from "../../layouts/DashboardLayout";

const CreateAsset = () => {
  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <h3 className="text-xl font-medium">Add Asset</h3>
        <div className="h-full w-full">
          <CreateStepper />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAsset;
