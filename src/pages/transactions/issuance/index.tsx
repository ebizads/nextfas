import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import DisplayTransferAssets from "../../../components/transaction/Transfer/DisplayTransferAssets"
import Transfer from "../../../components/transaction/Transfer/TransferAsset"
import DashboardLayout from "../../../layouts/DashboardLayout"
import {
	useSearchStore,
	useIssuanceAssetStore,
	useIssuanceStatusStore,
} from "../../../store/useStore"
import { IssuanceType, AssetType } from "../../../types/generic"
import { trpc } from "../../../utils/trpc"
import DisplayTransferAsset_new from "../../../components/transaction/Transfer/TransferAssetTabs"
// import AssetIssuance from "../../../components/transaction/Issuance/AssetIssuance"
import Issuance from "../../../components/transaction/Issuance/AssetIssuance"

const NewIssuance = () => {
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)

	const { status } = useIssuanceStatusStore();

	const [assets, setAssets] = useState<IssuanceType[]>([])
	const [accessiblePage, setAccessiblePage] = useState<number>(0)

	const { issuanceAsset, setIssuanceAsset } = useIssuanceAssetStore()


	const { data } = trpc.assetIssuance.findAll.useQuery({
		search: {
			issuanceStatus: status
		},
		limit,
		page,
	})

	useEffect(() => {
		setIssuanceAsset(null)
		console.log(issuanceAsset)
	}, [])

	// console.log("transfer asset number: "+ issuanceAsset?.number);

	useEffect(() => {
		// console.log("transfer asset: " + issuanceAsset)

		//get and parse all data
		if (data) {
			setAssets(data.assetIssuance as IssuanceType[])
			setAccessiblePage(Math.ceil(data.count / limit))
		}
	}, [data, limit])


	useEffect(() => {
		console.log(status, limit, page);
	}, [status, limit, page]);

	// console.log(issuanceAsset)
	return (
		<DashboardLayout>
			<div className="">
				<h3 className="text-xl font-medium px-1">Issuance</h3>
				<Issuance
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

export default NewIssuance
