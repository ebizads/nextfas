import React from "react"
import create from "zustand"
import { AssetType } from "../types/generic"

type MinimizeState = {
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
}

type DeleteState = {
  openModalDel: boolean
  setModalDel: React.Dispatch<React.SetStateAction<boolean>>
}

type SelectedAssetState = {
  selectedAsset: AssetType
  setSelectedAsset: (newAsset: AssetType) => void
}

export const useMinimizeStore = create<MinimizeState>((set) => ({
  minimize: false,
  setMinimize: () => set((state) => ({ minimize: !state.minimize })),
}))

export const useDeleteStore = create<DeleteState>((set) => ({
  openModalDel: false,
  setModalDel: () => set((state) => ({ openModalDel: !state.openModalDel })),
}))

export const useUpdateAssetStore = create<SelectedAssetState>((set) => ({
  selectedAsset: null,
  setSelectedAsset: (newAsset: AssetType) => set({ selectedAsset: newAsset }),
}))
