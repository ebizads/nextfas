import { Accordion } from "@mantine/core"
import Link from "next/link"
import React from "react"

type SubNavType = {
  name: string
  icon?: string
  link: string
}

interface NavType {
  name: string
  icon: string
  link: string
  subType?: SubNavType[]
}

const navigations = [
  {
    name: "Transactions",
    icon: "fa-light fa-arrow-right-arrow-left",
    link: "#",
    subType: [
      { name: "Transfer", link: "/transactions/transfer" },
      { name: "Split", link: "/transactions/split" },
      { name: "Depreciation", link: "/transactions/depreciation" },
      { name: "Disposal", link: "/transactions/disposal" },
      { name: "Repair", link: "/transactions/repair" },
      { name: "Issuance", link: "/transactions/issuance" },
    ],
  },
  {
    name: "Reports",
    icon: "fa-light fa-file-chart-pie",
    link: "#",
    subType: [
      { name: "Transfer", link: "/transactions/transfer" },
      { name: "Split", link: "/transactions/split" },
      { name: "Depreciation", link: "/transactions/depreciation" },
      { name: "Disposal", link: "/transactions/disposal" },
      { name: "Repair", link: "/transactions/repair" },
      { name: "Issuance", link: "/transactions/issuance" },
    ],
  },
  {
    name: "Employees",
    icon: "fa-light fa-users",
    link: "#",
    subType: [
      { name: "Transfer", link: "/transactions/transfer" },
      { name: "Split", link: "/transactions/split" },
      { name: "Depreciation", link: "/transactions/depreciation" },
      { name: "Disposal", link: "/transactions/disposal" },
      { name: "Repair", link: "/transactions/repair" },
      { name: "Issuance", link: "/transactions/issuance" },
    ],
  },
  {
    name: "Accounting",
    icon: "fa-light fa-calculator-simple",
    link: "#",
    subType: [
      { name: "Transfer", link: "/transactions/transfer" },
      { name: "Split", link: "/transactions/split" },
      { name: "Depreciation", link: "/transactions/depreciation" },
      { name: "Disposal", link: "/transactions/disposal" },
      { name: "Repair", link: "/transactions/repair" },
      { name: "Issuance", link: "/transactions/issuance" },
    ],
  },
  {
    name: "Vendors",
    icon: "fa-light fa-store",
    link: "#",
    subType: [
      { name: "Transfer", link: "/transactions/transfer" },
      { name: "Split", link: "/transactions/split" },
      { name: "Depreciation", link: "/transactions/depreciation" },
      { name: "Disposal", link: "/transactions/disposal" },
      { name: "Repair", link: "/transactions/repair" },
      { name: "Issuance", link: "/transactions/issuance" },
    ],
  },
  {
    name: "Inventory",
    icon: "fa-light fa-folders",
    link: "#",
    subType: [
      { name: "Transfer", link: "/transactions/transfer" },
      { name: "Split", link: "/transactions/split" },
      { name: "Depreciation", link: "/transactions/depreciation" },
      { name: "Disposal", link: "/transactions/disposal" },
      { name: "Repair", link: "/transactions/repair" },
      { name: "Issuance", link: "/transactions/issuance" },
    ],
  },
] as NavType[]

const NavAccordion = (props: {
  paths: string[]
  minimize: boolean
  setMinimize: Function
}) => {
  return (
    <div>
      {!props.minimize ? (
        <Accordion
          defaultValue={props.paths[0]?.toUpperCase()}
          transitionDuration={420}
        >
          {navigations
            // .filter((item) => item.subType)
            .map((page, idx) => (
              <Accordion.Item key={idx} value={page.name.toUpperCase()}>
                <Accordion.Control>
                  <div
                    className={`flex gap-2 items-center ${
                      props.paths[0]?.toUpperCase() === page.name.toUpperCase()
                        ? "text-tangerine-500 font-medium"
                        : ""
                    } ${props.minimize ? "justify-center" : ""}`}
                  >
                    <i className={page.icon + " w-8 text-left "} />
                    <p className=" text-base font-sans">{page.name}</p>
                  </div>
                </Accordion.Control>
                {page.subType && (
                  <Accordion.Panel>
                    <div className="text-sm flex flex-col font-sans">
                      {page.subType.map((type, idx) => (
                        <Link key={idx} href={type.link}>
                          <a
                            className={`pl-4 ${
                              props.paths[
                                props.paths.length - 1
                              ]?.toUpperCase() === type.name.toUpperCase()
                                ? "bg-tangerine-100"
                                : ""
                            } ${
                              idx !== page.subType!.length - 1 ? "border-b" : ""
                            } py-1 hover:bg-tangerine-50 hover:text-tangerine-600 duration-150`}
                          >
                            {type.name}
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
              className={`py-4 border-b w-full text-center ${
                props.paths[0]?.toUpperCase() === page.name.toUpperCase()
                  ? "text-tangerine-500"
                  : ""
              }`}
              onClick={() => {
                props.setMinimize(false)
              }}
            >
              <i className={page.icon + " text-xl fa-regular"} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export default NavAccordion
