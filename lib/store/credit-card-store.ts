import { create } from 'zustand'

interface CreditCardState {
  monthlyIncome: number
  employmentStatus: "empleado" | "independiente" | "empresario"
  timeEmployed: string
  response: string
  setCreditCardData: (data: {
    monthlyIncome: number
    employmentStatus: "empleado" | "independiente" | "empresario"
    timeEmployed: string
    response: string
  }) => void
  resetCreditCardData: () => void
}

export const useCreditCardStore = create<CreditCardState>((set) => ({
  monthlyIncome: 0,
  employmentStatus: "empleado",
  timeEmployed: "",
  response: "",
  setCreditCardData: (data) => set(data),
  resetCreditCardData: () => set({
    monthlyIncome: 0,
    employmentStatus: "empleado",
    timeEmployed: "",
    response: ""
  })
})) 