  import React from "react";
  import DashboardLayout from "../../layouts/DashboardLayout";
  import CreateAssetAccordion from "../../components/atoms/accordions/CreateAssetAccordion";
import AssetsForm from "../../components/asset/form";
import { Tab } from "@headlessui/react";

  const CreateAsset = () => {

    return (
      <DashboardLayout>
      {/* //   <div className="h-full space-y-6">
      //     <h3 className="text-xl font-medium">Add Asset</h3>
      //     <div className="h-full w-full">
      //       <div className="rounded-md h-screen bg-white border p-2 flex flex-col gap-2">
      //         <CreateAssetAccordion />
              
      //       </div>
      //     </div>

      //   </div>
         */}
         <AssetsForm/>
      </DashboardLayout>
     
    )
  };

  export default CreateAsset;
