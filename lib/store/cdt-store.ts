import { create } from 'zustand'

interface CDTState {
  firstName: string
  lastName: string
  email: string
  amount: string
  accountNumber: string
  accountType: string
  phoneNumber: string
  cdtTerm: string
  renewalType: string
  identificationType: string
  setCDTData: (data: {
    firstName: string
    lastName: string
    email: string
    amount: string
    accountNumber: string
    accountType: string
    phoneNumber: string
    cdtTerm: string
    renewalType: string
    identificationType: string
  }) => void
  resetCDTData: () => void
}

export const useCDTStore = create<CDTState>((set) => ({
  firstName: "Carlos Alberto",
  lastName: "Valderrama Palacio",
  email: "carlos@sofka.com.co",
  amount: "12536200",
  accountNumber: "194839203",
  accountType: "Ahorros",
  phoneNumber: "312 541 8596",
  cdtTerm: "180",
  renewalType: "Capital + Intereses",
  identificationType: "Cédula de Ciudadanía",
  setCDTData: (data) => set(data),
  resetCDTData: () => set({
    firstName: "Carlos Alberto",
    lastName: "Valderrama Palacio",
    email: "carlos@sofka.com.co",
    amount: "12536200",
    accountNumber: "194839203",
    accountType: "Ahorros",
    phoneNumber: "312 541 8596",
    cdtTerm: "180",
    renewalType: "Capital + Intereses",
    identificationType: "Cédula de Ciudadanía",
  })
})) 