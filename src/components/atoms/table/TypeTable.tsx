import React, { useState, useEffect } from "react"
import { Checkbox } from "@mantine/core"
import Modal from "../../headless/modal/modal"
import { useMinimizeStore } from "../../../store/useStore"
import { ColumnType } from "../../../types/table"
import { trpc } from "../../../utils/trpc"

type Type = {
    id: number
    name: string
    description: string | null
}

const TypeTable = ({
    checkboxes,
    setCheckboxes,
    rows,
    filterBy,
    columns,
}: {
    checkboxes: number[]
    setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>
    rows: Type[]
    filterBy: string[];
    columns: ColumnType[];
}) => {
    const { minimize } = useMinimizeStore()
    // const [selectedAction, setSelectedAction] = useState<Type | null>(null)
    const [selectedType, setSelectedType] = useState<Type | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
    })
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const utils = trpc.useContext();
    const updateMutation = trpc.assetType.update.useMutation({
        onSuccess: () => {
            utils.assetType.findAll.invalidate(); // Correct invalidation
        },
    });

    //Initialize form when type is selected
    useEffect(() => {
        if (selectedType) {
            setEditForm({
                name: selectedType.name || "",
                description: selectedType.description || "",
            })
        }
    }, [selectedType])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        if (!selectedType) return

        setIsSaving(true)
        setError(null)

        try {
            await updateMutation.mutateAsync({
                id: selectedType.id,
                name: editForm.name,
                description: editForm.description
            });

            setIsEditing(false)
            setIsVisible(false)
        } catch (err) {
            setError('Failed to update type')
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

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
                                        input: "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
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
                                        checked={checkboxes.includes(row.id) || checkboxes.includes(-1)}
                                        classNames={{
                                            input: "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                                        }}
                                    />
                                </div>
                            </td>
                            {columns.map((column) => {
                                const cellValue = row[column.value as keyof typeof row];
                                return (
                                    <td
                                        key={column.value}
                                        className="cursor-pointer px-6 py-2"
                                        onClick={() => {
                                            setSelectedType(row);
                                            setIsVisible(true);
                                        }}
                                    >
                                        {cellValue ?? '—'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedType && (
                <Modal
                    title={isEditing ? "Edit Type" : "Type Details"}
                    isVisible={isVisible}
                    setIsVisible={(visible) => {
                        if (!visible) {
                            setIsEditing(false)
                            setError(null)
                        }
                        setIsVisible(visible)
                    }}
                    className="max-w-md"
                >
                    <div className="space-y-4 p-4">
                        {/* ID - Always read-only */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">ID</label>
                            <div className="mt-1 text-sm text-gray-900">{selectedType.id}</div>
                        </div>

                        {!isEditing ? (
                            <>
                                {/* View Mode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Name</label>
                                    <div className="mt-1 text-sm text-gray-900">{selectedType.name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Description</label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {selectedType.description || '—'}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-tangerine-500 text-white rounded-md"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Edit Mode */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={editForm.name}
                                        onChange={handleInputChange}
                                        placeholder={selectedType.name} // Show original value as placeholder
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tangerine-500 focus:ring-tangerine-500"
                                    />
                                    {editForm.name === selectedType.name && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Original: {selectedType.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={editForm.description}
                                        onChange={handleInputChange}
                                        placeholder={selectedType.description || "No description"} // Show original value as placeholder
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tangerine-500 focus:ring-tangerine-500"
                                    />
                                    {editForm.description === selectedType.description && selectedType.description && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Original: {selectedType.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-tangerine-500 text-white rounded-md"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}

        </div>
    )
}

export default TypeTable