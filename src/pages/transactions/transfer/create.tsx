import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import Modal from "../../../components/headless/modal/modal";
import AddRepairForm from "../../../components/transaction/AddRepair/AddRepairForm"
import DashboardLayout from "../../../layouts/DashboardLayout"
import { useSearchStore, useTransferAssetStore } from "../../../store/useStore";
import { AssetType } from '../../../types/generic';
import { trpc } from '../../../utils/trpc';
import TransferAssetTable from "../../../components/transaction/Transfer/TransferAssetDetails";
import TransferAsset from "../../../components/transaction/Transfer/TransferAsset";
import DisplayTransferAssets from "../../../components/transaction/Transfer/DisplayTransferAssets";
import Transfer from "../../../components/transaction/Transfer/TransferAsset";



const TransferNew = () =>
// {
//   return (
//     <DashboardLayout>
//       <div className="shadow-mg flex h-full flex-col gap-2 rounded-md border bg-white p-4 shadow-lg">
//         <div className="py-2">
//           <AddRepairForm />
//         </div>
//       </div>
//     </DashboardLayout>
//   )
// }

{
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

  const { transferAsset, setTransferAsset } = useTransferAssetStore()

  const [validateString, setValidateString] = useState<string>("")
  const [validateModal, setValidateModal] = useState<boolean>(false)


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



  useEffect(() => {


    if (transferAsset !== null) {
      if (transferAsset === null || transferAsset?.deleted === true) {
        setTransferAsset(null)
      } else if (transferAsset?.status === "disposal") {
        setValidateString("The asset is in for disposal")
        setValidateModal(true)
        setTransferAsset(null)
      } else if (transferAsset?.status === "repair") {
        setValidateString("The asset is in for repair.")
        setValidateModal(true)
        setTransferAsset(null)
      } else if (transferAsset?.status === "transfer") {
        setValidateString("The asset is already being transferred.")
        setValidateModal(true)
        setTransferAsset(null)
      }
      else {
        setTransferAsset(transferAsset);
      }
    }
  }, [setTransferAsset, transferAsset])
  return (
    <DashboardLayout>
      {/* <div className="rounded-lg p-8 m-2 bg-white">
              <div className="py-2">
                  <CreateDisposeAccordion />
              </div>
          </div> */}

      <div>
        {(transferAsset?.number === "" || transferAsset?.number === null || transferAsset?.number === undefined) ? <DisplayTransferAssets
          total={data?.count ?? 0}
          assets={assets}
          accessiblePage={accessiblePage}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit} /> : <Transfer />}
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

export default TransferNew
