import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import { navigations } from "../../lib/table"
import { useMinimizeStore } from "../../store/useStore"
import NavAccordion from "../atoms/accordions/NavAccordion"
import UserNavAccordion from "../atoms/accordions/UserNavAccordion"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"

const SideBar = () => {
  const { pathname } = useRouter()
  const { data: session } = useSession()

  const { data: user } = trpc.user.findOne.useQuery(Number(session?.user?.id))
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
          src={"/FAS-Logo.svg"}
          alt="This is a FAS Logo"
          width={450}
          height={200}
          className=""
        />
        {/* <p className="text-2xl font-semibold">Fixed Assets System</p> */}
      </div>
      {/* <div className="flex w-full flex-col border-b">
        {!minimize && (
          <p className="pl-2 text-xs capitalize text-light-secondary">home</p>
        )}
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
      </div> */}
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
        {/* {(user?.user_type ?? "") === "admin" && <UserNavAccordion
          paths={paths}
          minimize={minimize}
          setMinimize={setMinimize}
        />} */}
      </div>
      {(user?.user_type ?? "") === "admin" && (
        <div className="flex w-full flex-col">
          {!minimize && (
            <p className="px-2 text-xs capitalize text-light-secondary">
              Maintenance
            </p>
          )}

          {
            <div
              className={`py-4 px-2 ${
                paths[paths.length - 1] === "User Management"
                  ? "bg-tangerine-50 font-medium text-tangerine-500"
                  : "text-light-secondary"
              }`}
            >
              <Link href={"/UserManagement"}>
                <div
                  className={`flex items-center ${
                    minimize ? "justify-center" : "justify-start pl-2"
                  } cursor-pointer gap-2 pl-2`}
                >
                  <i
                    className={`fa-user-gear w-8 ${
                      minimize ? "fa-regular text-2xl" : "fa-light"
                    } text-left`}
                  />
                  {!minimize && (
                    <p className="text-light-primary">User Management</p>
                  )}
                </div>
              </Link>
            </div>
          }
        </div>
      )}
    </div>
  )
}

export default SideBar
