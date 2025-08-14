import React from "react"
import { Popover, Checkbox } from "@mantine/core"
import { ColumnType } from "../../../types/table"
import { AssetActionTypeFilter, AssetTypeFilter } from "../../../types/generic"

type SingleAssetType = NonNullable<AssetTypeFilter>[number]
type SingleActionAssetType = NonNullable<AssetActionTypeFilter>[number]

const AssetFilter = (props: {
  openPopover: boolean
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>
  typeFilter: string[]
  actionTypeFilter: string[]
  statusFilter: string[]
  setTypeFilter: React.Dispatch<React.SetStateAction<string[]>>
  setActionTypeFilter: React.Dispatch<React.SetStateAction<string[]>>
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>
  typeData: AssetTypeFilter
  actionTypeData: AssetActionTypeFilter
}) => {
  return (
    <Popover
      opened={props.openPopover}
      onClose={() => props.setOpenPopover(false)}
      trapFocus={false}
      position="bottom-end"
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
          className="flex items-center gap-2 rounded-md border-2 border-tangerine-500 bg-tangerine-500 py-2 px-4 text-xs font-medium text-white outline-none hover:border-tangerine-600 hover:bg-tangerine-600 focus:outline-none"
        >
          <i className="fa-regular fa-bars-filter text-xs text-white" />
        </button>
      </Popover.Target>

      <Popover.Dropdown>
        <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
        <p className="px-3 pt-2 pb-0 text-[#5a5f64]">Filter</p>
        <div className="flex gap-4 px-6 py-4">
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            <Checkbox.Group
              orientation="vertical"
              description="Type"
              value={props.typeFilter}
              onChange={props.setTypeFilter}
            >
              <div className="flex flex-col gap-2">
                {props.typeData?.map((col) => (
                  <Checkbox
                    color="orange"
                    key={col.name}
                    disabled={
                      props.typeData?.length === 1 &&
                      props.typeData?.some(
                        (i: SingleAssetType) => i.name === col.name
                      )
                    }
                    value={col.name}
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

          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            <Checkbox.Group
              orientation="vertical"
              description="Action Type"
              value={props.actionTypeFilter}
              onChange={props.setActionTypeFilter}
            >
              <div className="flex flex-col gap-2">
                {props.actionTypeData?.map((col) => (
                  <Checkbox
                    color="orange"
                    key={col.name}
                    value={col.name}
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

          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            <Checkbox.Group
              orientation="vertical"
              description="Status"
              value={props.statusFilter}
              onChange={props.setStatusFilter}
            >
              <div className="flex flex-col gap-2">
                <Checkbox
                  color="orange"
                  key={"in"}
                  value={"in"}
                  label={"In"}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                    label: "truncate",
                  }}
                />
              ))}
            </div>
            <div className="flex flex-row justify-evenly"></div>
          </Checkbox.Group>{" "}
          <Checkbox.Group
            orientation="vertical"
            description="Action Type"
            value={props.actionTypeFilter}
            onChange={props.setActionTypeFilter}
          >
            <div className="flex flex-col gap-2">
              {props.actionTypeData?.map((col) => (
                <Checkbox
                  color="orange"
                  key={"issued"}
                  value={"issued"}
                  label={"Issued"}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 focus:outline-none",
                    label: "truncate",
                  }}
                />
              </div>
            </Checkbox.Group>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

export default AssetFilter
