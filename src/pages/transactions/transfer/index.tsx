import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DisplayTransferAssets from '../../../components/transaction/Transfer/DisplayTransferAssets';
import Transfer from '../../../components/transaction/Transfer/TransferAsset';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useTransferAssetStore, useUpdateAssetStore } from '../../../store/useStore';
import { AssetType } from '../../../types/generic';
import { trpc } from '../../../utils/trpc';

const AssetTransfer = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const router = useRouter();

	const { data } = trpc.asset.findAll.useQuery({
		limit,
		page
	});

	const [assets, setAssets] = useState<AssetType[]>([]);
	const [accessiblePage, setAccessiblePage] = useState<number>(0);

	const { transferAsset, setTransferAsset } = useTransferAssetStore()

	useEffect(() => {
		setTransferAsset(null);
	}, [])



	// console.log("transfer asset number: "+ transferAsset?.number);


	useEffect(
		() => {
			//get and parse all data
			if (data) {
				setAssets(data.assets as AssetType[]);
				setAccessiblePage(Math.ceil(data.count / limit));
			}
		},
		[data, limit, router]
	);
	// console.log(transferAsset)
	return (
		<DashboardLayout>
			<div>
				{transferAsset && <Transfer />}
				{!transferAsset && <DisplayTransferAssets
					total={data?.count ?? 0}
					assets={assets}
					accessiblePage={accessiblePage}
					page={page}
					setPage={setPage}
					limit={limit}
					setLimit={setLimit}
				/>}
			</div>
		</DashboardLayout>
	);
};

export default AssetTransfer;
