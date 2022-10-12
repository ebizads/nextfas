import React, { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import DisplayAssets from "../../components/asset/DisplayAssets"
import { AssetType } from "../../types/assets"

const Assets = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Get asset by asset id
  const { data } = trpc.asset.findAll.useQuery({
    limit,
    page,
  })

  const [assets, setAssets] = useState<AssetType[]>([])
  const [accessiblePage, setAccessiblePage] = useState<number>(0)

  useEffect(() => {
    //get and parse all data
    if (data) {
      // data.assets.map((a) => {
      //   const asset = {
      //     id: a.id,
      //     serial_number: a.number ?? "ser123",
      //     bar_code: "bar123",
      //     type: a.type?.name ?? "",
      //     category: a.category?.name ?? "",
      //     name: a.name,
      //     description: a.description,
      //     owner: a.custodian?.name ?? "Arvae",
      //     added_date: a.createdAt.toISOString(),
      //   } as RowType;
      //   asset_array.push(asset);
      // });
      setAssets(data.assets)

      //generate accessible page
      // const accPage = Array.from(
      //   { length: Math.ceil(data?.total / limit) },
      //   (_, i) => i + 1
      // );
      setAccessiblePage(Math.ceil(data?.total / limit))
    }
  }, [data, limit])

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Assets</h3>
        <DisplayAssets
          total={data?.total ?? 0}
          assets={assets}
          accessiblePage={accessiblePage}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </DashboardLayout>
  )
}

export default Assets
