import React, { useState, useEffect } from "react"
import Dispose from "../../components/transaction/Disposal/DisposeAsset"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import { useDisposalStatusStore, useDisposeAssetStore } from "../../store/useStore"


const AssetDisposal = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { status } = useDisposalStatusStore()
  const { disposeAsset, setDisposeAsset } = useDisposeAssetStore()

  const { data } = trpc.assetDisposal.findAll.useQuery({
    search: {
      disposalStatus: status
    },
    limit,
    page,
  })
  useEffect(() => {
    setDisposeAsset(null);
  }, [setDisposeAsset])

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
