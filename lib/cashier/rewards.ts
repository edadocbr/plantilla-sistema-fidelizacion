import type { LoyaltyMode, Reward } from "./types"

/** Sellos que completan una cartilla si el comercio no configura otro valor. */
export const DEFAULT_MAX_STAMPS = 10

/** Catálogo de ejemplo. En producción lo define el Administrador (tarea 5). */
export function defaultRewards(
  mode: LoyaltyMode,
  maxStamps = DEFAULT_MAX_STAMPS,
): Reward[] {
  if (mode === "stamps") {
    return [{ id: "stamp-1", name: "Producto gratis", cost: maxStamps }]
  }
  return [
    { id: "points-500", name: "Café gratis", cost: 500 },
    { id: "points-1000", name: "Descuento de S/ 10", cost: 1000 },
    { id: "points-2000", name: "Combo familiar", cost: 2000 },
  ]
}

export function eligibleRewards(rewards: Reward[], balance: number) {
  return rewards.filter((r) => balance >= r.cost)
}

export function nextReward(rewards: Reward[], balance: number) {
  return [...rewards]
    .sort((a, b) => a.cost - b.cost)
    .find((r) => balance < r.cost)
}

/** Extrae un DNI de 8 dígitos del contenido del QR (texto plano, con prefijo o URL). */
export function extractNationalId(raw: string): string | null {
  return raw.match(/(?<!\d)\d{8}(?!\d)/)?.[0] ?? null
}
