import { create } from 'zustand'

interface TransferState {
  nombreDestinatario: string
  amount: number
  description: string
  response: string
  setTransferData: (data: {
    nombreDestinatario: string
    amount: number
    description: string
    response: string
  }) => void
  resetTransferData: () => void
}

export const useTransferStore = create<TransferState>((set) => ({
  nombreDestinatario: '',
  amount: 0,
  description: '',
  response: '',
  setTransferData: (data) => set(data),
  resetTransferData: () => set({
    nombreDestinatario: '',
    amount: 0,
    description: '',
    response: ''
  })
})) 