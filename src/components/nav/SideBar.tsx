import { Accordion } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"
import NavAccordion from "./NavAccordion"

const SideBar = () => {
  const { pathname } = useRouter()
  const paths = useMemo(() => {
    return pathname.split("/").filter((item, idx) => idx !== 0)
  }, [pathname])

  const [minimize, setMinimize] = useState<boolean>(false)

  return (
    <div
      className={`max-w-md duration-300 ${
        minimize ? "w-[10vw]" : "w-[30vw] xl:w-[20vw]"
      } px-2 py-4 flex flex-col border-r min-h-screen space-y-4 overflow-hidden`}
    >
      <div className="relative flex flex-col w-full border-b px-2 pb-2">
        <h1
          className="text-center cursor-pointer text-xl font-bold truncate"
          onClick={() => {
            setMinimize((prev) => !prev)
          }}
        >
          {minimize ? "FAS" : "Fixed Asset System"}
        </h1>
      </div>
      <div className="flex flex-col w-full border-b px-2 pb-3 space-y-2">
        {!minimize && (
          <p className="text-light-secondary capitalize text-xs">home</p>
        )}
        <Link href={"/dashboard"}>
          <div
            className={`${
              paths[paths.length - 1] === "dashboard"
                ? "text-tangerine-500 font-medium"
                : ""
            } flex items-center ${
              minimize ? "justify-center" : "pl-2 justify-start"
            } gap-2 cursor-pointer`}
          >
            <i
              className={`fa-house-blank ${
                minimize ? "fa-regular text-2xl" : "fa-light w-8"
              } text-left`}
            />
            {!minimize && <p>Dashboard</p>}
          </div>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        {!minimize && (
          <p className="text-light-secondary capitalize text-xs px-2">
            asset info
          </p>
        )}
        <div className="py-4 border-b px-2">
          <Link href={"/assets"}>
            <div
              className={`flex items-center ${
                minimize ? "justify-center" : "pl-2 justify-start"
              } gap-2 pl-2 cursor-pointer ${
                paths[paths.length - 1] === "assets"
                  ? "text-tangerine-500 font-medium"
                  : ""
              }`}
            >
              <i
                className={`fa-cubes w-8 ${
                  minimize ? "fa-regular text-2xl" : "fa-light"
                } text-left`}
              />
              {!minimize && <p>Assets</p>}
            </div>
          </Link>
        </div>
        <NavAccordion
          paths={paths}
          minimize={minimize}
          setMinimize={setMinimize}
        />
      </div>
    </div>
  )
}

export default SideBar
