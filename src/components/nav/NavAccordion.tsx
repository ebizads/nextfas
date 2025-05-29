// components/atoms/accordions/AssetNavAccordion.tsx

import Link from "next/link"
import React from "react"

const NavAccordion = ({ minimize, paths }: { minimize: boolean; paths: string[] }) => {
  const isActive = (subPath: string) =>
    paths[paths.length - 1]?.toLowerCase() === subPath.toLowerCase()

  if (minimize) return null // Don't show accordion when minimized

  return (
    <div className="flex flex-col w-full px-0 py-4">
      <div className="flex items-center gap-2 pl-2 text-light-secondary">
        <i className="fa-user-gear w-8 fa-light text-left" />
        <p className="text-light-primary">Asset Details</p>
      </div>

      <div className="mt-2 flex flex-col space-y-1">
        <Link href="/typemanagement">
          <p
            className={`cursor-pointer text-sm ${
              isActive("typemanagement")
                ? "text-tangerine-500 font-semibold"
                : "text-light-secondary"
            }`}
          >
            Type
          </p>
        </Link>
        <Link href="/actiontypemanagement">
          <p
            className={`cursor-pointer text-sm ${
              isActive("Actiontypemanagement")
                ? "text-tangerine-500 font-semibold"
                : "text-light-secondary"
            }`}
          >
            Action Type
          </p>
        </Link>
      </div>
    </div>
  )
}

export default NavAccordion
