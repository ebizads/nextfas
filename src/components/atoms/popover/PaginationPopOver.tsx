import React from "react"
import { Popover } from "@mantine/core"
import { showAssetsBy } from "../../../lib/table"

const PaginationPopOver = (props: {
  paginationPopover: boolean
  setPaginationPopover: React.Dispatch<React.SetStateAction<boolean>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
}) => {
  return (
    <Popover
      opened={props.paginationPopover}
      onClose={() => props.setPaginationPopover(false)}
      trapFocus={false}
      position="top"
      zIndex={10}
      classNames={{
        dropdown: "p-0 rounded-md shadow-lg",
      }}
    >
      <Popover.Target>
        <button
          onClick={() => {
            props.setPaginationPopover(!props.paginationPopover)
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-tangerine-300 to-tangerine-500 py-1 px-3 text-neutral-50"
        >
          <p className="font-medium">{props.limit}</p>
          <i className="fa-regular fa-chevron-down" />
        </button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
        <ul className="px-4 py-2">
          {showAssetsBy.map((i) => (
            <li
              key={i}
              className="cursor-pointer hover:bg-tangerine-50"
              onClick={() => {
                props.setLimit(i)
                props.setPage(1)
              }}
            >
              {i}
            </li>
          ))}
        </ul>
      </Popover.Dropdown>
    </Popover>
  )
}

export default PaginationPopOver
