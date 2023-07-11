import React from "react"
import create from "zustand"
import { AssetType, EmployeeType } from "../types/generic"

type MinimizeState = {
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
}

type DeleteState = {
  openModalDel: boolean
  setModalDel: React.Dispatch<React.SetStateAction<boolean>>
}

type EditableState = {
  editable: boolean
  setEditable: React.Dispatch<React.SetStateAction<boolean>>
}

type UserEditableState = {
  userEditable: boolean
  setUserEditable: React.Dispatch<React.SetStateAction<boolean>>
}

type GenerateState = {
  generate: boolean
  setGenerate: React.Dispatch<React.SetStateAction<boolean>>
}

type SelectedAssetState = {
  selectedAsset: AssetType
  setSelectedAsset: (newAsset: AssetType) => void
}

type TransferAssetState = {
  transferAsset: AssetType
  setTransferAsset: (newAsset: AssetType) => void
}

type DisposeAssetState = {
  disposeAsset: AssetType
  setDisposeAsset: (newAsset: AssetType) => void
}

type RepairAssetState = {
  repairAsset: AssetType
  setRepairAsset: (newAsset: AssetType) => void
}

type SelectedEmpState = {
  selectedEmp: EmployeeType
  setSelectedEmp: (newEmployee: EmployeeType) => void
}

type DisposalStatusState = {
  status: string
  setStatus: (newStatus: string) => void
}
type RepairStatusState = {
  status: string
  setStatus: (newStatus: string) => void
}
type TransferStatusState = {
  status: string
  setStatus: (newStatus: string) => void
}

type SearchState = {
  search: string
  setSearch: (newSearch: string) => void
}

type counterValidateState = {
  counterCheck: boolean
  setCounterCheck: (counterStatus: boolean) => void
}
export const useEditableStore = create<EditableState>((set) => ({
  editable: false,
  setEditable: () => set((state) => ({ editable: !state.editable })),
}))

export const useUserEditableStore = create<UserEditableState>((set) => ({
  userEditable: false,
  setUserEditable: () => set((state) => ({ userEditable: !state.userEditable })),
}))

export const useGenerateStore = create<GenerateState>((set) => ({
  generate: false,
  setGenerate: () => set((state) => ({ generate: !state.generate })),
}))

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

export const useDisposeAssetStore = create<DisposeAssetState>((set) => ({
  disposeAsset: null,
  setDisposeAsset: (newAsset: AssetType) => set({ disposeAsset: newAsset }),
}))

export const useTransferAssetStore = create<TransferAssetState>((set) => ({
  transferAsset: null,
  setTransferAsset: (newAsset: AssetType) => set({ transferAsset: newAsset }),
}))

export const useRepairAssetStore = create<RepairAssetState>((set) => ({
  repairAsset: null,
  setRepairAsset: (newAsset: AssetType) => set({ repairAsset: newAsset }),
}))

export const useSelectedEmpStore = create<SelectedEmpState>((set) => ({
  selectedEmp: null,
  setSelectedEmp: (newEmployee: EmployeeType) => set({ selectedEmp: newEmployee }),
}))

export const useDisposalStatusStore = create<DisposalStatusState>((set) => ({
  status: "pending",
  setStatus: (newStatus: string) => set({ status: newStatus }),
}))

export const useRepairStatusStore = create<RepairStatusState>((set) => ({
  status: "pending",
  setStatus: (newStatus: string) => set({ status: newStatus }),
}))

export const useTranferStatusStore = create<TransferStatusState>((set) => ({
  status: "pending",
  setStatus: (newStatus: string) => set({ status: newStatus }),
}))

export const useSearchStore = create<SearchState>((set) => ({
  search: "",
  setSearch: (newSearch: string) => set({ search: newSearch }),
}))

export const useCounterValidateStore = create<counterValidateState>((set) => ({
  counterCheck: false,
  setCounterCheck: (counterStatus: boolean) => set({ counterCheck: counterStatus }),
}))