import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";

const AssetModal = (props: {
    isLoading: boolean,
    isFetching: boolean,
    asset: any,
    isOpen: boolean,
    onClose: () => void,
    refetch: () => Promise<{ data?: any }>
}) => {
    const [success, setSuccess] = useState("")
    const [isAnimating, setIsAnimating] = useState(false);

    const { mutate: changeStatusScanned, isLoading: isStatusChanging, error } = trpc.asset.changeStatusScanned.useMutation({
        onSuccess() {
            setSuccess("status successfully changed")
            props.refetch()
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
        if (props.isOpen) {
            setIsAnimating(true);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal closes
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [props.isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        // Delay the actual close to allow exit animation
        setTimeout(() => {
            props.onClose();
        }, 300);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <section
            className={`h-full justify-center fixed inset-0 z-50 flex items-end transition-all duration-300 
        ${isAnimating ? 'bg-black bg-opacity-50' : 'bg-transparent'}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`w-full max-w-md bg-white rounded-t-2xl shadow-2xl transform transition-all duration-300 ease-out py-7 px-5
                ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {props.asset ? (<>
                    <p className="flex gap-2 items-center justify-center text-xl font-bold text-center w-full">
                        {props.asset?.name}
                        <span className={`w-fit px-1 py-0 rounded-md text-center font-normal ${props.asset?.status == "in"
                            ? 'border-[0.75px] border-green-500 bg-green-200 text-green-700'
                            : 'bg-gray-200 '} text-xs`}>
                            {
                                props.asset?.status.toUpperCase()
                            }
                        </span>
                    </p>
                    <div className="mt-4 flex flex-col gap-4 text-sm border border-gray-300 rounded-md p-2">
                        <span className="text-sm md:text-base font-medium text-neutral-600">
                            <i className="fa-solid fa-box mr-2"></i>
                            Asset Information
                        </span>
                        <section className="grid grid-cols-2 gap-5 text-xs md:text-base">
                            <div className="col-span-1">
                                <p className="font-light">Asset ID</p>
                                <p className="font-medium">{
                                    props.asset?.number}</p>
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
                        <hr></hr>
                        <section className="grid grid-cols-2 gap-5 text-xs md:text-base">
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

                        <section className="grid grid-cols-2 gap-5 text-xs md:text-base">
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
                        </section>
                        <section className="grid grid-cols-2 gap-5 text-xs md:text-base">
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
                        <hr></hr>
                        <section className="grid grid-cols-2 text-xs md:text-base">
                            <div className="col-span-2">
                                <p className="font-light">Description</p>
                                <p className="font-medium">
                                    {
                                        props.asset?.description ?? "--"
                                    }
                                </p>
                            </div>
                        </section>
                    </div>
                    <p>{success}</p>
                    <div className="w-full flex justify-center mt-3">
                        {props.asset?.status != "issued" &&
                            <button className={`w-[50%] h-12 bg-gray-200 rounded-lg`}
                                onClick={() => {
                                    changeStatusScanned({
                                        id: props.asset?.id ?? -9999,
                                        serial_no: props.asset?.number || "",
                                        status: "issued"
                                    })
                                }
                                }
                            > Issue</button>
                        }
                    </div>
                </>) : <>No asset found</>}
            </div >
        </section >
    )
}

export default AssetModal