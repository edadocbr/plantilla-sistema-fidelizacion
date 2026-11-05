import type {
  CustomerDetail,
  CustomerRow,
  DateRange,
  Granularity,
  Operation,
  OverviewData,
  Program,
  SeriesPoint,
} from "@/lib/admin/types"

import { NetworkError, type Client, type LoyaltyMode } from "./types"

/**
 * Backend simulado para prototipar Caja, Cliente y Administración.
 * Sustituir por llamadas reales; la firma de cada función es el contrato esperado.
 * Con el navegador en modo sin conexión (DevTools > Network > Offline) toda
 * llamada falla con NetworkError, para probar los estados de error.
 * Los datos viven en memoria de cada pestaña y se generan con una semilla fija.
 */

type Row = {
  name: string
  enrolledAt: string
  balances: Record<LoyaltyMode, number>
}

const DAY_MS = 86_400_000
const NOW = Date.now()
const ACTIVE_WINDOW_DAYS = 30
const DEFAULT_COOLDOWN_HOURS = 2
const CASHIERS = ["Lucía Mamani", "Marco Pérez", "Carla Ríos"]

const DB: Record<string, Row> = {
  "70123456": {
    name: "Ana Torres Quispe",
    enrolledAt: "2025-03-14",
    balances: { points: 1240, stamps: 6 },
  },
  "45879632": {
    name: "Luis Mendoza Rojas",
    enrolledAt: "2026-01-09",
    balances: { points: 380, stamps: 7 },
  },
  "12345678": {
    name: "Rosa Huamán Cruz",
    enrolledAt: "2024-11-02",
    balances: { points: 2150, stamps: 10 },
  },
}

const OPERATIONS: Record<LoyaltyMode, Operation[]> = { points: [], stamps: [] }

