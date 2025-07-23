import React from "react"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { HistoryLogType } from "../../../types/generic"
import { historyLogColumns } from "../../../lib/table"
import { getProperty } from "../../../lib/functions"

const HistoryLogsTable = (props: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  rows: HistoryLogType[]
  columns: ColumnType[]
  showCheckboxes?: boolean
  refetch: () => Promise<{ data?: any }>
}) => {
  //minimize screen toggle
  const { minimize } = useMinimizeStore()

  return (
    <div
      className={`max-h-[62vh] max-w-[90vw] overflow-x-auto ${
        minimize ? "xl:w-[88vw]" : "xl:w-full"
      } relative border shadow-md sm:rounded-lg`}
    >
      {/* <pre>{JSON.stringify(props.rows, null, 2)}</pre> */}
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
          <tr>
            {props.columns.map((col) => (
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
          {props.rows
            .sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0))
            .map((row, idx) => (
              <tr
                key={row?.id ?? idx}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                {historyLogColumns.map((col) => (
                  <td
                    key={col.value}
                    className={`max-w-[10rem] truncate py-2 px-6 ${
                      col.value == "action" && "capitalize"
                    }`}
                  >
                    {col.value == "typeId"
                      ? row?.asset?.type?.name
                      : getProperty(col.value, row)}
                  </td>
                ))}
                {/* <td className="max-w-[10rem] space-x-2 text-center">
                <Link href={"/assets/update"} onClick={() => {
                  setSelectedAsset(row)
                }}>
                  <i className="fa-light fa-pen-to-square" />
                </Link>
                <button
                  onClick={() => {
                    setOpenModalDel(true)
                    props.setCheckboxes([row?.id ?? idx])
                  }}
                >
                  <i className="fa-light fa-trash-can text-red-500" />
                </button>
              </td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryLogsTable
