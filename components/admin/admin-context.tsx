"use client"

import { createContext, useContext } from "react"

import type { Program } from "@/lib/admin/types"
import type { LoyaltyMode } from "@/lib/cashier/types"

type AdminContextValue = {
  /** Modalidad que se está supervisando (`?mode=` en las rutas de prueba). */
  mode: LoyaltyMode
  /** `undefined` mientras carga; `null` si el comercio aún no tiene programa. */
  program: Program | null | undefined
  setProgram: (program: Program) => void
  /** Consulta actual de la URL, para conservar `?mode=` al navegar. */
  query: string
}

export const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const value = useContext(AdminContext)
  if (!value) throw new Error("useAdmin debe usarse dentro de AdminShell")
  return value
}
