import create from "zustand"

type MinimizeState = {
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
}

type DeleteState = {
  openModalDel: boolean
  setModalDel: React.Dispatch<React.SetStateAction<boolean>>
}

export const useMinimizeStore = create<MinimizeState>((set) => ({
  minimize: false,
  setMinimize: () => set((state) => ({ minimize: !state.minimize })),
}))

export const useDeleteStore = create<DeleteState>((set) => ({
  openModalDel: false,
  setModalDel: () => set((state) => ({ openModalDel: !state.openModalDel })),
}))