// --- Datos de ejemplo --------------------------------------------------------

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function toDateKey(time: number) {
  const date = new Date(time)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

const FIRST_NAMES = [
  "Camila", "Diego", "Valeria", "Jorge", "Lucía", "Mateo", "Sofía", "Andrés",
  "Fernanda", "Renzo", "Daniela", "Gustavo", "Paola", "Álvaro", "Milagros",
]
const LAST_NAMES = [
  "Quispe", "Flores", "Ramírez", "Chávez", "Vargas", "Castillo", "Rojas",
  "Mamani", "Salazar", "Paredes", "Gómez", "Cárdenas", "Huamán", "Soto",
]

function seedCustomers() {
  const rand = mulberry32(7)
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]
  while (Object.keys(DB).length < 48) {
    const nationalId = String(40000000 + Math.floor(rand() * 50000000))
    if (DB[nationalId]) continue
    DB[nationalId] = {
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)} ${pick(LAST_NAMES)}`,
      enrolledAt: toDateKey(NOW - Math.floor(rand() * 400) * DAY_MS),
      balances: { points: 0, stamps: 0 },
    }
  }
}

function seedOperations(mode: LoyaltyMode) {
  const rand = mulberry32(mode === "points" ? 11 : 23)
  const redeemCost = mode === "points" ? 500 : 10
  const preset = new Set(["70123456", "45879632", "12345678"])
  const operations: Operation[] = []

  for (const [nationalId, row] of Object.entries(DB)) {
    const enrolled = new Date(`${row.enrolledAt}T00:00:00`).getTime()
    const spanDays = Math.max(1, (NOW - enrolled) / DAY_MS)
    const visits = Math.floor(2 + rand() * Math.min(30, spanDays / 6))
    const moments = Array.from(
      { length: visits },
      () => enrolled + rand() * spanDays * DAY_MS,
    ).sort((a, b) => a - b)
    let balance = 0

    for (const moment of moments) {
      const at = new Date(moment)
      at.setHours(8 + Math.floor(rand() * 13), Math.floor(rand() * 60))
      const time = Math.min(at.getTime(), NOW - 60_000)
      const amount = mode === "points" ? Math.floor(10 + rand() * 90) : 1
      const cashier = CASHIERS[Math.floor(rand() * CASHIERS.length)]
      const base = { nationalId, customerName: row.name, cashier }

      operations.push({
        ...base,
        id: "",
        at: new Date(time).toISOString(),
        type: "register",
        amount,
      })
      balance += amount

      if (balance >= redeemCost && rand() < 0.6) {
        operations.push({
          ...base,
          id: "",
          at: new Date(time + 60_000).toISOString(),
          type: "redeem",
          amount: redeemCost,
        })
        balance -= redeemCost
      }
    }
    if (!preset.has(nationalId)) row.balances[mode] = balance
  }

  // Algunos registros repetidos en pocos minutos, para la alerta de duplicados.
  const registers = operations.filter((op) => op.type === "register")
  for (let index = 0; index < 6; index++) {
    const source = registers[Math.floor(rand() * registers.length)]
    operations.push({
      ...source,
      at: new Date(new Date(source.at).getTime() + 25 * 60_000).toISOString(),
    })
  }

  operations.sort((a, b) => a.at.localeCompare(b.at))
  OPERATIONS[mode] = operations.map((op, index) => ({
    ...op,
    id: `op-${mode}-${index}`,
  }))
}

seedCustomers()
seedOperations("points")
seedOperations("stamps")

function seedProgram(mode: LoyaltyMode): Program {
  const isPoints = mode === "points"
  return {
    id: `program-${mode}`,
    mode,
    active: true,
    primaryColor: "#0f172a",
    secondaryColor: "#475569",
    currencyPerPoint: isPoints ? 1 : null,
    maxStamps: isPoints ? null : 10,
    cooldownHours: DEFAULT_COOLDOWN_HOURS,
    rewards: isPoints
      ? [
          { id: "reward-1", name: "Café gratis", threshold: 500, validFrom: null, validUntil: null },
          { id: "reward-2", name: "Descuento de S/ 10", threshold: 1000, validFrom: null, validUntil: null },
          { id: "reward-3", name: "Combo familiar", threshold: 2000, validFrom: "2026-01-01", validUntil: "2026-12-31" },
        ]
      : [
          { id: "reward-1", name: "Producto gratis", threshold: 10, validFrom: null, validUntil: null },
        ],
    qrValue: `program:program-${mode}`,
  }
}

const PROGRAMS: Record<LoyaltyMode, Program | null> = {
  points: seedProgram("points"),
  stamps: seedProgram("stamps"),
}

// --- Red simulada -------------------------------------------------------------

const LATENCY_MS = 350

async function roundTrip() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new NetworkError()
  }
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new NetworkError()
  }
}

export async function findClient(
  nationalId: string,
  mode: LoyaltyMode,
): Promise<Client | null> {
  await roundTrip()
  const row = DB[nationalId]
  if (!row) return null
  return {
    nationalId,
    name: row.name,
    enrolledAt: row.enrolledAt,
    balance: row.balances[mode],
  }
}

/** Suma `delta` puntos o sellos y devuelve el saldo actualizado. */
export async function registerPurchase(
  nationalId: string,
  mode: LoyaltyMode,
  delta: number,
): Promise<number> {
  await roundTrip()
  const row = DB[nationalId]
  row.balances[mode] += delta
  recordOperation(mode, nationalId, "register", delta)
  return row.balances[mode]
}

/** Descuenta `cost` puntos o sellos y devuelve el saldo actualizado. */
export async function redeemReward(
  nationalId: string,
  mode: LoyaltyMode,
  cost: number,
): Promise<number> {
  await roundTrip()
  const row = DB[nationalId]
  row.balances[mode] -= cost
  recordOperation(mode, nationalId, "redeem", cost)
  return row.balances[mode]
}

/** Anota la operación hecha desde Caja para que Administración la vea. */
function recordOperation(
  mode: LoyaltyMode,
  nationalId: string,
  type: Operation["type"],
  amount: number,
) {
  OPERATIONS[mode].push({
    id: `op-${mode}-${OPERATIONS[mode].length}`,
    at: new Date().toISOString(),
    type,
    nationalId,
    customerName: DB[nationalId].name,
    cashier: CASHIERS[0],
    amount,
  })
}

// --- Administración -----------------------------------------------------------

function lastOperationAt(mode: LoyaltyMode, nationalId: string) {
  const operations = OPERATIONS[mode]
  for (let index = operations.length - 1; index >= 0; index--) {
    if (operations[index].nationalId === nationalId) return operations[index].at
  }
  return null
}

function toCustomerRow(mode: LoyaltyMode, nationalId: string): CustomerRow {
  const row = DB[nationalId]
  const last = lastOperationAt(mode, nationalId)
  const active =
    last !== null &&
    NOW - new Date(last).getTime() <= ACTIVE_WINDOW_DAYS * DAY_MS
  return {
    nationalId,
    name: row.name,
    enrolledAt: row.enrolledAt,
    balance: row.balances[mode],
    lastOperationAt: last,
    status: active ? "active" : "inactive",
  }
}

export async function listCustomers(mode: LoyaltyMode): Promise<CustomerRow[]> {
  await roundTrip()
  return Object.keys(DB).map((nationalId) => toCustomerRow(mode, nationalId))
}

export async function getCustomerDetail(
  mode: LoyaltyMode,
  nationalId: string,
): Promise<CustomerDetail | null> {
  await roundTrip()
  if (!DB[nationalId]) return null
  const own = OPERATIONS[mode].filter((op) => op.nationalId === nationalId)
  const cooldownMs =
    (PROGRAMS[mode]?.cooldownHours ?? DEFAULT_COOLDOWN_HOURS) * 3_600_000

  const alerts: string[] = []
  const registers = own.filter((op) => op.type === "register")
  for (let index = 1; index < registers.length; index++) {
    const gap =
      new Date(registers[index].at).getTime() -
      new Date(registers[index - 1].at).getTime()
    if (gap < cooldownMs) {
      alerts.push(registers[index].at)
    }
  }

  return {
    customer: toCustomerRow(mode, nationalId),
    history: own.slice(-8).reverse(),
    duplicateAlerts: alerts.slice(-3).reverse(),
  }
}

const MONTH_LABELS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

function bucketOf(date: Date, granularity: Granularity) {
  const year = date.getFullYear()
  const month = date.getMonth()
  if (granularity === "year") return { key: String(year), label: String(year) }
  if (granularity === "month") {
    return {
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: `${MONTH_LABELS[month]} ${year}`,
    }
  }
  const day = date.getDate()
  return { key: toDateKey(date.getTime()), label: `${day} ${MONTH_LABELS[month]}` }
}

export async function getOverview(
  mode: LoyaltyMode,
  range: DateRange,
  granularity: Granularity,
): Promise<OverviewData> {
  await roundTrip()
  const from = new Date(`${range.from}T00:00:00`).getTime()
  const to = new Date(`${range.to}T23:59:59`).getTime()
  const maxStamps = PROGRAMS[mode]?.maxStamps ?? 10

  const inRange = OPERATIONS[mode].filter((op) => {
    const time = new Date(op.at).getTime()
    return time >= from && time <= to
  })

  // Se crean los cubos vacíos del rango para que el gráfico no tenga huecos.
  const buckets = new Map<string, SeriesPoint>()
  for (let time = from; time <= to; time += DAY_MS) {
    const { key, label } = bucketOf(new Date(time), granularity)
    if (!buckets.has(key)) buckets.set(key, { key, label, issued: 0, redeemed: 0 })
  }

  let issued = 0
  let redeemed = 0
  let rewardsDelivered = 0
  for (const op of inRange) {
    const { key, label } = bucketOf(new Date(op.at), granularity)
    const bucket = buckets.get(key) ?? { key, label, issued: 0, redeemed: 0 }
    buckets.set(key, bucket)
    if (op.type === "register") {
      issued += op.amount
      bucket.issued += op.amount
    } else {
      redeemed += op.amount
      rewardsDelivered += 1
      bucket.redeemed += op.amount
    }
  }

  const activeIds = new Set<string>()
  for (const op of OPERATIONS[mode]) {
    if (NOW - new Date(op.at).getTime() <= ACTIVE_WINDOW_DAYS * DAY_MS) {
      activeIds.add(op.nationalId)
    }
  }

  return {
    enrolled: Object.values(DB).filter(
      (row) => new Date(`${row.enrolledAt}T00:00:00`).getTime() <= to,
    ).length,
    active: activeIds.size,
    issued,
    redeemed,
    rewardsDelivered,
    cardsCompleted: Math.floor(issued / maxStamps),
    redemptionRate: issued > 0 ? Math.min(1, redeemed / issued) : 0,
    series: [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key)),
    activity: [...inRange].reverse().slice(0, 10),
    operationCount: inRange.length,
  }
}

export async function getProgram(mode: LoyaltyMode): Promise<Program | null> {
  await roundTrip()
  return PROGRAMS[mode]
}

/** Crea el programa en estado inactivo con la modalidad elegida (irrevocable). */
export async function createProgram(
  mode: LoyaltyMode,
  colors: { primaryColor: string; secondaryColor: string },
): Promise<Program> {
  await roundTrip()
  const program: Program = {
    id: `program-${mode}`,
    mode,
    active: false,
    ...colors,
    currencyPerPoint: null,
    maxStamps: null,
    cooldownHours: null,
    rewards: [],
    qrValue: `program:program-${mode}`,
  }
  PROGRAMS[mode] = program
  return program
}

export async function saveProgram(program: Program): Promise<Program> {
  await roundTrip()
  PROGRAMS[program.mode] = program
  return program
}
