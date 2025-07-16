import { create } from 'zustand'

interface FICState {
  firstName: string
  lastName: string
  email: string
  amount: string
  accountNumber: string
  accountType: string
  phoneNumber: string
  address: string
  city: string
  state: string
  setFICData: (data: {
    firstName: string
    lastName: string
    email: string
    amount: string
    accountNumber: string
    accountType: string
    phoneNumber: string
    address: string
    city: string
    state: string
  }) => void
  resetFICData: () => void
}

export const useFICStore = create<FICState>((set) => ({
  firstName: "Carlos Alberto",
  lastName: "Valderrama Palacio",
  email: "carlos@sofka.com.co",
  amount: "25630000",
  accountNumber: "194839203",
  accountType: "Ahorros",
  phoneNumber: "312 541 8596",
  address: "Cr 41 No. 40BS-09",
  city: "Envigado",
  state: "Antioquia",
  setFICData: (data) => set(data),
  resetFICData: () => set({
    firstName: "Carlos Alberto",
    lastName: "Valderrama Palacio",
    email: "carlos@sofka.com.co",
    amount: "25630000",
    accountNumber: "194839203",
    accountType: "Ahorros",
    phoneNumber: "312 541 8596",
    address: "Cr 41 No. 40BS-09",
    city: "Envigado",
    state: "Antioquia",
  })
})) 