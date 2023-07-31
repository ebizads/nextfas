import React, { useEffect, useState } from "react"
import { Popover } from "@mantine/core"
import { signOut } from "next-auth/react"
import ChangePassModal from "../../../pages/UserManagement/ChangePassModal"
import { useSession } from "next-auth/react"
import { trpc } from "../../../utils/trpc"
import UserValidateModal from "../../user/UserValidateModal"
import { useUserEditableStore } from "../../../store/useStore"

const LogOutPopOver = (props: {
  openPopover: boolean
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  // const [openChangePass, setOpenChangePass] = useState<boolean>(false)
  //const [openPromptVisible, setOpenPromptVisible] = useState<boolean>(false)

  const [isCounter, setIsCounter] = useState<number>(0)
  const { data: session } = useSession()
  const [userId, setUserId] = useState<number>(0)
  const { data: user } = trpc.user.findOne.useQuery(userId)
  const [validateIsVisible, setValidate] = useState<boolean>(false)
  const [updateRecord, setUpdateRecord] = useState<boolean>(false)
  const { userEditable, setUserEditable } = useUserEditableStore()

  useEffect(() => {
    if (!validateIsVisible && userEditable) {
      setUserEditable(false)
    }
    setUserId(Number(session?.user?.id))
    //console.log(user)
    console.log("userEditable:", userEditable)

    //setOpenChangePass(props.isVisible)
  }, [userEditable, props, session, setUserEditable, user, validateIsVisible])


  useEffect(() => {
    console.log("userEditable: " + userEditable, "validatevisible: " + validateIsVisible)
  })

  return (
    <div>
      <ChangePassModal
        isVisible={props.isVisible}
        setVisible={props.setIsVisible}
      ></ChangePassModal>

      <UserValidateModal
        openModalDesc={validateIsVisible}
        setOpenModalDesc={setValidate}
      ></UserValidateModal>

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
                props.setIsVisible(true)
              }}
              className="flex items-center gap-2 px-6 py-2 hover:bg-tangerine-100"
            >
              <i className="fa-solid fa-shield-keyhole" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => {
                setValidate(true)
                setIsCounter(0)
              }}
              className="flex items-center gap-2 px-6 py-2 hover:bg-tangerine-100"
            >
              <i className="fa-solid fa-check" />
              <span>Validate User</span>
            </button>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  )
}

export default LogOutPopOver
