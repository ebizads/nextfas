import React, { useState } from "react"
import Dispose from "../../components/transaction/DisposeAsset"
import DashboardLayout from "../../layouts/DashboardLayout"

export type disposeTMP = {
  "departmentCode": string,
  "id": number,
  "assetName": string,
  "assetDesc": string,
  "disposalDate": string,
  "authorizeBy": string,
  "jobTitle": string,
  "disposalType": string,
  "status": string,
}

const AssetDisposal = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const disposalTable: disposeTMP[] = [
    {
      departmentCode: "00085",
      id: 1,
      assetName: "ROG LAPTOP",
      assetDesc: "Gadget",
      disposalDate: "November 17, 2022",
      authorizeBy: "Klark",
      jobTitle: "Dancer",
      disposalType: "Throw Away",
      status: "pending",
    },
    // {
    //   departmentCode: "78574",
    //   id: 2,
    //   assetName: "ROG LAPTOP",
    //   assetDesc: "Gadget",
    //   disposalDate: Date(),
    //   authorizeBy: "Klark",
    //   jobTitle: "Dancer",
    //   disposalType: "Throw Away",
    //   status: "pending",
    // },
    // {
    //   departmentCode: "asdasd",
    //   id: 3,
    //   assetName: "ROG LAPTOP",
    //   assetDesc: "Gadget",
    //   disposalDate: Date(),
    //   authorizeBy: "Klark",
    //   jobTitle: "Dancer",
    //   disposalType: "Throw Away",
    //   status: "approved",
    // },
    // {
    //   departmentCode: "asdasd",
    //   id: 4,
    //   assetName: "ROG LAPTOP",
    //   assetDesc: "Gadget",
    //   disposalDate: Date(),
    //   authorizeBy: "Klark",
    //   jobTitle: "Dancer",
    //   disposalType: "Throw Away",
    //   status: "rejected",
    // },
    // {
    //   departmentCode: "asdasd",
    //   id: 5,
    //   assetName: "ROG LAPTOP",
    //   assetDesc: "Gadget",
    //   disposalDate: Date(),
    //   authorizeBy: "Klark",
    //   jobTitle: "Dancer",
    //   disposalType: "Throw Away",
    //   status: "cancelled",
    // },
  ]

  return (
    <DashboardLayout>
      <Dispose
        total={5}
        asset={disposalTable}
        assetPage={0}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </DashboardLayout>
  )
}

export default AssetDisposal
