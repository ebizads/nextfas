
import React from "react"
import { Popover } from "@mantine/core"

const AddVendorPopOver = (props: {
    openPopover: boolean
    setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>
    setAddSingleRecord: React.Dispatch<React.SetStateAction<boolean>>
    setAddBulkRecord: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <Popover
            opened={props.openPopover}
            onClose={() => props.setOpenPopover(false)}
            trapFocus={false}
            position="bottom"
            zIndex={20}
            classNames={{
                dropdown: "p-0 w-80 rounded-md shadow-lg",
            }}
        >
            <Popover.Target>

                <button
                    onClick={() => {
                        props.setOpenPopover(!props.openPopover)
                    }}
                    className="-md flex gap-2 border-2 border-tangerine-500 py-2 px-4 text-center text-xs rounded-md font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none"
                >
                    <i className="fa-regular fa-plus text-xs" />
                    Add New
                </button>
            </Popover.Target>{" "}
            <Popover.Dropdown>
                <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
                <div className="flex flex-col text-sm">
                    <button onClick={() => { props.setAddSingleRecord(true) }} className="px-6 py-2 hover:bg-tangerine-100">Add single record</button>
                    <button onClick={() => { props.setAddBulkRecord(true) }} className="px-6 py-2 hover:bg-tangerine-100">Add bulk record</button>
                </div>
            </Popover.Dropdown>
        </Popover>
    )
}

export default AddVendorPopOver
