import type { LoyaltyMode } from "@/lib/cashier/types"

export type OperationType = "register" | "redeem"

export type Operation = {
  id: string
  /** Momento de la operación (ISO). */
  at: string
  type: OperationType
  nationalId: string
  customerName: string
  cashier: string
  /** Puntos o sellos sumados (registro) o descontados (canje). */
  amount: number
}

export type CustomerStatus = "active" | "inactive"

export type CustomerRow = {
  nationalId: string
  name: string
  /** Fecha ISO (yyyy-mm-dd). */
  enrolledAt: string
  balance: number
  lastOperationAt: string | null
  /** Activo = al menos una operación en los últimos 30 días. */
  status: CustomerStatus
}

export type CustomerDetail = {
  customer: CustomerRow
  history: Operation[]
  duplicateAlerts: string[]
}

export type Granularity = "day" | "month" | "year"

/** Rango inclusivo de fechas (yyyy-mm-dd). */
export type DateRange = { from: string; to: string }

export type SeriesPoint = {
  key: string
  label: string
  issued: number
  redeemed: number
}

export type OverviewData = {
  enrolled: number
  active: number
  issued: number
  redeemed: number
  rewardsDelivered: number
  cardsCompleted: number
  /** Canjeado ÷ emitido, entre 0 y 1. */
  redemptionRate: number
  series: SeriesPoint[]
  activity: Operation[]
  /** Operaciones dentro del rango; 0 activa el estado vacío. */
  operationCount: number
}

export type ProgramReward = {
  id: string
  name: string
  /** Puntos necesarios (modo puntos) o número de sello del hito (modo sellos). */
  threshold: number | null
  /** Vigencia opcional (yyyy-mm-dd); sin fechas la recompensa es permanente. */
  validFrom: string | null
  validUntil: string | null
}

export type Program = {
  id: string
  /** Fija desde la creación; no se puede cambiar. */
  mode: LoyaltyMode
  active: boolean
  primaryColor: string
  secondaryColor: string
  /** Soles por punto (solo modo puntos). */
  currencyPerPoint: number | null
  /** Casilleros de la cartilla (solo modo sellos). */
  maxStamps: number | null
  /** Espera obligatoria entre registros de un mismo cliente. */
  cooldownHours: number | null
  rewards: ProgramReward[]
  /** Contenido del QR de inscripción del programa. */
  qrValue: string
}
