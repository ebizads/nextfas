import { Accordion } from "@mantine/core"
import { Asset, Employee } from "@prisma/client"
import { trpc } from "../../../utils/trpc"
import { useState } from "react"
import { MouseEventHandler } from "react"
import { ExcelExportAssetType } from "../../../types/asset"

const DuplicateAccordion_asset = (props: {
  currentRecords: Asset[]
  incomingChanges: ExcelExportAssetType[]
}) => {
  const [assetArray, setAssetArray] = useState<number[]>([])
  const [assetId, setAssetId] = useState<number>(-1)
  const [spliceId, setSpliceId] = useState<number>(-1)
  const [assetsMutate, setAssetsMutate] = useState<ExcelExportAssetType[]>([])

  const {
    mutate,
    isLoading: assetLoading,
    error,
  } = trpc.asset.edit.useMutation({
    onSuccess() {
      console.log("singol change")
      removeItem(assetId)
      props.incomingChanges.splice(spliceId, 1)
      props.currentRecords.splice(spliceId, 1)        // invalidate query of asset id when mutations is successful
    },
  })


  const [mappedItems, setMappedItems] = useState(props.currentRecords);

  const removeItem = (assetId: number) => {
    const updatedItems = props.currentRecords.filter((item) => item.id !== assetId);
    setMappedItems(updatedItems);
  };

  const retainRecord = (id: number, assetId: number) => () => {
    removeItem(assetId)
    console.log("INITIAL INCOMING CHANGES: " + props.incomingChanges.length + "idx: " + id)
    props.incomingChanges.splice(id, 1)
    props.currentRecords.splice(id, 1)
    console.log(
      "INCOMING CHANGES: " + props.incomingChanges.length,
    )
  }

  const acceptChange = (splice: number, assetId: number) => () => {
    setAssetId(assetId)
    setSpliceId(splice)

    console.log("data: " + JSON.stringify(props.incomingChanges[splice]))
    try {
      mutate({
        id: props.incomingChanges[splice]?.id ?? 0,
        name: props.incomingChanges[splice]?.name ?? "",
        number: props.incomingChanges[splice]?.number ?? "",
        alt_number: props.incomingChanges[splice]?.alt_number,
        serial_no: props.incomingChanges[splice]?.serial_no ?? "",
        barcode: props.incomingChanges[splice]?.barcode,
        description: props.incomingChanges[splice]?.description ?? "",
        remarks: props.incomingChanges[splice]?.remarks ?? "",
        parentId: props.incomingChanges[splice]?.parentId ?? 0,
        modelId: props.incomingChanges[splice]?.modelId ?? 0,
        custodianId: props.incomingChanges[splice]?.custodianId ?? 0,
        vendorId: props.incomingChanges[splice]?.vendorId ?? 0,
        assetProjectId: props.incomingChanges[splice]?.assetProjectId ?? 0,
        // createdAt: props.incomingChanges[splice]?.createdAt ?? new Date(),
        // updatedAt: props.incomingChanges[splice]?.updatedAt ?? new Date(),
        // deletedAt: props.incomingChanges[splice]?.deletedAt ?? null,
        // deleted: props.incomingChanges[splice]?.deleted ?? false,
        departmentId: props.incomingChanges[splice]?.departmentId ?? 0,
        subsidiaryId: props.incomingChanges[splice]?.subsidiaryId ?? 0,
        invoiceNum: props.incomingChanges[splice]?.invoiceNum ?? "",
        purchaseOrder: props.incomingChanges[splice]?.purchaseOrder ?? "",
        deployment_status: props.incomingChanges[splice]?.deployment_status ?? "",
        status: props.incomingChanges[splice]?.status ?? "",
        management: {
          currency: props.incomingChanges[splice]?.management?.currency ?? "",
          original_cost: props.incomingChanges[splice]?.management?.original_cost ?? 0,
          current_cost: props.incomingChanges[splice]?.management?.current_cost ?? 0,
          residual_value: props.incomingChanges[splice]?.management?.residual_value ?? 0,
          purchase_date: props.incomingChanges[splice]?.management?.purchase_date,
          depreciation_start: props.incomingChanges[splice]?.management?.depreciation_start,
          depreciation_end: props.incomingChanges[splice]?.management?.depreciation_end,
          depreciation_status: props.incomingChanges[splice]?.management?.depreciation_status,
          depreciation_period: props.incomingChanges[splice]?.management?.id ?? 0,
          depreciation_rule: props.incomingChanges[splice]?.management?.depreciation_rule ?? "",
          // assetId: props.incomingChanges[splice]?.id ?? 0,
          accounting_method: props.incomingChanges[splice]?.management?.accounting_method ?? "",
          depreciation_lifetime: props.incomingChanges[splice]?.management?.depreciation_lifetime ?? 0,
          residual_percentage: props.incomingChanges[splice]?.management?.residual_percentage ?? 0,
          asset_location: props.incomingChanges[splice]?.management?.asset_location ?? "",
          asset_quantity: props.incomingChanges[splice]?.management?.asset_quantity ?? 1,
          asset_lifetime: props.incomingChanges[splice]?.management?.asset_lifetime ?? 0,
          id: props.incomingChanges[splice]?.management?.id ?? 0

        }
      })
    } catch { console.log(error) }
  }

  return (

    <Accordion>
      {mappedItems.map((asset, idx) => (
        <>
          <Accordion.Item value={asset.id.toString()} key={idx}>
            <Accordion.Control className="uppercase">
              <div className="grid w-1/2 grid-cols-2 gap-1">
                <p>{asset.number}</p>
                <p>{asset.name}</p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-light-secondary">
                      Current Record
                    </p>
                    <pre className="text-sm">

                      {JSON.stringify(asset, null, 1)}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1 border-l-2 border-tangerine-500 px-4">
                    <p className="text-sm text-light-secondary">
                      Incoming Change
                    </p>
                    <pre className="text-sm">
                      {props.incomingChanges ? (
                        JSON.stringify(props.incomingChanges[idx], null, 2)
                      ) : (
                        <></>
                      )}
                    </pre>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="px-2 hover:underline"
                    onClick={retainRecord(idx, asset.id)}
                  >
                    Retain Record
                  </button>
                  <button
                    className="border-l-2 border-tangerine-600 px-2 text-tangerine-500 hover:underline disabled:text-gray-500"
                    onClick={acceptChange(idx, asset.id)}
                    disabled={assetLoading}
                  >
                    {assetLoading ? "Loading..." : "Accept Import"}
                  </button>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </>
      ))}
    </Accordion>

  )
}

export default DuplicateAccordion_asset
