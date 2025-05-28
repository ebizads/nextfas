import React, { useState } from "react"
import { Checkbox } from "@mantine/core"
import Modal from "../../headless/modal/modal"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"

type ActionType = {
  id: number
  name: string
  description: string | null
}

const ActionTypeTable = ({
  checkboxes,
  setCheckboxes,
  rows,
}: {
  checkboxes: number[]
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
  rows: ActionType[]
  filterBy: string[]; // ← Add this
  columns: ColumnType[];
}) => {
  const { minimize } = useMinimizeStore()
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [isVisible, setIsVisible] = useState(false)

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
    <div
      className="relative border shadow-md sm:rounded-full"
    >
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rounded-full">
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
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Description</th>
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
                    checked={checkboxes.includes(row.id) || checkboxes.includes(-1)}
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                    }}
                  />
                </div>
              </td>
              <td
                className="cursor-pointer px-6 py-2"
                onClick={() => {
                  setSelectedAction(row)
                  setIsVisible(true)
                }}
              >
                {row.id}
              </td>
              <td
                className="cursor-pointer px-6 py-2"
                onClick={() => {
                  setSelectedAction(row)
                  setIsVisible(true)
                }}
              >
                {row.name}
              </td>
              <td
                className="cursor-pointer px-6 py-2"
                onClick={() => {
                  setSelectedAction(row)
                  setIsVisible(true)
                }}
              >
                {row.description ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to view action details */}
      {selectedAction && (
        <Modal
          title="Action Type Details"
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          className="max-w-md"
        >
          <div className="space-y-3">
            <p><strong>ID:</strong> {selectedAction.id}</p>
            <p><strong>Name:</strong> {selectedAction.name}</p>
            <p><strong>Description:</strong> {selectedAction.description ?? '—'}</p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ActionTypeTable
