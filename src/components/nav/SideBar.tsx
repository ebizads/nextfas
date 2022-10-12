import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import { useMinimizeStore } from "../../store/useStore"
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

  const { minimize, setMinimize } = useMinimizeStore()

  return (
    <div
      className={`max-w-md duration-300 ${
        minimize
          ? "w-[10vw] min-w-[10vw]"
          : "w-[25vw] min-w-[25vw] xl:w-[20vw] xl:min-w-[20vw]"
      } flex min-h-screen flex-col space-y-4 overflow-hidden border-r px-2 py-4`}
    >
      <div
        className="relative flex w-full flex-col px-2 pb-2"
        onClick={() => {
          setMinimize((prev) => !prev)
        }}
      >
        <Image
          src={"/FASlogo.svg"}
          alt="This is a FAS Logo"
          width={110}
          height={60}
          className=""
        />
      </div>
      <div className="flex w-full flex-col border-b">
        {!minimize && (
          <p className="pl-2 text-xs capitalize text-light-secondary">home</p>
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
              ? "bg-tangerine-50 font-medium text-tangerine-500"
              : "text-light-secondary"
          }`}
        >
          <Link href={"/dashboard"}>
            <div
              className={`flex items-center ${
                minimize ? "justify-center" : "justify-start pl-2"
              } cursor-pointer gap-2 pl-2`}
            >
              <i
                className={`fa-house-blank w-8 ${
                  minimize ? "fa-regular text-2xl" : "fa-light"
                } text-left`}
              />
              {!minimize && <p className="text-light-primary">Dashboard</p>}
            </div>
          </Link>
        </div>
      </div>
      <div className="flex w-full flex-col">
        {!minimize && (
          <p className="px-2 text-xs capitalize text-light-secondary">
            asset info
          </p>
        )}
        <div
          className={`py-4 px-2 ${
            paths[paths.length - 1] === "assets"
              ? "bg-tangerine-50 font-medium text-tangerine-500"
              : "text-light-secondary"
          }`}
        >
          <Link href={"/assets"}>
            <div
              className={`flex items-center ${
                minimize ? "justify-center" : "justify-start pl-2"
              } cursor-pointer gap-2 pl-2`}
            >
              <i
                className={`fa-cubes w-8 ${
                  minimize ? "fa-regular text-2xl" : "fa-light"
                } text-left`}
              />
              {!minimize && <p className="text-light-primary">Assets</p>}
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
            key={idx}
            className={`py-4 px-2 ${
              paths[paths.length - 1]?.toUpperCase() === page.name.toUpperCase()
                ? "bg-tangerine-50 font-medium text-tangerine-500"
                : ""
            }`}
          >
            <Link href={page.link}>
              <div
                className={`flex items-center ${
                  minimize ? "justify-center" : "justify-start pl-2"
                } cursor-pointer gap-2 pl-2`}
              >
                <i
                  className={`${page.icon} ${
                    paths[paths.length - 1]?.toUpperCase() ===
                    page.name.toUpperCase()
                      ? "bg-tangerine-50 font-medium text-tangerine-500"
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
