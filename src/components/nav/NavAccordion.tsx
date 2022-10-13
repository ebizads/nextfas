import { Accordion } from "@mantine/core"
import Link from "next/link"
import React from "react"
import { NavType } from "../../types/table"

const navigations = [
  {
    name: "Transactions",
    icon: "fa-light fa-arrow-right-arrow-left",
    link: "#",
    subType: [
      {
        icon: "fa-regular fa-arrow-right-arrow-left",
        name: "Transfer",
        link: "/transactions/transfer",
      },
      {
        icon: "fa-solid fa-file-dashed-line",
        name: "Split",
        link: "/transactions/split",
      },
      {
        icon: "fa-regular fa-chart-line-down",
        name: "Depreciation",
        link: "/transactions/depreciation",
      },
      {
        icon: "fa-regular fa-trash-can",
        name: "Disposal",
        link: "/transactions/disposal",
      },
      {
        icon: "fa-regular fa-screwdriver-wrench",
        name: "Repair",
        link: "/transactions/repair",
      },
      {
        icon: "fa-regular fa-hand-holding-hand",
        name: "Issuance",
        link: "/transactions/issuance",
      },
    ],
  },
  {
    name: "Reports",
    icon: "fa-light fa-file-chart-pie",
    link: "#",
    subType: [
      {
        icon: "fa-light fa-typewriter",
        name: "Register",
        link: "/reports/register",
      },
      {
        icon: "fa-light fa-notebook",
        name: "Summary",
        link: "/reports/summary",
      },
      {
        icon: "fa-light fa-calendar-circle-exclamation",
        name: "Depreciation Schedule",
        link: "/reports/depreciation_schedule",
      },
      {
        icon: "fa-light fa-calendar-lines",
        name: "Monthly Report",
        link: "/reports/monthly_report",
      },
      {
        icon: "fa-light fa-clock-rotate-left",
        name: "History",
        link: "/reports/history",
      },
      {
        icon: "fa-light fa-money-bill-1",
        name: "Audit Report",
        link: "/reports/audit_report",
      },
    ],
  },
] as NavType[]

const NavAccordion = (props: {
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
          {navigations
            // .filter((item) => item.subType)
            .map((page, idx) => (
              <Accordion.Item key={idx} value={page.name.toUpperCase()}>
                <Accordion.Control
                  className={`m-0 py-4 px-4 ${
                    props.paths[0]?.toUpperCase() === page.name.toUpperCase()
                      ? "bg-tangerine-50 font-medium text-tangerine-500"
                      : "text-light-secondary"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      props.minimize ? "justify-center" : ""
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
                            className={`pl-4 ${
                              props.paths[
                                props.paths.length - 1
                              ]?.toUpperCase() === type.name.toUpperCase()
                                ? "bg-tangerine-100"
                                : ""
                            } flex items-center gap-4 py-1 duration-150 hover:bg-tangerine-50 hover:text-tangerine-600`}
                          >
                            <i className={type.icon + " text-gray-400"} />
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
          {navigations.map((page, idx) => (
            <button
              key={idx}
              className={`w-full  py-4 text-center ${
                props.paths[0]?.toUpperCase() === page.name.toUpperCase()
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
export default NavAccordion
