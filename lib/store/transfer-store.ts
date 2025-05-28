import { create } from 'zustand'

interface TransferState {
  destinationAccount: string
  amount: number
  description: string
  response: string
  setTransferData: (data: {
    destinationAccount: string
    amount: number
    description: string
    response: string
  }) => void
  resetTransferData: () => void
}

export const useTransferStore = create<TransferState>((set) => ({
  destinationAccount: '',
  amount: 0,
  description: '',
  response: '',
  setTransferData: (data) => set(data),
  resetTransferData: () => set({
    destinationAccount: '',
    amount: 0,
    description: '',
    response: ''
  })
})) 