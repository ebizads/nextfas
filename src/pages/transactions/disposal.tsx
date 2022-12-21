import React, { useState } from "react"
import Dispose from "../../components/transaction/DisposeAsset"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"


const AssetDisposal = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data } = trpc.assetDisposal.findAll.useQuery({
    limit,
    page,
  })

  return (
    <DashboardLayout>
      <Dispose
        total={data?.total ?? 0}
        asset={data?.assetDisposals ?? []}
        assetPage={data?.pages ?? 0}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </DashboardLayout>
  )
}

export default AssetDisposal
