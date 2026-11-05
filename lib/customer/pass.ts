import { findClient } from "@/lib/cashier/mock-api"
import { NetworkError, type Client, type LoyaltyMode } from "@/lib/cashier/types"

export type LoadedPass = {
  client: Client
  /** Momento (ISO) en que se obtuvo el saldo desde el servidor. */
  updatedAt: string
  /** `true` si el saldo viene de la copia local por falta de conexión. */
  stale: boolean
  /** Sellos ganados desde la última vez que el cliente vio su pase. */
  newlyEarned: number
}

type CachedPass = { client: Client; updatedAt: string }

const cacheKey = (nationalId: string, mode: LoyaltyMode) =>
  `loyalty-pass:${nationalId}:${mode}`
const seenKey = (nationalId: string, mode: LoyaltyMode) =>
  `loyalty-pass-seen:${nationalId}:${mode}`

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* almacenamiento lleno o bloqueado: el pase sigue funcionando en línea */
  }
}

/** Marca el saldo que el cliente ya vio, para animar solo lo nuevo la próxima vez. */
export function markBalanceSeen(
  nationalId: string,
  mode: LoyaltyMode,
  balance: number,
) {
  writeJson(seenKey(nationalId, mode), balance)
}

/**
 * Carga el pase del cliente. Sin conexión devuelve la última copia local;
 * si tampoco existe, relanza el error para que la pantalla lo muestre.
 */
export async function loadPass(
  nationalId: string,
  mode: LoyaltyMode,
): Promise<LoadedPass> {
  try {
    const client = await findClient(nationalId, mode)
    if (!client) throw new Error("not-found")

    const updatedAt = new Date().toISOString()
    writeJson(cacheKey(nationalId, mode), { client, updatedAt })

    const seen = readJson<number>(seenKey(nationalId, mode))
    const newlyEarned =
      seen !== null && client.balance > seen ? client.balance - seen : 0
    return { client, updatedAt, stale: false, newlyEarned }
  } catch (error) {
    if (!(error instanceof NetworkError)) throw error
    const cached = readJson<CachedPass>(cacheKey(nationalId, mode))
    if (!cached) throw error
    return { ...cached, stale: true, newlyEarned: 0 }
  }
}
