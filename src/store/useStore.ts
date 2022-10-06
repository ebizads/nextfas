import create from "zustand"

type MinimizeState = {
  minimize: boolean
  setMinimize: Function
}

export const useMinimizeStore = create<MinimizeState>((set) => ({
  minimize: false,
  setMinimize: () => set((state) => ({ minimize: !state.minimize })),
}))
