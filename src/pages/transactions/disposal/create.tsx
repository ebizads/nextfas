import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreateDisposeAccordion from "../../../components/atoms/accordions/CreateDisposeAccordion";
import Modal from "../../../components/headless/modal/modal";
import DisplayDisposeAssets from "../../../components/transaction/Disposal/DisplayDisposeAssets";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useDisposeAssetStore } from "../../../store/useStore";
import { AssetType } from '../../../types/generic';
import { trpc } from '../../../utils/trpc';
import { useSearchStore } from "../../../store/useStore";


const DisposeNew = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const router = useRouter();
    const { search } = useSearchStore()

    const { data } = trpc.asset.findAll.useQuery({
        search: { number: search },
        limit,
        page
    });

    const [assets, setAssets] = useState<AssetType[]>([]);
    const [accessiblePage, setAccessiblePage] = useState<number>(0);

    const { disposeAsset, setDisposeAsset } = useDisposeAssetStore()

    const [validateString, setValidateString] = useState<string>("")
    const [validateModal, setValidateModal] = useState<boolean>(false)


    useEffect(() => {
        setDisposeAsset(null);
    }, [setDisposeAsset])



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

    useEffect(() => {
        if (disposeAsset !== null) {
            if (disposeAsset === null || disposeAsset?.deleted === true) {
                setDisposeAsset(null)
            } else if (disposeAsset?.status === "disposal") {
                setValidateString("The asset is already in for disposal")
                setValidateModal(true)
                setDisposeAsset(null)
            } else if (disposeAsset?.status === "repair") {
                setValidateString("The asset is in for repair.")
                setValidateModal(true)
                setDisposeAsset(null)
            } else if (disposeAsset?.status === "transfer") {
                setValidateString("The asset is being transferred.")
                setValidateModal(true)
                setDisposeAsset(null)
            }
            else {
                setDisposeAsset(disposeAsset);
            }
        }
    }, [setDisposeAsset, disposeAsset])

    return (
        <DashboardLayout>
            {/* <div className="rounded-lg p-8 m-2 bg-white">
                <div className="py-2">
                    <CreateDisposeAccordion />
                </div>
            </div> */}

            <div>
                {disposeAsset && <CreateDisposeAccordion />}
                {!disposeAsset && <DisplayDisposeAssets
                    total={data?.count ?? 0}
                    assets={assets}
                    accessiblePage={accessiblePage}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />}
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
        </DashboardLayout>
    )

}

export default DisposeNew