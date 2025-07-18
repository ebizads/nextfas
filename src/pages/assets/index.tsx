import React, { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import DisplayAssets from "../../components/asset/DisplayAssets"
import { Asset, AssetType } from "../../types/generic"
import { useRouter } from "next/router"
import { useSearchStore } from "../../store/useStore"
import Modal from "../../components/asset/Modal"

const Assets = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [actionTypeFilter, setActionTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const router = useRouter()
  const { search } = useSearchStore()
  // Get asset by asset id

  const { data: dataAssets, refetch } = trpc.asset.findAll.useQuery({
    search: search,
    limit,
    page,
    filter: {
      type: typeFilter,
      actionType: actionTypeFilter,
      status: statusFilter,
    },
  })
  const [assets, setAssets] = useState<Asset[]>([])
  const [accessiblePage, setAccessiblePage] = useState<number>(0)

  useEffect(() => {
    //get and parse all data
    if (dataAssets) {
      setAssets(dataAssets.assets as Asset[])
      setAccessiblePage(Math.ceil(dataAssets?.count / limit))
    }
  }, [dataAssets, limit, router, search])

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
      <div className="space-y-6">
        <DisplayAssets
          total={dataAssets?.count ?? 0}
          assets={assets}
          accessiblePage={accessiblePage}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          user={null}
          refetch={refetch}
          actionTypeFilter={actionTypeFilter}
          setActionTypeFilter={setActionTypeFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>
    </DashboardLayout>
  )
}

export default Assets
