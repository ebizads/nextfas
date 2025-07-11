import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic"
import TypeSelect from "../components/atoms/select/TypeSelect"
import { Select } from "@mantine/core"
import { procedureTypes } from "@trpc/server";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
})

const Scanner = () => {

    const [data, setData] = useState<string | null>(null);
    const [success, setSuccess] = useState("")
    const [scanMode, setScanMode] = useState("")

    const { data: asset, refetch, isLoading, isFetching, isSuccess, isError } = trpc.asset.findOneWithBarcode.useQuery(data ?? "", { enabled: false })

    const { mutate: changeStatusScanned, isLoading: isStatusChanging, error } = trpc.asset.changeStatusScanned.useMutation({
        onSuccess() {
            setSuccess("status successfully changed")
            refetch()
            const timeout = setTimeout(() => {
                setSuccess(""); // Clear message after 3 seconds
            }, 3000);

            return () => clearTimeout(timeout); // cleanup on unmount or re-render
            // setData(null)
        },
        onError(error) {
            console.error("Error changing status", error)
        }
    })

    useEffect(() => {
        console.log(isLoading)
        console.log(isFetching)

    }, [])

    useEffect(() => {
        if (data) {
            refetch();
            console.log(data)
            console.log(asset)
        }
    }, [data, refetch])

    return (
        <main className="w-full h-full flex flex-col justify-center items-center p-5" >
            <div className="flex flex-col gap-5 w-full h-full sm:w-auto">
                {/* Scan mode select */}
                <section className="w-full">
                    <p>Scan Mode:</p>
                    <Select
                        value={scanMode}
                        data={["camera", "barcode", "rfid"]}
                        onChange={(q) => {
                            if (q) {
                                setData(null)
                                setScanMode(q)
                            }
                        }}
                        placeholder={"Select A Scan Mode"}
                    >
                    </Select>
                    {scanMode == "camera" &&
                        <CameraScan
                            barcodeData={data}
                            setBarcodeData={setData}
                        ></CameraScan>
                    }
                    {scanMode == "barcode" &&
                        <BarcodeScan
                            barcodeData={data}
                            setBarcodeData={setData}
                        ></BarcodeScan>
                    }
                    {scanMode == "rfid" &&
                        <RFIDScan
                            rfidData={data}
                            setRFIDData={setData}
                        ></RFIDScan>
                    }
                </section >
                {scanMode != "" &&
                    <AssetDetails
                        isLoading={isLoading}
                        isFetching={isFetching}
                        asset={asset}
                    ></AssetDetails>
                }
                {/* Status Buttons */}
                {asset &&
                    <section className="w-full z-50">
                        <nav className="relative my-2 flex flex-1 gap-2 ">
                            <button onClick={() => {
                                changeStatusScanned({
                                    id: asset?.id ?? -9999,
                                    serial_no: data || "",
                                    status: "in"
                                })
                            }}>
                                <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                                    <i className={"fa-solid fa-hand-holding-box"} />
                                    In
                                </div>
                            </button>
                            <button onClick={() => {
                                changeStatusScanned({
                                    id: asset?.id ?? -9999,
                                    serial_no: data || "",
                                    status: "issued"
                                })
                            }}>
                                <div className="flex cursor-pointer items-center gap-2 rounded-md bg-[#dee1e6] py-2 px-3 text-start text-sm outline-none hover:bg-slate-200 focus:outline-none xl:text-base">
                                    <i className={"fa-solid fa-arrow-right-arrow-left"} />
                                    Issue
                                </div>
                            </button>
                        </nav>
                        <p className="text-green-500 italic">{success}</p>
                    </section>
                }
            </div>
        </main>
    );
}

export default Scanner;

const CameraScan = (props: {
    barcodeData: string | null,
    setBarcodeData: React.Dispatch<React.SetStateAction<string | null>>
}) => {
    const [facingMode, selectFacingMode] = useState<"user" | "environment" | undefined>();

    return (
        <>
            <div className="border-2 border-black w-[500px] h-[500px]">
                <BarcodeScanner
                    onUpdate={(err, result) => {
                        if (result) props.setBarcodeData(result.getText());
                    }}
                    width={500}
                    height={500}
                    facingMode={facingMode} // 👈 Use back camera
                    videoConstraints={{
                        facingMode: { exact: facingMode }
                    }}
                />
            </div >
            <div>
                <Select
                    value={facingMode}
                    data={["environment", "user"]}
                    onChange={(q) => {
                        if (q === "user" || q === "environment") {
                            selectFacingMode(q);
                        }
                    }}
                >
                </Select>
            </div>
        </>
    )
}

