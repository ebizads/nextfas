import { Accordion } from "@mantine/core"
// import { ExcelExportType } from "../../../types/asset"
import { ExcelAssetCheckerType } from "../../../types/asset"
import { useState } from "react"

const AssetRecordsAccordion = (props: {
  incomingChanges: ExcelAssetCheckerType[]
}) => {
  const [openedItem, setOpenedItem] = useState<string | null>(null)

  return (
    <Accordion value={openedItem} onChange={setOpenedItem}>
      {props.incomingChanges?.map((asset, idx) => (
        <Accordion.Item
          value={asset?.id?.toString() ?? idx.toString()}
          key={idx}
        >
          <Accordion.Control className="uppercase">
            <div className="grid w-1/2 grid-cols-2 gap-1">
              <p>{asset?.name}</p>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-col gap-2">
              <div className="flex w-full gap-4">
                <div className="flex w-full flex-col gap-1 border-l-2 border-tangerine-500 px-4">
                  <p className="text-sm text-light-secondary">
                    Incoming Change
                  </p>
                  {/* <pre className="text-sm">
                    {JSON.stringify(asset, null, 2)}
                  </pre> */}
                  <div className="mt-4 flex flex-col gap-4 p-2 text-sm">
                    <section className="grid w-full grid-cols-4 text-xs md:text-base">
                      <div className="col-span-1">
                        <p className=" font-light">Asset Name</p>
                        <p className=" font-medium">
                          {asset?.name && asset?.name.length > 0
                            ? asset?.name
                            : "--"}
                        </p>
                      </div>{" "}
                      <div className="col-span-1">
                        <p className=" font-light">Serial Number</p>
                        <p className=" font-medium">
                          {asset?.serial_no && asset?.serial_no.length > 0
                            ? asset?.serial_no
                            : "--"}
                        </p>
                      </div>{" "}
                      <div className="col-span-1">
                        <p className=" font-light">Brand</p>
                        <p className=" font-medium">
                          {asset?.brand && asset?.brand.length > 0
                            ? asset?.brand
                            : "--"}
                        </p>
                      </div>
                    </section>
                    <section className="grid w-full grid-cols-4 text-xs md:text-base">
                      <div className="col-span-1">
                        <p className=" font-light">Type</p>
                        <p className=" font-medium">
                          {asset?.type && asset?.type.length > 0
                            ? asset?.type
                            : "--"}
                        </p>
                      </div>{" "}
                      <div className="col-span-1">
                        <p className=" font-light">Caliber</p>
                        <p className=" font-medium">
                          {asset?.caliber && asset?.caliber.length > 0
                            ? asset?.caliber
                            : "--"}
                        </p>
                      </div>{" "}
                      <div className="col-span-1">
                        <p className=" font-light">Models</p>
                        <p className=" font-medium">
                          {asset?.models && asset?.models.length > 0
                            ? asset?.models
                            : "--"}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className=" font-light">Action type</p>
                        <p className=" font-medium">
                          {asset?.action_type && asset?.action_type.length > 0
                            ? asset?.action_type
                            : "--"}
                        </p>
                      </div>
                    </section>
                    <section className="grid w-full  text-xs md:text-base">
                      <div className="">
                        <p className=" font-light">Description</p>
                        <p className=" font-medium">
                          {asset?.description && asset?.description.length > 0
                            ? asset?.description
                            : "--"}
                        </p>
                      </div>{" "}
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default AssetRecordsAccordion
