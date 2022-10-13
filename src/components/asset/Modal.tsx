import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, ReactElement } from "react"

const getSize = (size: number) => {
  return size === 1
    ? "max-w-xs"
    : size === 2
    ? "max-w-sm"
    : size === 3
    ? "max-w-md"
    : size === 4
    ? "max-w-lg"
    : size === 5
    ? "max-w-xl"
    : size === 6
    ? "max-w-2xl"
    : size === 7
    ? "max-w-3xl"
    : size === 8
    ? "max-w-4xl"
    : size === 9
    ? "max-w-5xl"
    : size === 10
    ? "max-w-6xl"
    : size === 11
    ? "max-w-7xl"
    : "max-w-full"
}

const Modal = ({
  isOpen,
  setIsOpen,
  className,
  size,
  children,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
  size: number
  children: ReactElement
}) => {
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={
                    className
                      ? `${className} ${getSize(size - 3)} xl:${getSize(size)}`
                      : `${getSize(size - 3)} xl:${getSize(
                          size
                        )} min-w-lg w-full transform overflow-hidden rounded-xl bg-neutral-50 text-left align-middle shadow-xl transition-all`
                  }
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal
