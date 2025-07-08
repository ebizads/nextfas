import React, { useState, useEffect } from "react"
import { Checkbox } from "@mantine/core"
import Modal from "../../headless/modal/modal"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { trpc } from "../../../utils/trpc"

type ActionType = {
  id: number
  name: string
  description: string | null
}

const ActionTypeTable = ({
  checkboxes,
  setCheckboxes,
  rows,
  filterBy,
  columns,
  setSelectedActionType,
}: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  rows: ActionType[]
  filterBy: string[] // ← Add this
  columns: ColumnType[]
  setSelectedActionType: React.Dispatch<React.SetStateAction<ActionType>>
}) => {
  const selectAllCheckboxes = () => {
    if (checkboxes.length === 0) {
      setCheckboxes([-1])
    } else {
      setCheckboxes([])
    }
  }

  const toggleCheckbox = (id: number) => {
    if (checkboxes.includes(id)) {
      setCheckboxes((prev) => prev.filter((e) => e !== id))
    } else {
      setCheckboxes((prev) => [...prev, id])
    }
  }

  return (
    <div className="relative border shadow-md sm:rounded-full">
      <table className="w-full rounded-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 text-xs uppercase text-neutral-50">
          <tr>
            <th className="py-1">
              <div className="flex items-center justify-center">
                <Checkbox
                  color="orange"
                  onChange={selectAllCheckboxes}
                  checked={checkboxes.length > 0}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                  }}
                />
              </div>
            </th>
            {columns.map((column) => (
              <th key={column.value} className="px-6 py-4">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-2">
                <div className="flex items-center justify-center">
                  <Checkbox
                    value={row.id}
                    color="orange"
                    onChange={() => toggleCheckbox(row.id)}
                    checked={
                      checkboxes.includes(row.id) || checkboxes.includes(-1)
                    }
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                    }}
                  />
                </div>
              </td>
              {columns.map((column) => {
                const cellValue = row[column.value as keyof typeof row]
                return (
                  <td
                    key={`${row.id}-${column.value}`}
                    className="cursor-pointer px-6 py-2"
                    onClick={() => {
                      setSelectedActionType(row)
                    }}
                  >
                    {cellValue
                      ? cellValue.toString().length > 0
                        ? cellValue
                        : "--"
                      : "--"}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActionTypeTable
