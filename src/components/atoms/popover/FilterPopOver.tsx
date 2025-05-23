import React from "react"
import { Popover, Checkbox } from "@mantine/core"
import { ColumnType } from "../../../types/table"

const FilterPopOver = (props: {
  openPopover: boolean
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>
  filterBy: string[]
  setFilterBy: React.Dispatch<React.SetStateAction<string[]>>
  columns: ColumnType[]
}) => {
  return (
    <Popover
      opened={props.openPopover}
      onClose={() => props.setOpenPopover(false)}
      trapFocus={false}
      position="bottom"
      zIndex={20}
      classNames={{
        dropdown: "p-0 w-96 rounded-md shadow-lg",
      }}
    >
      <Popover.Target>
        <button
          onClick={() => {
            props.setOpenPopover(!props.openPopover)
          }}
          className="flex gap-2 border-2 border-tangerine-500 bg-tangerine-500 py-2 px-4 text-xs rounded-md font-medium text-white outline-none hover:bg-tangerine-600 hover:border-tangerine-600 focus:outline-none items-center"
        >
          <i className="fa-regular fa-bars-filter text-xs text-white" />
        </button>
      </Popover.Target>

      <Popover.Dropdown>
        <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
        <div className="px-6 py-4">
          <Checkbox.Group
            orientation="vertical"
            description="Filter by"
            value={props.filterBy}
            onChange={props.setFilterBy}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {props.columns.map((col) => (
                <Checkbox
                  color="orange"
                  key={col.name}
                  disabled={
                    props.filterBy.length === 1 &&
                    props.filterBy.includes(col.value)
                  }
                  value={col.value}
                  label={col.name}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                    label: "truncate",
                  }}
                />
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

export default FilterPopOver
