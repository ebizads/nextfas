import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreateDisposeAccordion from "../../../components/atoms/accordions/CreateDisposeAccordion";
import Modal from "../../../components/headless/modal/modal";
import DisplayDisposeAssets from "../../../components/transaction/Disposal/DisplayDisposeAssets";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useDisposeAssetStore, useIssuanceStore } from "../../../store/useStore";
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

    const { issuanceState, setIssuanceState } = useIssuanceStore()

    const [validateString, setValidateString] = useState<string>("")
    const [validateModal, setValidateModal] = useState<boolean>(false)


    useEffect(() => {
        setIssuanceState(null);
    }, [setIssuanceState])



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
        if (issuanceState !== null) {
            if (issuanceState === null || issuanceState?.deleted === true) {
                setIssuanceState(null)
            } else if (issuanceState?.status === "disposal") {
                setValidateString("The asset is already in for disposal")
                setValidateModal(true)
                setIssuanceState(null)
            } else if (issuanceState?.status === "repair") {
                setValidateString("The asset is in for repair.")
                setValidateModal(true)
                setIssuanceState(null)
            } else if (issuanceState?.status === "transfer") {
                setValidateString("The asset is being transferred.")
                setValidateModal(true)
                setIssuanceState(null)
            }
            else {
                setIssuanceState(issuanceState);
            }
        }
    }, [issuanceState, setIssuanceState])

    return (
        <DashboardLayout>
            {/* <div className="rounded-lg p-8 m-2 bg-white">
                <div className="py-2">
                    <CreateDisposeAccordion />
                </div>
            </div> */}

            <div>
                {issuanceState && <CreateDisposeAccordion />}
                {!issuanceState && <DisplayDisposeAssets
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