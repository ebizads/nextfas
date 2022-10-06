import { Accordion } from "@mantine/core"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"
import NavAccordion, { NavType } from "./NavAccordion"

const navigations = [
  {
    name: "Employees",
    icon: "fa-users",
    link: "/employees",
  },
  {
    name: "Accounting",
    icon: "fa-calculator-simple",
    link: "/accounting",
  },
  {
    name: "Vendors",
    icon: "fa-store",
    link: "/vendors",
  },
  {
    name: "Inventory",
    icon: "fa-light fa-folders",
    link: "/inventory",
  },
] as NavType[]

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
      <div
        className="relative flex flex-col w-full px-2 pb-2"
        onClick={() => {
          setMinimize((prev) => !prev)
        }}
      >
        {/* <h1
          className="text-center cursor-pointer text-xl font-bold truncate"
          onClick={() => {
            setMinimize((prev) => !prev)
          }}
        >
          {minimize ? "FAS" : "Fixed Asset System"}
        </h1> */}

        <Image
          src={"/FASlogo.svg"}
          alt="This is a FAS Logo"
          width={110}
          height={60}
          className=""
        />
      </div>
      <div className="flex flex-col w-full border-b">
        {!minimize && (
          <p className="text-light-secondary capitalize text-xs pl-2">home</p>
        )}
        {/* <Link href={"/dashboard"}>
          <div
            className={`${
              paths[paths.length - 1] === "dashboard"
                ? "text-tangerine-500 font-medium bg-tangerine-50"
                : "text-light-secondary"
            } flex items-center ${
              minimize ? "justify-center" : "pl-2 justify-start"
            } gap-2 cursor-pointer`}
          >
            <i
              className={`fa-house-blank ${
                minimize ? "fa-regular text-2xl" : "fa-light w-8"
              } text-left`}
            />
            {!minimize && <p className="text-light-primary">Dashboard</p>}
          </div>
        </Link> */}
        <div
          className={`py-4 px-2 ${
            paths[paths.length - 1] === "dashboard"
              ? "text-tangerine-500 font-medium bg-tangerine-50"
              : ""
          }`}
        >
          <Link href={"/dashboard"}>
            <div
              className={`flex items-center ${
                minimize ? "justify-center" : "pl-2 justify-start"
              } gap-2 pl-2 cursor-pointer`}
            >
              <i
                className={`fa-cubes w-8 ${
                  minimize ? "fa-regular text-2xl" : "fa-light"
                } text-left`}
              />
              {!minimize && <p>Dashboard</p>}
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {!minimize && (
          <p className="text-light-secondary capitalize text-xs px-2">
            asset info
          </p>
        )}
        <div
          className={`py-4 px-2 ${
            paths[paths.length - 1] === "assets"
              ? "text-tangerine-500 font-medium bg-tangerine-50"
              : ""
          }`}
        >
          <Link href={"/assets"}>
            <div
              className={`flex items-center ${
                minimize ? "justify-center" : "pl-2 justify-start"
              } gap-2 pl-2 cursor-pointer ${
                paths[paths.length - 1] === "assets"
                  ? "text-tangerine-500 font-medium bg-tangerine-50"
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
        {navigations.map((page, idx) => (
          <div
            className={`py-4 px-2 ${
              paths[paths.length - 1]?.toUpperCase() === page.name.toUpperCase()
                ? "text-tangerine-500 font-medium bg-tangerine-50"
                : ""
            }`}
          >
            <Link href={page.link}>
              <div
                className={`flex items-center ${
                  minimize ? "justify-center" : "pl-2 justify-start"
                } gap-2 pl-2 cursor-pointer`}
              >
                <i
                  className={`${page.icon} ${
                    paths[paths.length - 1]?.toUpperCase() ===
                    page.name.toUpperCase()
                      ? "text-tangerine-500 font-medium bg-tangerine-50"
                      : "text-light-secondary"
                  } w-8 ${
                    minimize ? "fa-regular text-2xl" : "fa-light"
                  } text-left`}
                />
                {!minimize && <p>{page.name}</p>}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
