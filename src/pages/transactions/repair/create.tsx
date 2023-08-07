import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import Modal from "../../../components/headless/modal/modal";
import AddRepairForm from "../../../components/transaction/AddRepair/AddRepairForm"
import DisplayRepairAssets from "../../../components/transaction/AddRepair/DisplayRepairAssets";
import DashboardLayout from "../../../layouts/DashboardLayout"
import { useRepairAssetStore, useSearchStore } from "../../../store/useStore";
import { AssetType } from '../../../types/generic';
import { trpc } from '../../../utils/trpc';
import { rest } from "lodash";



const RepairNew = () =>
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
    search: { ...rest },
    limit,
    page
  });

  const [assets, setAssets] = useState<AssetType[]>([]);
  const [accessiblePage, setAccessiblePage] = useState<number>(0);

  const { repairAsset, setRepairAsset } = useRepairAssetStore()

  const [validateString, setValidateString] = useState<string>("")
  const [validateModal, setValidateModal] = useState<boolean>(false)


  useEffect(() => {
    setRepairAsset(null);
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
    if (repairAsset !== null) {
      if (repairAsset === null || repairAsset?.deleted === true) {
        setRepairAsset(null)
      } else if (repairAsset?.status === "disposal") {
        setValidateString("The asset is in for disposal")
        setValidateModal(true)
        setRepairAsset(null)
      } else if (repairAsset?.status === "repair") {
        setValidateString("The asset is already in for repair.")
        setValidateModal(true)
        setRepairAsset(null)
      } else if (repairAsset?.status === "transfer") {
        setValidateString("The asset is being transferred.")
        setValidateModal(true)
        setRepairAsset(null)
      }
      else {
        setRepairAsset(repairAsset);
      }
    }
  }, [setRepairAsset, repairAsset])

  return (
    <DashboardLayout>
      {/* <div className="rounded-lg p-8 m-2 bg-white">
              <div className="py-2">
                  <CreateDisposeAccordion />
              </div>
          </div> */}

      <div>
        <AddRepairForm />
        {/* {!repairAsset && <DisplayRepairAssets
          total={data?.count ?? 0}
          assets={assets}
          accessiblePage={accessiblePage}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />} */}
        {/* <Modal
          className="max-w-lg"
          isVisible={validateModal}
          setIsVisible={setValidateModal}
          title="NOTICE!!"
        >
          <div className="py-2">
            <p className=" text-center text-lg font-semibold">{validateString}</p>

          </div>
        </Modal> */}
      </div>
    </DashboardLayout>
  )

}

export default RepairNew
