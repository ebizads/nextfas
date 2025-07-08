import { useState } from "react"
import { trpc } from "../utils/trpc"
import dynamic from "next/dynamic"
import TypeSelect from "../components/atoms/select/TypeSelect"
import { Select } from "@mantine/core"

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
})

const Scanner = () => {
  const [data, setData] = useState("")
  const [success, setSuccess] = useState("")
  const [facingMode, selectFacingMode] = useState("")

  const {
    mutate: changeStatus,
    isLoading,
    error,
  } = trpc.asset.changeStatusScanned.useMutation({
    onSuccess() {
      setSuccess("status successfully changed")
      console.log("status successfully changed")
      setData("")
    },
    onError(error) {
      console.error("Error changing status", error)
    },
  })

  return (
    <>
      {/* <section>
        <div className="h-[500px] w-[500px] border-2 border-black">
          <BarcodeScanner
            onUpdate={(err, result) => {
              if (result) setData(result.text)
            }}
            width={500}
            height={500}
            facingMode={facingMode} // 👈 Use back camera
            videoConstraints={{
              facingMode: { exact: facingMode },
            }}
            classNames={{
              input:
                "h-11 rounded-md border-2 border-gray-400 outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2",
              item: "selected-item:bg-tangerine-400 "
            }}
          />
        </div>
      </section> */}
      <section className="z-50 w-[500px]">
        <div>
          <Select
            value={facingMode}
            data={["environment", "user"]}
            onChange={(q) => {
              if (q) {
                selectFacingMode(q)
              }
            }}
          ></Select>
        </div>
        <nav className="relative my-2 flex flex-1 gap-2 ">
          <button
            onClick={() => {
              changeStatus({
                serial_no: data,
                status: "in",
              })
            }}
          >
            <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
              <i className={"fa-solid fa-hand-holding-box"} />
              In
            </div>
          </button>
          {/* //TODO:  Fix this when we have Asset Issuance READY */}
          <button
            onClick={() => {
              changeStatus({
                serial_no: data,
                status: "out",
              })
            }}
          >
            <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
              <i className={"fa-solid fa-arrow-right-arrow-left"} />
              Out
            </div>
          </button>
          <button
            onClick={() => {
              changeStatus({
                serial_no: data,
                status: "issued",
              })
            }}
          >
            <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
              <i className={"fa-solid fa-arrow-right-arrow-left"} />
              Issue
            </div>
          </button>
        </nav>
        <p> {data ? data : "No Data Scanned"} </p>
        <p className="italic text-green-500">{success}</p>
      </section>
    </>
  )
}

export default Scanner
