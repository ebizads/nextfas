import React from "react";
import CreateDisposeAccordion from "../../../components/atoms/accordions/CreateDisposeAccordion";
import DashboardLayout from "../../../layouts/DashboardLayout";

const DisposeNew = () => {
    return (
        <DashboardLayout>
            <div className="rounded-lg p-8 m-2 bg-white">
                <div className="py-2">
                    <CreateDisposeAccordion />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DisposeNew