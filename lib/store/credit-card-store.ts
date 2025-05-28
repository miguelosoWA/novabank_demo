import { create } from 'zustand'

interface CreditCardState {
  monthlyIncome: number
  employmentStatus: "empleado" | "independiente" | "empresario"
  yearsEmployed: number
  response: string
  setCreditCardData: (data: {
    monthlyIncome: number
    employmentStatus: "empleado" | "independiente" | "empresario"
    yearsEmployed: number
    response: string
  }) => void
  resetCreditCardData: () => void
}

export const useCreditCardStore = create<CreditCardState>((set) => ({
  monthlyIncome: 0,
  employmentStatus: "empleado",
  yearsEmployed: 0,
  response: "",
  setCreditCardData: (data) => set(data),
  resetCreditCardData: () => set({
    monthlyIncome: 0,
    employmentStatus: "empleado",
    yearsEmployed: 0,
    response: ""
  })
})) 