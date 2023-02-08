import React, { useEffect, useState } from "react"
import { trpc } from "../../utils/trpc"
import RepairAsset from "../../components/transaction/RepairAsset"
import DashboardLayout from "../../layouts/DashboardLayout"
import { useRepairAssetStore, useRepairStatusStore } from "../../store/useStore"
import { router } from "trpc"
import { AssetRepairType } from "../../types/generic"


const AssetRepair = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { status } = useRepairStatusStore();
  const { repairAsset, setRepairAsset } = useRepairAssetStore()

  const [assets, setAssets] = useState<AssetRepairType[]>([]);
  const [accessiblePage, setAccessiblePage] = useState<number>(0);


  useEffect(() => {
    console.log(status, limit, page);
  }, [status, limit, page]);

  const { data } = trpc.assetRepair.findAll.useQuery({
    search: {
      repairStatus: status
    },
    limit,
    page,
  })

  useEffect(() => {
    setRepairAsset(null);
  }, [])

  useEffect(
    () => {
      //get and parse all data
      if (data) {
        setAssets(data.assetRepairs as AssetRepairType[]);
        setAccessiblePage(Math.ceil(data.count / limit));
      }
    },
    [data, limit, router]
  );

  // const repairTable: repairTMP[] = []

  return (
    <DashboardLayout>
      <RepairAsset
        total={data?.total ?? 0}
        assets={assets}
        accessiblePage={accessiblePage}
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
