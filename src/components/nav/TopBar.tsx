import { useRouter } from "next/router"
import React, { useEffect, useMemo } from "react"

const TopBar = () => {
  const { pathname } = useRouter()
  const paths = useMemo(() => {
    return pathname.split("/").filter((item, idx) => idx !== 0)
  }, [pathname])

  return (
    <div className="min-h-[7vh] max-h-[7vh] flex-1 px-4 border-b flex justify-between items-center">
      <div className="flex gap-4 text-light-secondary">
        <h5>FAS</h5>
        {paths.map((path, idx) => (
          <div key={idx} className="flex">
            <h5 className="flex gap-4">
              <span>/</span>
              <span className="font-medium capitalize">{path}</span>
            </h5>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <i className="fa-solid fa-bell text-lg text-gray-500" />
        <div className="px-2 py-1 border border-gray-400 rounded-full">
          <p className="text-xs">Juan Dela Cruz</p>
        </div>
        <div className="relative rounded-full h-10 w-10 border-4 border-tangerine-500 bg-tangerine-400 flex items-center justify-center">
          <i className="fa-solid fa-user-ninja text-2xl" />
        </div>
      </div>
    </div>
  )
}

export default TopBar
