import { z } from "zod/lib"
import { useEffect, useState } from "react"
import Modal from "../headless/modal/modal"

export const DropZoneModal = (props: {
  closeModal: boolean
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const closeAll = () => {
    props.setCloseModal(false)
    props.setIsVisible(false)
    window.location.reload()
  }
  return (
    <Modal
      className="max-w-lg text-center"
      isVisible={props.closeModal}
      setIsVisible={props.setCloseModal}
      title="NOTICE!"
    >
      <>
        <div className="py-2 justify-center items-center flex flex-col gap-5">
          <p className=" text-lg font-semibold">Import Succesful</p>
          <button
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            onClick={closeAll}
          >
            Confirm
          </button>
        </div>
      </>
    </Modal>
  )
}
