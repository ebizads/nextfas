import React, { useEffect, useState } from 'react';
import { Pagination, Tooltip } from '@mantine/core';
import AssetTable, { AssetDeleteModal } from '../../atoms/table/AssetTable';
import Link from 'next/link';
import { AssetType } from '../../../types/generic';
import { columns } from '../../../lib/table';
import PaginationPopOver from '../../atoms/popover/PaginationPopOver';
// import FilterPopOver from '../../atoms/popover/FilterPopOver';
import RepairAssetTable from '../../atoms/table/RepairAssetTable';
import Modal from '../../headless/modal/modal';
import { Search } from 'tabler-icons-react';
import { trpc } from '../../../utils/trpc';
import { useGenerateStore, useRepairAssetStore, useSearchStore } from '../../../store/useStore';
import FilterPopOver from '../../atoms/popover/FilterPopOver';
// import { number } from 'zod';

const DisplayRepairAssets = (props: {
	total: number;
	assets: AssetType[];
	accessiblePage: number;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	limit: number;
	setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
	// const [ openPopover, setOpenPopover ] = useState<boolean>(false);
	const [paginationPopover, setPaginationPopover] = useState<boolean>(false);
	const [openModalDel, setOpenModalDel] = useState<boolean>(false);
	const [openPopover, setOpenPopover] = useState<boolean>(false)

	const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value));

	const [assetNumber, setAssetNumber] = useState<string>("")
	const [searchAsset, setSearchAsset] = useState<string>("")
	const [validateString, setValidateString] = useState<string>("")

	const [assetId, setAssetId] = useState<number>(0)

	const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase());

	const [searchModal, setSearchModal] = useState<boolean>(false);
	const [validateModal, setValidateModal] = useState<boolean>(false)

	const { repairAsset, setRepairAsset } = useRepairAssetStore();
	const { search, setSearch } = useSearchStore();
	const { generate, setGenerate } = useGenerateStore()


	// useEffect(
	// 	() => {
	// 		setRepairAsset(asset as AssetType);
	// 	},
	// 	[setRepairAsset, asset]
	// );

	useEffect(() => {
		if (assetNumber !== "") {
			if (asset === null || asset?.deleted === true) {
				setSearchModal(true)
				setAssetNumber("")
			} else if (asset?.status === "disposal") {
				setValidateString("The asset is in for disposal")
				setValidateModal(true)
				setAssetNumber("")
			} else if (asset?.status === "repair") {
				setValidateString("The asset is already in for repair.")
				setValidateModal(true)
				setAssetNumber("")
			}
			else if (asset?.status === "transfer") {
				setValidateString("The asset is currently being transferred.")
				setValidateModal(true)
				setAssetNumber("")
			}
			else {
				setRepairAsset(asset as AssetType);
			}

			setSearch("");
		}
		// setGenerate(false);
	}, [setRepairAsset, asset, assetNumber, assetId, setSearch])


	return (
		<div className="space-y-4">
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex w-fit items-center gap-2">
							<div className="flex-1">
								<input type="text" className="border-gray-400 border-2 rounded p-[0.1rem]" placeholder="Search Asset Name" onChange={(e) => setSearch(e.currentTarget.value)}>
								</input>
							</div>
							<FilterPopOver
								openPopover={openPopover}
								setOpenPopover={setOpenPopover}
								filterBy={filterBy}
								setFilterBy={setFilterBy}
								columns={columns}
							/>
						</div>
						{/* {checkboxes.length > 0 && (
							<button
								onClick={() => setOpenModalDel(true)}
								className="flex gap-2 rounded-md p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none"
							>
								{checkboxes.includes(-1) ? (
									`Delete all record/s ( ${props.assets.length} ) ?`
								) : (
									`Delete selected record/s ( ${checkboxes.length} )`
								)}
							</button>
						)} */}
					</div>
					<div className="flex items-center gap-2">
						{/* <button className="flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
							<i className="fa-solid fa-print text-xs" />
							Print CVs
						</button> */}
						{/* <Link href={'/assets/create'}>
							<div className="flex cursor-pointer gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
								<i className="fa-regular fa-plus text-xs" />
								<p>Add New</p>
							</div>
						</Link> */}
					</div>
				</div>
			</section>
			<RepairAssetTable
				// checkboxes={checkboxes}
				// setCheckboxes={setCheckboxes}
				rows={props.assets}
				filterBy={filterBy}
				columns={columns.filter((col) => filterBy.includes(col.value))}
			/>
			<section className="mt-8 flex justify-between px-2">
				<div className="flex items-center gap-2">
					<p>Showing up to </p>
					<PaginationPopOver
						paginationPopover={paginationPopover}
						setPaginationPopover={setPaginationPopover}
						page={props.page}
						setPage={props.setPage}
						limit={props.limit}
						setLimit={props.setLimit}
					/>
					<p> entries</p>
				</div>
				<div className='flex flex-row'>
					<Tooltip label={!generate ? "Show all assets" : "Show only available assets"} withArrow>
						<button
							className="mx-2 text-gray-700 py-1 font-medium duration-150 hover:underline  disabled:bg-gray-300 disabled:text-gray-500"
							onClick={() => { setGenerate(true) }}>{!generate ? "Show all" : "Show less"}
						</button>
					</Tooltip>
					<Pagination
						page={props.page}
						onChange={props.setPage}
						total={props.accessiblePage}
						classNames={{
							item: 'bg-transparent selected-page:bg-tangerine-500 border-none'
						}}
					/>
				</div>
			</section>

			{/* <AssetDeleteModal
				checkboxes={checkboxes}
				setCheckboxes={setCheckboxes}
				assets={props.assets}
				openModalDel={openModalDel}
				setOpenModalDel={setOpenModalDel}
			/> */}
		</div>
	);
};

export default DisplayRepairAssets;
