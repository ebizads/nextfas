import React from "react"
import SideBar from "../components/nav/SideBar"
import TopBar from "../components/nav/TopBar"
import { useMinimizeStore } from "../store/useStore"

import { AnimatePresence } from "framer-motion"
import AnimatedPage from "../components/framer/AnimatedPage"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { minimize } = useMinimizeStore()

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />
      <div
        className={`flex flex-1 flex-col ${minimize ? "w-[90vw]" : "w-[75vw]"
          } min-h-screen duration-200 xl:w-full`}
      >
        {/* Topbar */}

        <TopBar />
        {/* Content */}

        <AnimatePresence mode="wait">
          <AnimatedPage>
            <section className={`flex w-full flex-1 flex-col p-4 overflow-x-hidden`}>
              {children}
            </section>
          </AnimatedPage>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DashboardLayout
