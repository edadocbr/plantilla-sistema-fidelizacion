export type LoyaltyMode = "points" | "stamps"

export type Reward = {
  id: string
  name: string
  /** Puntos o sellos que se descuentan al canjear. */
  cost: number
}

export type Client = {
  nationalId: string
  name: string
  /** Fecha ISO (yyyy-mm-dd). */
  enrolledAt: string
  balance: number
}

export class NetworkError extends Error {
  constructor() {
    super("network")
    this.name = "NetworkError"
  }
}
