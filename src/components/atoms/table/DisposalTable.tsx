/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import { disposalColumn } from "../../../lib/table";
import { getPropertyDisposal } from "../../../lib/functions"
import { DisposeType } from "../../../types/generic";
import Modal from "../../headless/modal/modal";
import { DisposeDetailsModal, DisposeEdit } from "../../transaction/Disposal/Modal";

const DisposalTable = (props: {
    // checkboxes: number[]
    // setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
    filterBy: string[]
    rows: DisposeType[]
    columns: ColumnType[]
    // status: string
}) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [details, setDetails] = useState<DisposeType>(null)

    const { minimize } = useMinimizeStore()

    // const selectAllCheckboxes = () => {
    //     if (props.checkboxes.length === 0) {
    //         props.setCheckboxes([-1])
    //     } else {
    //         props.setCheckboxes([])
    //     }
    // }

    // const toggleCheckbox = async (id: number) => {
    //     if (props.checkboxes.includes(id)) {
    //         // removes id if not selected
    //         props.setCheckboxes((prev) => prev.filter((e) => e !== id))
    //         return
    //     }
    //     // adds id
    //     props.setCheckboxes((prev) => [...prev, id])
    // }

    return (
        <div
            className={`max-w-[88vw] overflow-x-auto ${minimize ? "xl:w-[86vw]" : "xl:w-full"
                } relative border shadow-md sm:rounded-lg`}
        >
            {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
                    <tr>
                        <th scope="col" className="py-1">
                            <div className="flex items-center justify-center">
                                {/* <Checkbox
                                    color={"orange"}
                                    onChange={() => {
                                        selectAllCheckboxes()
                                    }}
                                    checked={props.checkboxes.length > 0 ? true : false}
                                    classNames={{
                                        input:
                                            "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                                    }}
                                /> */}
                            </div>
                        </th>
                        {props.columns.filter((col) => props.filterBy.includes(col.value))
                            .map((col) => (
                                <th
                                    key={col.name}
                                    scope="col"
                                    className="max-w-[10rem] truncate px-6 py-4 duration-150"
                                >
                                    {col.name}
                                </th>
                            ))}

                        {/* <th scope="col" className="p-4 text-center">
                            Action
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, idx) => (
                        <tr
                            key={row?.id ?? idx}
                            className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                        >
                            <td className="w-4 p-2">
                                <div className="flex items-center justify-center">
                                    {/* <Checkbox
                                        value={row?.id ?? idx}
                                        color={"orange"}
                                        onChange={(e) => {
                                            toggleCheckbox(Number(e.target.value))
                                        }}
                                        checked={
                                            props.checkboxes.includes(row?.id ?? idx) ||
                                            props.checkboxes.includes(-1)
                                        }
                                        classNames={{
                                            input:
                                                "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                                        }}
                                    /> */}
                                </div>
                            </td>
                            {disposalColumn
                                .filter((col) => props.filterBy.includes(col.value))
                                .map((col) => (
                                    <td
                                        key={col.value}
                                        className="max-w-[10rem] cursor-pointer truncate py-2 px-6"
                                        onClick={() => {
                                            setIsVisible(true)
                                            setDetails(row)
                                        }}
                                    >
                                        {
                                            getPropertyDisposal(col.value, row)
                                        }
                                    </td>
                                ))}
                            {/* <td className="max-w-[10rem] justify-center">
                                <div className="flex flex-row justify-center"><SquareCheck color="green" /><SquareX color="red" /></div>

                                <i className="fa-light fa-trash-can text-red-500" />{" "}
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal title="Dispose"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                className="max-w-4xl">
                <DisposeDetailsModal asset={details as DisposeType} setCloseModal={setIsVisible} />
            </Modal>
        </div>
    )
}

export default DisposalTable

