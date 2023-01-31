
import React, { useEffect, useState } from 'react';
import { Pagination } from '@mantine/core';
import AssetTable, { AssetDeleteModal } from '../../atoms/table/AssetTable';
import Link from 'next/link';
import { AssetType } from '../../../types/generic';
import { columns } from '../../../lib/table';
import PaginationPopOver from '../../atoms/popover/PaginationPopOver';
// import FilterPopOver from '../../atoms/popover/FilterPopOver';
import TransferAssetTable from '../../atoms/table/TransferAssetTable';
import Modal from '../../headless/modal/modal';
import { useSearchStore } from '../../../store/useStore';
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
    const [checkboxes, setCheckboxes] = useState<number[]>([]);
    // const [ openPopover, setOpenPopover ] = useState<boolean>(false);
    const [paginationPopover, setPaginationPopover] = useState<boolean>(false);
    const [openModalDel, setOpenModalDel] = useState<boolean>(false);


    const [filterBy, setFilterBy] = useState<string[]>(columns.map((i) => i.value));


    const [assetNumber, setAssetNumber] = useState<string>('');
    const [searchAsset, setSearchAsset] = useState<string>('');


    const { data: asset } = trpc.asset.findOne.useQuery(assetNumber.toUpperCase());


    const [searchModal, setSearchModal] = useState<boolean>(false);
    const { transferAsset, setTransferAsset } = useTransferAssetStore();


    useEffect(
        () => {
            setTransferAsset(asset as AssetType);
        },
        [setTransferAsset, asset]
    );




    return (
        <div className="space-y-2">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex w-fit items-center gap-2">
                            <div className="flex-1">
                                <div className="w-full py-2">
                                    <div className="flex flex-row bg-[#F2F2F2] w-80 border border-[#F2F2F2] rounded-sm px-4 py-2">
                                        <input
                                            type="text"
                                            onChange={(event) => {
                                                setSearchAsset(event.currentTarget.value);
                                                console.log('search value: ' + event.currentTarget.value);
                                            }}
                                            placeholder="Search/Input Asset Number"
                                            className="bg-transparent w-[100%] outlinex-none focus:outline-none text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                setAssetNumber(searchAsset);
                                                console.log('search: ', searchAsset);
                                            }}
                                        >
                                            <Search className="bg-transparent outline-none focus:outline-none" />
                                        </button>
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
                            </div>
                            {/* <FilterPopOver
                                openPopover={openPopover}
                                setOpenPopover={setOpenPopover}
                                filterBy={filterBy}
                                setFilterBy={setFilterBy}
                                columns={columns}
                            /> */}
                        </div>
                        {checkboxes.length > 0 && (
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
                        )}
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
            <TransferAssetTable
                // checkboxes={checkboxes}
                // setCheckboxes={setCheckboxes}
                rows={props.assets}
                filterBy={filterBy}
                columns={columns.filter((col) => filterBy.includes(col.value))}
            />
            <section className="mt-8 flex justify-between px-4">
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
                <Pagination
                    page={props.page}
                    onChange={props.setPage}
                    total={props.accessiblePage}
                    classNames={{
                        item: 'bg-transparent selected-page:bg-tangerine-500 border-none'
                    }}
                />
            </section>
            <AssetDeleteModal
                checkboxes={checkboxes}
                setCheckboxes={setCheckboxes}
                assets={props.assets}
                openModalDel={openModalDel}
                setOpenModalDel={setOpenModalDel}
            />
        </div>
    );
};


export default DisplayTransferAssets;


