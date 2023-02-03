import React, { useState } from "react"
import { Popover } from "@mantine/core"
import { signOut } from "next-auth/react"
import { ChangePassModal } from "../../../pages/auth/ChangePassModal"

const LogOutPopOver = (props: {
  openPopover: boolean
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [openChangePass, setOpenChangePass] = useState<boolean>(false)

  return (
    <div>
      <ChangePassModal
        isVisible={openChangePass}
        setVisibile={setOpenChangePass}
      ></ChangePassModal>
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
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-tangerine-500 bg-tangerine-400"
          >
            <i className="fa-solid fa-user-ninja text-2xl" />
          </button>
        </Popover.Target>{" "}
        <Popover.Dropdown>
          <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
          <div className="flex flex-col text-sm">
            <button
              onClick={() => {
                signOut({ callbackUrl: `${window.location.origin}` })
              }}
              className="flex items-center gap-2 px-6 py-2 hover:bg-tangerine-100"
            >
              <i className="fa-solid fa-right-from-bracket" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => {
                setOpenChangePass(true)
              }}
              className="flex items-center gap-2 px-6 py-2 hover:bg-tangerine-100"
            >
              <i className="fa-solid fa-right-from-bracket" />
              <span>Change Password</span>
            </button>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  )
}

export default LogOutPopOver
