import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import dynamic from "next/dynamic"
import TypeSelect from "../../components/atoms/select/TypeSelect"
import { Select } from "@mantine/core"
import { procedureTypes } from "@trpc/server";
import { useRouter } from "next/router";
import AssetModal from "../../components/scan/AssetModal";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
    ssr: false,
})


const Scanner = () => {
    const router = useRouter();
    const [data, setData] = useState<string | null>(null);
    const [scanMode, setScanMode] = useState("")
    const [selectedScanMode, setSelectedScanMode] = useState("")
    const [isAssetsModalOpen, setIsAssetsModalOpen] = useState<boolean>(false)

    const scanModeTitle = (selectedScanMode: string) => {
        switch (selectedScanMode) {
            case "camera":
                return "Camera"
                break;
            case "barcode":
                return "Barcode"
                break;
            case "rfid":
                return "RFID"
                break;
            default:
                return "scan"
        }
    };

    const { data: asset, refetch, isLoading, isFetching, isSuccess, isError } = trpc.asset.findOneWithBarcode.useQuery(data ?? "",
        {
            enabled: false,
            onSuccess: (data) => {
                setIsAssetsModalOpen(true)
                console.log('Query successful:', data);
            }
        })

    useEffect(() => {
        if (data) {
            refetch();
            console.log(data)
            console.log(asset)
        }
    }, [data, refetch])

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-16 bg-tangerine-50 z-50 shadow-lg p-5">
                <button
                    className=""
                    onClick={() => {
                        if (scanMode == "" || scanMode == null) { router.back() }
                        else { setScanMode("") }
                    }}
                >
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>
            </nav>
            <main className="w-full h-full flex flex-col justify-center items-center p-5 mt-[60px]" >
                <div className="flex flex-col gap-5 w-full h-full sm:w-auto">
                    {/* Scan mode select */}
                    <section className="w-full">
                        {scanMode == "" &&
                            <div className="w-full flex flex-col p-5 gap-5">
                                <div className="w-full text-center flex flex-col justify-center gap-2">
                                    <h1 className="font-bold text-xl">Choose Scan Mode</h1>
                                    <p className="max-w-[300px] text-center text-sm text-tangerine-500 mx-auto">Select the type of scanning you want to perform to get started</p>
                                </div>
                                <div className="w-full flex flex-col items-center  gap-3 ">
                                    <ScanCard
                                        icon={"fa-solid fa-camera"}
                                        title={"Camera Scan"}
                                        description={"Capture images and documents using your device camera"}
                                        setScanMode={setSelectedScanMode}
                                        selectedScanMode={selectedScanMode}
                                        scanMode={"camera"}
                                    ></ScanCard>
                                    <ScanCard
                                        icon={"fa-solid fa-barcode"}
                                        title={"Barcode Scan"}
                                        description={"Scan barcodes for quick data capture"}
                                        setScanMode={setSelectedScanMode}
                                        selectedScanMode={selectedScanMode}
                                        scanMode={"barcode"}
                                    ></ScanCard>
                                    <ScanCard
                                        icon={"fa-solid fa-microchip"}
                                        title={"RFID Scan"}
                                        description={"Read RFID tags"}
                                        setScanMode={setSelectedScanMode}
                                        selectedScanMode={selectedScanMode}
                                        scanMode={"rfid"}
                                    ></ScanCard>
                                </div>
                                <button
                                    disabled={selectedScanMode == ""}
                                    onClick={() => {
                                        setScanMode(selectedScanMode)
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth", // for animated scroll
                                        });
                                    }}
                                    className={`w-full bg-gray-00 p-4 mt-7 shadow-lg fixed bottom-0 left-0 right-0 
                                   ${selectedScanMode === ""
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-tangerine-500 text-white hover:bg-tangerine-600"}`}>
                                    {selectedScanMode != "" && <i className="fa-solid fa-expand mr-2"></i>}
                                    {selectedScanMode != "" ? `Start ${scanModeTitle(selectedScanMode)} Scan` : "Select Scan Mode"}
                                </button>
                            </div>
                        }
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
                        {data &&
                            <AssetModal
                                isOpen={isAssetsModalOpen}
                                onClose={() => {
                                    setIsAssetsModalOpen(false)
                                    setData(null)
                                }}
                                isLoading={isLoading}
                                isFetching={isFetching}
                                asset={asset}
                                refetch={refetch}
                            ></AssetModal>
                        }
                    </section >

                </div>
            </main>
        </>
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
            props.setBarcodeData(null);
            const pastedText = e.clipboardData?.getData("text") || "";

            // Trim the first character
            const trimmed = pastedText.slice(1);
            console.log(pastedText)

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
            <h1 className="font-bold text-2xl">Scan Barcode</h1>
            <p className="text-sm">Scan with your provided Barcode scanner</p>

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

const ScanCard = (
    props: {
        icon: string,
        title: string,
        description?: string,
        setScanMode: React.Dispatch<React.SetStateAction<string>>;
        scanMode: string,
        selectedScanMode: string
    }
) => {
    return (
        <div
            onClick={() => {
                console.log(props.scanMode)
                if (props.selectedScanMode == props.scanMode) {
                    props.setScanMode(""); // or null, depending on how you "remove" it
                } else {
                    props.setScanMode(props.scanMode);
                }
            }}
            className={`w-[250px] h-44 bg-white shadow-md py-7 px-5 flex flex-col justify-center items-center text-center gap-2 cursor-pointer
            ${props.selectedScanMode == props.scanMode && 'border-2 border-tangerine-500'}
        `}>
            <div className={` ${props.selectedScanMode == props.scanMode ? 'bg-tangerine-500 ' : 'bg-[#F7F2C5]'} w-fit py-2 px-3 rounded-lg`}>
                <i className={`${props.selectedScanMode == props.scanMode ? " text-white" : ""} ${props.icon} fa-lg `}></i>
            </div>
            <h2 className={"font-bold"}>{props.title}</h2>
            <p className="text-xs text-gray-500">{props.description}</p>
        </div>
    )
}

