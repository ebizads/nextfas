import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"
import LogOutPopOver from "../atoms/popover/LogOutPopOver"

const TopBar = () => {


  const { data: session } = useSession()

  const [openLogoutPopover, setOpenLogoutPopover] = useState<boolean>(false)

  const { pathname } = useRouter()
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
          <p className="text-xs">{session?.user?.name}</p>

        </div>
        <LogOutPopOver openPopover={openLogoutPopover} setOpenPopover={setOpenLogoutPopover} />
      </div>
    </div>
  )
}

export default TopBar
