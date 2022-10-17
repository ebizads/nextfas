import React from "react"
import { motion } from "framer-motion"
import { ReactTag } from "@headlessui/react/dist/types"

const animations = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
}
const AnimatedPage = ({ children }: { children: React.ReactElement }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  )
}

export default AnimatedPage
