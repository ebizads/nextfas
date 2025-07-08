import React, { useState } from "react"
import Link from "next/link"

const NavAccordion = (props: {
  paths: string[]
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const assetDetailsNav = {
    name: "Asset Details",
    icon: "fa-box-archive",
    subType: [
      {
        name: "Type",
        link: "/typemanagement",
        icon: "fa-tag",
      },
      {
        name: "Action Type",
        link: "/actiontypemanagement",
        icon: "fa-bolt",
      },
    ],
  }

  const [isOpen, setIsOpen] = useState(
    assetDetailsNav.subType.some(
      (i) => props.paths[0] && i.link.includes(props.paths[0])
    )
  )

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div
      className={`py-4 px-0 font-[Inter] ${
        assetDetailsNav.subType.some(
          (i) => props.paths[0] && i.link.includes(props.paths[0])
        )
          ? "bg-tangerine-50 font-medium text-tangerine-500"
          : ""
      }`}
    >
      {!props.minimize ? (
        <div>
          {/* Accordion Control */}
          <div
            className="flex cursor-pointer items-center justify-between px-2"
            onClick={toggleOpen}
          >
            <div className="flex items-center gap-2">
              <i
                className={`${assetDetailsNav.icon} ${
                  assetDetailsNav.subType.some(
                    (i) => props.paths[0] && i.link.includes(props.paths[0])
                  )
                    ? "text-tangerine-500"
                    : "text-light-secondary"
                } w-8 ${
                  props.minimize ? "fa-regular text-2xl" : "fa-light"
                } text-left`}
              />
              {!props.minimize && (
                <p
                  className={
                    assetDetailsNav.subType.some(
                      (i) => props.paths[0] && i.link.includes(props.paths[0])
                    )
                      ? "text-light-primary"
                      : "text-light-primary"
                  }
                >
                  {assetDetailsNav.name}
                </p>
              )}
            </div>
            <i
              className={`fas fa-chevron-down transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Accordion Panel */}
          {isOpen && (
            <div className="mt-2 flex flex-col pl-4">
              {assetDetailsNav.subType.map((type, idx) => (
                <Link href={type.link} key={idx}>
                  <div
                    className={`flex cursor-pointer items-center gap-2 py-2 pl-2 ${
                      "/" +
                        props.paths[props.paths.length - 1]?.toUpperCase() ===
                      type.link.toUpperCase()
                        ? "font-medium text-tangerine-500"
                        : "text-light-primary"
                    }`}
                  >
                    <i className={`${type.icon} fa-light w-8 text-left`} />
                    <p>{type.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Minimized View
        <div
          className={`flex cursor-pointer items-center justify-center gap-2 pl-2`}
          onClick={() => props.setMinimize(false)}
        >
          <i
            className={`${assetDetailsNav.icon} ${
              props.paths[0]?.toUpperCase() ===
              assetDetailsNav.name.toUpperCase()
                ? "text-tangerine-500"
                : "text-light-secondary"
            } fa-regular w-8 text-left text-2xl`}
          />
        </div>
      )}
    </div>
  )
}

export default NavAccordion
