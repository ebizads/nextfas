import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import DisplayTransferAssets from "../../../components/transaction/Transfer/DisplayTransferAssets"
import Transfer from "../../../components/transaction/Transfer/TransferAsset"
import DashboardLayout from "../../../layouts/DashboardLayout"
import {
	useSearchStore,
	useTransferAssetStore,
	useUpdateAssetStore,
} from "../../../store/useStore"
import { AssetTransferType, AssetType } from "../../../types/generic"
import { trpc } from "../../../utils/trpc"
import DisplayTransferAsset_new from "../../../components/transaction/Transfer/TransferAssetTabs"

const AssetTransfer = () => {
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const router = useRouter()
	const { search } = useSearchStore()

	const { data } = trpc.assetTransfer.findAll.useQuery({
		limit,
		page,
	})

	const [assets, setAssets] = useState<AssetTransferType[]>([])
	const [accessiblePage, setAccessiblePage] = useState<number>(0)

	const { transferAsset, setTransferAsset } = useTransferAssetStore()

	const [flag, setFlag] = useState(false)

	useEffect(() => {
		setTransferAsset(null)
		console.log(transferAsset)
	}, [flag, setTransferAsset])

	// console.log("transfer asset number: "+ transferAsset?.number);

	useEffect(() => {
		console.log("transfer asset: " + transferAsset)

		//get and parse all data
		if (data) {
			setAssets(data.assetTransfers as unknown as AssetTransferType[])
			setAccessiblePage(Math.ceil(data.total / limit))
		}
	}, [data, limit, router])
	// console.log(transferAsset)
	return (
		<DashboardLayout>
			<div className="">
				<h3 className="text-xl font-medium px-1">Transfer</h3>
				<DisplayTransferAsset_new
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

export default AssetTransfer
