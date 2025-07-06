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
  const router = useRouter()
  const { search } = useSearchStore()
  // Get asset by asset id
  const { data: dataAssets } = trpc.asset.findAll.useQuery({
    search: { name: search },
    limit,
    page,
  })
  const { data: sample } = trpc.asset.findAllSample.useQuery({
    search: { name: search },
    limit,
    page,
  })
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [accessiblePage, setAccessiblePage] = useState<number>(0)
  const [sampleAssets, setSampleAssets] = useState<Asset[]>([])

  useEffect(() => {
    //get and parse all data
    if (dataAssets) {
      setAssets(dataAssets.assets as Asset[])
      setAccessiblePage(Math.ceil(dataAssets?.count / limit))
    }
    if (sample) {
      setSampleAssets(sample.assets as Asset[])
    }
  }, [dataAssets, limit, router, sample, sampleAssets, search])

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
      <div className="space-y-6">
        <DisplayAssets
          total={dataAssets?.count ?? 0}
          assets={assets}
          assetsSample={sampleAssets}
          accessiblePage={accessiblePage}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          user={null}
        />
      </div>
    </DashboardLayout>
  )
}

export default Assets
