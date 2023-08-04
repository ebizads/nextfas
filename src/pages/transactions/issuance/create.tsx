import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import Modal from "../../../components/headless/modal/modal";
import AddRepairForm from "../../../components/transaction/AddRepair/AddRepairForm"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { useSearchStore, useIssuanceAssetStore } from "../../../store/useStore";
import { AssetType } from '../../../types/generic';
import { trpc } from '../../../utils/trpc';
import TransferAssetTable from "../../../components/transaction/Transfer/TransferAssetDetails";
import TransferAsset from "../../../components/transaction/Transfer/TransferAsset";
import DisplayTransferAssets from "../../../components/transaction/Transfer/DisplayTransferAssets";
import Transfer from "../../../components/transaction/Transfer/TransferAsset";
import DisplayIssuanceAsset from "../../../components/transaction/Issuance/DisplayIssuanceAsset";
import Issue from "../../../components/transaction/Issuance/IssueAsset";



const IssueNew = () => {
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

    const { issuanceAsset, setIssuanceAsset } = useIssuanceAssetStore()

    const [validateString, setValidateString] = useState<string>("")
    const [validateModal, setValidateModal] = useState<boolean>(false)


    useEffect(() => {
        setIssuanceAsset(null);
    }, [setIssuanceAsset])



    // console.log("transfer asset number: "+ issuanceAsset?.number);


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


        if (issuanceAsset !== null) {
            if (issuanceAsset === null || issuanceAsset?.deleted === true) {
                setIssuanceAsset(null)
            } else if (issuanceAsset?.status === "disposal") {
                setValidateString("The asset is in for disposal")
                setValidateModal(true)
                setIssuanceAsset(null)
            } else if (issuanceAsset?.status === "repair") {
                setValidateString("The asset is in for repair.")
                setValidateModal(true)
                setIssuanceAsset(null)
            } else if (issuanceAsset?.status === "transfer") {
                setValidateString("The asset is already being transferred.")
                setValidateModal(true)
                setIssuanceAsset(null)
            } else if (issuanceAsset?.AssetIssuance?.issuanceStatus) {
                setValidateString("The asset is already issued.")
                setValidateModal(true)
                setIssuanceAsset(null)
            }
            else {
                setIssuanceAsset(issuanceAsset);
            }
        }
    }, [setIssuanceAsset, issuanceAsset])
    return (
        <DashboardLayout>
            {/* <div className="rounded-lg p-8 m-2 bg-white">
              <div className="py-2">
                  <CreateDisposeAccordion />
              </div>
          </div> */}

            <div>
                <Issue />
                <Modal
                    className="max-w-lg"
                    isVisible={validateModal}
                    setIsVisible={setValidateModal}
                    title="NOTICE!!"
                >
                    <div className="py-2">
                        <p className=" text-center text-lg font-semibold">{validateString}</p>

                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    )

}

export default IssueNew
