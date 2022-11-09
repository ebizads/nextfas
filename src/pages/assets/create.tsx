import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Tabs } from '@mantine/core'
import CreateAssetAccordion from "../../components/atoms/accordions/CreateAssetAccordion";

const CreateAsset = () => {

  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <h3 className="text-xl font-medium">Add Asset</h3>
        <div className="h-full w-full">
          <div className="rounded-md h-full bg-white border p-4 flex flex-col gap-2">
            <CreateAssetAccordion form={"asset info"} />
          </div>
          {/* <Tabs defaultValue="first" className="space-y-2 h-full" classNames={{ tab: "border border-blue-200 aria-selected:text-tangerine-600 font-sans" }}>
            <Tabs.List>
              <Tabs.Tab value="first" color={"orange"}>Asset Info</Tabs.Tab>
              <Tabs.Tab value="second" color={"orange"}>General Subtab</Tabs.Tab>
              <Tabs.Tab value="third" color={"orange"}>Asset Usage Subtab</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="first">
              <div className="rounded-md h-full bg-white border p-4 flex flex-col gap-2">
                <CreateAssetAccordion form={"asset info"} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="second">
              <div className="rounded-md h-full bg-white border p-4 flex flex-col gap-2">
                <CreateAssetAccordion form={"general subtab"} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="third">
              <div className="rounded-md h-full bg-white border p-4 flex flex-col gap-2">
                <CreateAssetAccordion form={"general subtab"} />
              </div>
            </Tabs.Panel>
          </Tabs> */}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreateAsset;
