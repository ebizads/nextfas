import React from "react"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { useState, useEffect } from "react"
import {
  useIssuanceStatusStore,
  useIssuanceAssetStore,
} from "../../../store/useStore"
import { trpc } from "../../../utils/trpc"
import Issuance from "../../../components/transaction/Issuance/AssetIssuance"
const AssetIssuance = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { setIssuanceAsset } = useIssuanceAssetStore()

  const { status } = useIssuanceStatusStore()

  const { data } = trpc.assetIssuance.findAll.useQuery({
    search: {
      issuanceStatus: status ?? "",
    },
    limit,
    page,
  })

  useEffect(() => {
    setIssuanceAsset(null)
  }, [setIssuanceAsset])

  return (
    <DashboardLayout>
      <Issuance
        total={data?.total ?? 0}
        assets={data?.assetIssuance ?? []}
        accessiblePage={data?.pages ?? 0}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </DashboardLayout>
  )
}

export default AssetIssuance
