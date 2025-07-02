import { useState } from "react";
import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic"

const BarcodeScanner = dynamic(
    () => import("react-qr-barcode-scanner"),
    { ssr: false }
)

const Scanner = () => {
    const [data, setData] = useState("Not Found");

    const { mutate: changeStatus, isLoading, error } = trpc.asset.changeStatus.useMutation({
        onSuccess() {
            console.log("status successfully changed");
        },
        onError(error) {
            console.error("Error changing status", error)
        }
    })

    return (
        <>
            <div className="border-2 border-black w-[500px] h-[500px]">
                <BarcodeScanner
                    onUpdate={(err, result) => {
                        if (result) setData(result.text);
                        else setData("Not Found");
                    }}
                    width={500}
                    height={500}
                    facingMode="environment" // 👈 Use back camera
                    videoConstraints={{
                        facingMode: { exact: "environment" }
                    }}
                />
            </div>
            <nav className="relative my-2 flex flex-1 gap-2 ">
                <button onClick={() => {
                }}>
                    <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                        <i className={"fa-solid fa-hand-holding-box"} />
                        In
                    </div>
                </button>

                {/* //TODO:  Fix this when we have Asset Issuance READY */}

                <button onClick={() => {
                }}>
                    <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                        <i className={"fa-solid fa-arrow-right-arrow-left"} />
                        Out
                    </div>
                </button>



                <button onClick={() => {
                }}>
                    <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                        <i className={"fa-solid fa-arrow-right-arrow-left"} />
                        Issue
                    </div>
                </button>

            </nav>
            < p > {data} </p>
        </>
    );
}

export default Scanner;