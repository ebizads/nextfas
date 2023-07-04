import { Accordion } from "@mantine/core"
import Link from "next/link"
import React from "react"
import { NavType } from "../../../types/table"

export const userNavigations = [
  {
    name: "User Management",
    icon: "fa-light fa-user-gear",
    link: "#",
    subType: [
      {
        icon: "fa-regular fa-users",
        name: "All Users",
        link: "/auth/",
      },
      {
        icon: "fa-regular fa-user-plus",
        name: "Register",
        link: "/reports/register",
      },
    ],
  },
] as NavType[]

const UserNavAccordion = (props: {
  paths: string[]
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div>
      {!props.minimize ? (
        <Accordion
          variant="filled"
          defaultValue={props.paths[0]?.toUpperCase()}
          transitionDuration={420}
        >
          {userNavigations
            // .filter((item) => item.subType)
            .map((page, idx) => (
              <Accordion.Item key={idx} value={page.name.toUpperCase()}>
                <Accordion.Control
                  className={`m-0 py-4 px-4 ${props.paths[0]?.toUpperCase() === page.name.toUpperCase()
                    ? "bg-tangerine-50 font-medium text-tangerine-500"
                    : "text-light-secondary"
                    }`}
                >
                  <div
                    className={`flex items-center gap-2 ${props.minimize ? "justify-center" : ""
                      }`}
                  >
                    <i className={page.icon + " w-8 text-left "} />
                    <p className=" font-sans text-base text-light-primary">
                      {page.name}
                    </p>
                  </div>
                </Accordion.Control>
                {page.subType && (
                  <Accordion.Panel>
                    <div className="flex flex-col font-sans text-sm">
                      {page.subType.map((type, idx) => (
                        <Link key={idx} href={type.link}>
                          <a
                            className={`pl-4 ${props.paths[
                              props.paths.length - 1
                            ]?.toUpperCase() === type.name.toUpperCase()
                              ? "bg-tangerine-100"
                              : ""
                              } flex items-center gap-4 py-1 duration-150 hover:bg-tangerine-50 hover:text-tangerine-600`}
                          >
                            <div className="w-4">
                              <i className={type.icon + " text-gray-400"} />
                            </div>
                            <p>{type.name}</p>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </Accordion.Panel>
                )}
              </Accordion.Item>
            ))}
        </Accordion>
      ) : (
        <div className="flex flex-col">
          {userNavigations.map((page, idx) => (
            <button
              key={idx}
              className={`w-full  py-4 text-center ${props.paths[0]?.toUpperCase() === page.name.toUpperCase()
                ? "bg-tangerine-50 text-tangerine-500"
                : "text-light-secondary"
                }`}
              onClick={() => {
                props.setMinimize(false)
              }}
            >
              <i className={page.icon + " fa-regular text-xl"} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export default UserNavAccordion
