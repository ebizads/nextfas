import React, { useEffect, useState } from "react"
import { trpc } from "../../utils/trpc"
import RepairAsset from "../../components/transaction/RepairAsset"
import DashboardLayout from "../../layouts/DashboardLayout"
import { useRepairStatusStore } from "../../store/useStore"

const AssetRepair = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { status } = useRepairStatusStore();

  useEffect(() => {
    console.log(status);
  }, [status]);

  const { data } = trpc.assetRepair.findAll.useQuery({
    search: {
      repairStatus: status
    },
    limit,
    page,
  })

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
