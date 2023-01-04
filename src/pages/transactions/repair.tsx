import React, { useState } from "react"
import Repair from "../../components/transaction/RepairAsset"
import DashboardLayout from "../../layouts/DashboardLayout"

export type repairTMP = {
  id: number
  assetDesc: string
  asset_info: string
  note: string
  status: string
}

const AssetRepair = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const repairTable: repairTMP[] = [
    {
      id: 1,
      assetDesc: "ROG LAPTOP",
      asset_info: "awdadwad",
      note: "Yowwwwwwww",
      status: "pending",
    },
  ]

  return (
    <DashboardLayout>
      <Repair
        total={5}
        asset={repairTable}
        assetPage={0}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </DashboardLayout>
  )
}

export default AssetRepair
