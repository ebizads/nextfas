/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { Checkbox } from "@mantine/core"
import { disposalColumn, issuanceColumn } from "../../../lib/table";
import { getPropertyDisposal, getPropertyIssuance } from "../../../lib/functions"
import { DisposeType, IssuanceType } from "../../../types/generic";
import Modal from "../../headless/modal/modal";
import { IssuanceDetailsModal } from "../../transaction/Issuance/Modal";
const IssuanceTable = (props: {
    // checkboxes: number[]
    // setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
    filterBy: string[]
    rows: IssuanceType[]
    columns: ColumnType[]
    // status: string
}) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [details, setDetails] = useState<IssuanceType>(null)

    const { minimize } = useMinimizeStore()


    return (
        <div
            className={`max-w-[88vw] overflow-x-auto ${minimize ? "xl:w-[86vw]" : "xl:w-full"
                } relative border shadow-md sm:rounded-lg`}
        >
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
                    <tr>
                        <th scope="col" className="py-1">
                            <div className="flex items-center justify-center">

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

                                </div>
                            </td>
                            {issuanceColumn
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
                                            getPropertyIssuance(col.value, row)
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

            <Modal title="Issuance"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                className="max-w-4xl">
                <IssuanceDetailsModal asset={details as IssuanceType} setCloseModal={setIsVisible} />
            </Modal>
        </div>
    )
}

export default IssuanceTable

