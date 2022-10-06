import React from "react"
import SideBar from "../components/nav/SideBar"
import TopBar from "../components/nav/TopBar"
import { useMinimizeStore } from "../store/useStore"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { minimize } = useMinimizeStore()

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />
      <div
        className={`flex-1 flex flex-col ${
          minimize ? "w-[90vw]" : "w-[75vw]"
        } xl:w-full min-h-screen duration-200`}
      >
        {/* Topbar */}

        <TopBar />
        {/* Content */}
        <section className={`flex flex-col p-4 w-full flex-1`}>
          {children}
        </section>
      </div>
    </div>
  )
}

export default DashboardLayout
