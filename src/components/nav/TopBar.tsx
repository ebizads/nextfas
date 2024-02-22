import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import LogOutPopOver from "../atoms/popover/LogOutPopOver"
import { UserType } from "../../types/generic"
import { trpc } from "../../utils/trpc"
import Modal from "../headless/modal/modal"
import { signOut } from "next-auth/react"
import { useCounterValidateStore } from "../../store/useStore"

const TopBar = () => {
  const { data: session } = useSession()

  const [userId, setUserId] = useState<number>(0)

  const { data: user, refetch } = trpc.user.findOne.useQuery(userId)

  const { data: validateTable } = trpc.user.findValidate.useQuery(userId)

  const [openChangePass, setOpenChangePass] = useState<boolean>(false)

  const [openPromptVisible, setOpenPromptVisible] = useState<boolean>(false)

  const [openLogoutPopover, setOpenLogoutPopover] = useState<boolean>(false)

  const { counterCheck, setCounterCheck } = useCounterValidateStore()

  const { pathname } = useRouter()

  const [sessionName, setSessionName] = useState<string>("")

  const dateNow = new Date()
  let dayNow = 0
  let validateDate = 0
  if (Boolean(user?.passwordAge)) {
    dayNow = Number(
      (dateNow.getTime() - (user?.passwordAge?.getTime() ?? 0)) /
        (1000 * 60 * 60 * 24)
    )
  }
  if (Boolean(validateTable?.validationDate)) {
    validateDate = Number(
      ((validateTable?.validationDate?.getTime() ?? 0) - dateNow.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  }

  useEffect(() => {
    setSessionName(user?.name ?? "")
    setUserId(Number(session?.user?.id))
    if (user?.firstLogin || dayNow > 60) {
      setOpenChangePass(true)
    }

    if (Boolean(validateTable?.validationDate)) {
      if (
        (dateNow >= (validateTable?.validationDate ?? new Date()) &&
          !counterCheck) ||
        (validateDate <= 14 && !counterCheck)
      ) {
        setOpenPromptVisible(true)
        setCounterCheck(true)
      }
    }

    // const intervalId = setInterval(() => {
    //   refetch()
    //   console.log("userId: " + userId)
    // }, 5000)

    console.log("first login: " + user?.firstLogin?.toString())
  }, [
    session,
    user,
    dayNow,
    refetch,
    userId,
    dateNow,
    validateTable,
    validateDate,
    counterCheck,
    setCounterCheck,
  ])
  const paths = useMemo(() => {
    const path_array = pathname
      .split("/")
      .filter((_, idx) => idx !== 0)
      .map((path) => {
        if (path.includes("_")) {
          return path.replace("_", " ")
        }
        return path
      })
    return path_array
  }, [pathname])

  // const {mutate} = trpc.user.createArchive.useMutation({onSuccess(){
  //   console.log("ayos na")
  // }})

  // const tryMutate = async () => {
  //   console.log("trial: " + userId)

  //   mutate({
  //     old_id: userId,
  //     teamId: 0,
  //   })
  // }
  return (
    <div className="flex max-h-[7vh] min-h-[7vh] items-center justify-between border-b px-4">
      <div className="flex gap-4 text-light-secondary">
        <h5>{paths[0] === "dashboard" ? "Home" : "Info"}</h5>
        {paths.map((path, idx) => (
          <div key={idx} className="flex">
            <h5 className="flex gap-4">
              <span>/</span>
              <span className="font-medium capitalize text-neutral-800">
                {path}
              </span>
            </h5>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-bell text-lg text-gray-500" />
        <div className="rounded-full border border-gray-400 px-2 py-1">
          <p className="text-xs">{sessionName}</p>
        </div>
        {/* <button
        type = "button"
        className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
        onClick={() => {
          tryMutate()
        }}
        >
          Try
        </button> */}

        <Modal
          isVisible={openPromptVisible}
          setIsVisible={setOpenPromptVisible}
          className="max-w-2xl"
          title="Status"
        >
          <div className="flex w-full flex-col px-4 py-2">
            <div>
              <p className="text-center text-lg font-semibold">
                Account needs revalidation!
              </p>
            </div>
            <div className="flex justify-end py-2">
              <button
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  setOpenPromptVisible(false)
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        <LogOutPopOver
          openPopover={openLogoutPopover}
          setOpenPopover={setOpenLogoutPopover}
          isVisible={openChangePass}
          setIsVisible={setOpenChangePass}
        />
      </div>
    </div>
  )
}

export default TopBar
