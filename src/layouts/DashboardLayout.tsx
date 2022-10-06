import React from "react"
import SideBar from "../components/nav/SideBar"
import TopBar from "../components/nav/TopBar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />
      <div className="flex flex-col w-full min-h-screen">
        {/* Topbar */}

        <TopBar />
        {/* Content */}
        <section className="flex flex-col p-4">{children}</section>
      </div>
    </div>
  )
}

export default DashboardLayout
