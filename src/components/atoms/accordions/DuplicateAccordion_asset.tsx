import { Accordion } from "@mantine/core"
import { trpc } from "../../../utils/trpc"
import { useEffect, useState } from "react"
import { MouseEventHandler } from "react"
import {
  ExcelExportAssetType,
  ExcelAssetCheckerType,
} from "../../../types/asset"
import { Asset } from "../../../types/generic"

const DuplicateAccordion_asset = (props: {
  currentRecords: Asset[]
  incomingChanges: ExcelAssetCheckerType[]
}) => {
  const [assetId, setAssetId] = useState<number>(-1)
  const [spliceId, setSpliceId] = useState<number>(-1)
  const [assetsMutate, setAssetsMutate] = useState<ExcelAssetCheckerType[]>([])

  const {
    mutate,
    isLoading: assetLoading,
    error,
  } = trpc.asset.edit.useMutation({
    onSuccess() {
      console.log("singol change")
      removeItem(assetId)
      props.incomingChanges.splice(spliceId, 1)
      props.currentRecords.splice(spliceId, 1) // invalidate query of asset id when mutations is successful
    },
  })

  const [mappedItems, setMappedItems] = useState<Asset[]>(props.currentRecords)

  const removeItem = (assetId: number) => {
    const updatedItems = props.currentRecords.filter(
      (item) => item?.id !== assetId
    )
    setMappedItems(updatedItems)
  }

  const retainRecord = (id: number, assetId: number) => () => {
    removeItem(assetId)
    console.log(
      "INITIAL INCOMING CHANGES: " + props.incomingChanges.length + "idx: " + id
    )
    props.incomingChanges.splice(id, 1)
    props.currentRecords.splice(id, 1)
    console.log("INCOMING CHANGES: " + props.incomingChanges.length)
  }

  const acceptChange = (splice: number, assetId: number) => () => {
    setSpliceId(splice)
    setAssetId(assetId)
    try {
      mutate({
        id: assetId ?? 0,
        name: props.incomingChanges[splice]?.name ?? "",
        number: props.incomingChanges[splice]?.asset_number ?? "",
        serial_no: props.incomingChanges[splice]?.serial_no ?? "",
        barcode: props.incomingChanges[splice]?.barcode,
        brand: props.incomingChanges[splice]?.brand,
        type: props.incomingChanges[splice]?.type ?? "",
        caliber: props.incomingChanges[splice]?.caliber,
        models: props.incomingChanges[splice]?.models,
        action_type: props.incomingChanges[splice]?.models,
        description: props.incomingChanges[splice]?.description ?? "",
      })
    } catch {
      console.log(error)
    }
  }

  useEffect(() => {
    if (props.incomingChanges)
      console.log(props.incomingChanges, "incoming changes")
  }, [props.incomingChanges])

  return (
    <Accordion>
      {mappedItems.map((asset, idx) => (
        <>
          <Accordion.Item value={asset?.id.toString() ?? ""} key={idx}>
            <Accordion.Control className="uppercase">
              <div className="grid w-1/2 grid-cols-2 gap-1">
                <p>{asset?.number}</p>
                <p>{asset?.name}</p>
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
                      {JSON.stringify(
                        {
                          name: asset?.name ?? "",
                          asset_number: asset?.number ?? "",
                          serial_no: asset?.serial_no ?? "",
                          barcode: asset?.barcode ?? "",
                          brand: asset?.brand ?? "",
                          type: asset?.type?.name ?? "",
                          caliber: asset?.caliber ?? "",
                          models: asset?.models ?? "",
                          action_type: asset?.actionType?.name ?? "",
                          description: asset?.description ?? "",
                        },
                        null,
                        1
                      )}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1 border-l-2 border-tangerine-500 px-4">
                    <p className="text-sm text-light-secondary">
                      Incoming Change
                    </p>
                    <pre className="text-sm">
                      {props.incomingChanges ? (
                        JSON.stringify(
                          props.incomingChanges.find(
                            (i) => asset?.number == i?.asset_number
                          ),
                          null,
                          2
                        )
                      ) : (
                        <></>
                      )}
                    </pre>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="px-2 hover:underline"
                    onClick={retainRecord(idx, asset?.id ?? 0)}
                  >
                    Retain Record
                  </button>
                  <button
                    className="border-l-2 border-tangerine-600 px-2 text-tangerine-500 hover:underline disabled:text-gray-500"
                    onClick={acceptChange(idx, asset?.id ?? 0)}
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
