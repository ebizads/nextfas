import React, { useState } from "react"
import { trpc } from "../../utils/trpc"
import RepairAsset from "../../components/transaction/RepairAsset"
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
  const { data } = trpc.assetRepair.findAll.useQuery()

  // const repairTable: repairTMP[] = []

  return (
    <DashboardLayout>
      <RepairAsset
        total={5}
        asset={data?.assetRepairs ?? []}
        assetPage={0}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
      {/* <pre>{JSON.stringify(data?.assetRepairs, null, 2)}</pre> */}
    </DashboardLayout>
  )
}

export default AssetRepair