const BarcodeScan = (
    props: {
        barcodeData: string | null,
        setBarcodeData: React.Dispatch<React.SetStateAction<string | null>>
    }
) => {
    const [scannedValue, setScannedValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log("AAAAAAAAAA")
        const handlePaste = (e: ClipboardEvent) => {
            const pastedText = e.clipboardData?.getData("text") || "";

            // Trim the first character
            const trimmed = pastedText.slice(1);

            props.setBarcodeData(trimmed);
            e.preventDefault();
            if (inputRef.current) inputRef.current.value = "";
        };

        const input = inputRef.current;
        input?.addEventListener("paste", handlePaste);

        // Always refocus to accept paste
        input?.focus();

        return () => {
            input?.removeEventListener("paste", handlePaste);
        };
    }, []);

    return (
        <div className="flex flex-col justfiy-center p-2">
            <input
                ref={inputRef}
                autoFocus
                type="text"
                onBlur={() => inputRef.current?.focus()}
                readOnly={true}
                style={{
                    opacity: 0,
                    left: -999,
                    position: "absolute"
                }}
            />
            {props.barcodeData == null &&
                <p className="text-center text-sm italic">Scan with your provided Barcode scanner</p>
            }
            <p className="text-center">{props.barcodeData}</p>
        </div>
    );
}

const RFIDScan = (
    props: {
        rfidData: string | null;
        setRFIDData: React.Dispatch<React.SetStateAction<string | null>>;
    }) => {
    const [scannedValue, setScannedValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // RFID scan complete — transform & pass up
            props.setRFIDData(scannedValue);
            setScannedValue(""); // reset for next scan
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScannedValue(e.target.value);
    };

    return (
        <div className="flex flex-col justify-center p-2">
            <input
                ref={inputRef}
                autoFocus
                type="text"
                value={scannedValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => inputRef.current?.focus()}
                style={{
                    opacity: 0,
                    position: "absolute",
                    left: -999,
                }}
            />

            {props.rfidData == null &&
                <p className="text-center text-sm italic">Scan with your provided RFID scanner</p>
            }
            <p className="text-center">{props.rfidData}</p>
        </div>
    );
};


const AssetDetails = (
    props: {
        isLoading: boolean,
        isFetching: boolean,
        asset: any,
    }
) => {
    return (
        <section className="pb-4 w-full h-full flex justify-center items-center">
            {props.isFetching ? (
                <p>Loading asset...</p>
            ) : props.asset ? (
                <div>
                    <p className="flex gap-2 items-center text-base font-medium text-neutral-600">
                        <span>
                            Asset Information
                        </span>

                        <span className="w-20 px-2 py-1 border-2 rounded-xl  text-center bg-gray-300 border-gray-300">
                            {
                                props.asset?.status.toUpperCase()
                            }
                        </span>
                    </p>
                    <div className="mt-4 flex flex-col gap-4 text-sm">
                        <section className="grid grid-cols-3 gap-5">
                            <div className="col-span-1">
                                <p className="font-light">Asset ID</p>
                                <p className="font-medium">{
                                    props.asset?.number}</p>
                            </div>
                            <div className="col-span-1">
                                <p className="font-light">Name</p>
                                <p className="font-medium">{
                                    props.asset?.name}</p>
                            </div>
                            <div className="col-span-1">
                                <p className="font-light">RFID/ Barcode ID</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.barcode !== ""
                                            ?
                                            props.asset?.barcode
                                            : "--"
                                    }
                                </p>
                            </div>
                        </section>
                        <section className="grid grid-cols-3 gap-5">
                            <div className="col-span-1">
                                <p className="font-light">Firearm Serial No.</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.serial_no !== ""
                                            ?
                                            props.asset?.serial_no
                                            : "--"
                                    }
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="font-light">Brand</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.brand !== ""
                                            ?
                                            props.asset?.brand
                                            : "--"
                                    }
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="font-light">Model</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.models !== ""
                                            ?
                                            props.asset?.models
                                            : "--"
                                    }
                                </p>
                            </div>
                        </section>
                        <section className="grid grid-cols-3 gap-5">
                            <div className="col-span-1">
                                <p className="font-light">Type</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.type?.name
                                            ?
                                            props.asset?.type?.name
                                            : "--"
                                    }
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="font-light">Caliber</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.caliber ?? "--"
                                    }
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="font-light">Action Type</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.actionType?.name ?? "--"
                                    }
                                </p>
                            </div>
                        </section>
                        <section className="grid grid-cols-3">
                            <div className="col-span-3">
                                <p className="font-light">Description</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.description ?? "--"
                                    }
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                <p>No asset found.</p>
            )}
        </section>)
}
