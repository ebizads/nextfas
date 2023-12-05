import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AssetType } from '../../../types/generic';
import { columns } from '../../../lib/table';
import PaginationPopOver from '../../atoms/popover/PaginationPopOver';
// import FilterPopOver from '../../atoms/popover/FilterPopOver';
import TransferAssetTable from './TransferAssetDetails';
import Modal from '../../headless/modal/modal';
import { useGenerateStore, useSearchStore } from '../../../store/useStore';
import { Pagination, Tooltip } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { trpc } from '../../../utils/trpc';
import { useTransferAssetStore } from '../../../store/useStore';
// import { number } from 'zod';

const DisplayTransferAssets = (props: {
    total: number;
    assets: AssetType[];
    accessiblePage: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
    // const [checkboxes, setCheckboxes] = useState<number[]>([]);
    // const [ openPopover, setOpenPopover ] = useState<boolean>(false);
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false);
    const [openModalDel, setOpenModalDel] = useState<boolean>(false);

    const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value));

    const [assetNumber, setAssetNumber] = useState<string>('');
    const [searchAsset, setSearchAsset] = useState<string>('');

    const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase());

    const [validateString, setValidateString] = useState<string>("")

    const [assetId, setAssetId] = useState<number>(0)


    const [validateModal, setValidateModal] = useState<boolean>(false)

    const { search, setSearch } = useSearchStore()
    const [searchModal, setSearchModal] = useState<boolean>(false);
    const { transferAsset, setTransferAsset } = useTransferAssetStore();
    const { generate, setGenerate } = useGenerateStore()


    // useEffect(
    // 	() => {
    // 		setTransferAsset(asset as AssetType);
    // 	},
    // 	[setTransferAsset, asset]
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
                setTransferAsset(asset as AssetType);
            }

            setSearch("");
        }
        // setGenerate(false);
    }, [setTransferAsset, asset, assetNumber, assetId, setSearch])

    return (
        <div className="space-y-4">
            {/* <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex w-fit items-center gap-2">
                            <div className="flex-1">
                                <div className="w-full py-4">
                                    <div className="flex flex-row bg-[#F2F2F2] w-80 border border-[#F2F2F2] rounded-sm py-2">
                                        <input type="text" className="border-gray-400 border-2 rounded p-[0.1rem]" placeholder="Search Asset No." onChange={(e) => setSearch(e.currentTarget.value)}>


                                        </input>

                                    </div>
                                </div>

                                <Modal
                                    className="max-w-lg"
                                    isVisible={searchModal}
                                    setIsVisible={setSearchModal}
                                    title="NOTICE!!"
                                >
                                    <div className="py-2">
                                        <p className="text-center text-lg font-semibold">No Data Found!</p>
                                    </div>
                                </Modal>
                                <Modal
                                    className="max-w-lg"
                                    isVisible={validateModal}
                                    setIsVisible={setValidateModal}
                                    title="NOTICE!!"
                                >
                                    <div className="py-2">
                                        <p className="text-center text-lg font-semibold">{validateString}</p>
                                    </div>
                                </Modal>
                            </div>
                        </div>

                    </div>
                    <div className="flex items-center gap-2">
                    </div>
                </div>
            </section> */}
            <TransferAssetTable
                // checkboxes={checkboxes}
                // setCheckboxes={setCheckboxes}
                rows={props.assets}
                filterBy={filterBy}
                columns={columns.filter((col) => filterBy.includes(col.value))}
            />
            {/* <section className="mt-8 flex justify-between px-4">
                <div className="flex items-center gap-2">
                    <p>Showing up to</p>
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
            </section> */}
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

export default DisplayTransferAssets;