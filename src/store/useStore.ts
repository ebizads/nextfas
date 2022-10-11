import create from "zustand"

type MinimizeState = {
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
}

export const useMinimizeStore = create<MinimizeState>((set) => ({
  minimize: false,
  setMinimize: () => set((state) => ({ minimize: !state.minimize })),
}))
