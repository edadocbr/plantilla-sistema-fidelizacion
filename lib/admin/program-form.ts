import type { LoyaltyMode } from "@/lib/cashier/types"

import { contrastRatio, isHexColor, MIN_COLOR_CONTRAST } from "./color"
import type { Program, ProgramReward } from "./types"

/** Valores del formulario: los números viajan como texto para permitir campos vacíos. */
export type RewardDraft = {
  id: string
  name: string
  threshold: string
  validFrom: string
  validUntil: string
}

export type ProgramDraft = {
  active: boolean
  primaryColor: string
  secondaryColor: string
  currencyPerPoint: string
  maxStamps: string
  cooldownHours: string
  rewards: RewardDraft[]
}

/** Errores por clave de campo (`primaryColor`, `rewards`, `reward.<id>.threshold`…). */
export type ProgramErrors = Record<string, string>

const WHITE = "#ffffff"
export const MIN_STAMPS = 5
export const MAX_STAMPS = 20

export function toDraft(program: Program): ProgramDraft {
  const text = (value: number | null) => (value === null ? "" : String(value))
  return {
    active: program.active,
    primaryColor: program.primaryColor,
    secondaryColor: program.secondaryColor,
    currencyPerPoint: text(program.currencyPerPoint),
    maxStamps: text(program.maxStamps),
    cooldownHours: text(program.cooldownHours),
    rewards: program.rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      threshold: text(reward.threshold),
      validFrom: reward.validFrom ?? "",
      validUntil: reward.validUntil ?? "",
    })),
  }
}

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."))
  return value.trim() !== "" && Number.isFinite(parsed) ? parsed : null
}

export function fromDraft(base: Program, draft: ProgramDraft): Program {
  const rewards: ProgramReward[] = draft.rewards.map((reward) => ({
    id: reward.id,
    name: reward.name.trim(),
    threshold: toNumber(reward.threshold),
    validFrom: reward.validFrom || null,
    validUntil: reward.validUntil || null,
  }))
  return {
    ...base,
    active: draft.active,
    primaryColor: draft.primaryColor,
    secondaryColor: draft.secondaryColor,
    currencyPerPoint: base.mode === "points" ? toNumber(draft.currencyPerPoint) : null,
    maxStamps: base.mode === "stamps" ? toNumber(draft.maxStamps) : null,
    cooldownHours: toNumber(draft.cooldownHours),
    rewards,
  }
}

export function validateColor(value: string) {
  if (!isHexColor(value)) return "Ingrese un color válido (por ejemplo #0f172a)"
  if (contrastRatio(value, WHITE) < MIN_COLOR_CONTRAST) {
    return "El color es muy claro: necesita un contraste mínimo de 3:1 con el blanco"
  }
  return null
}

export function validateReward(
  reward: RewardDraft,
  mode: LoyaltyMode,
  maxStamps: number | null,
  required: boolean,
): ProgramErrors {
  const errors: ProgramErrors = {}
  const key = (field: string) => `reward.${reward.id}.${field}`
  const threshold = toNumber(reward.threshold)

  if (required && reward.name.trim() === "") {
    errors[key("name")] = "Ingrese el nombre de la recompensa"
  }
  if (threshold === null) {
    if (required) {
      errors[key("threshold")] =
        mode === "points" ? "Ingrese los puntos necesarios" : "Ingrese el sello del hito"
    }
  } else if (!Number.isInteger(threshold) || threshold < 1) {
    errors[key("threshold")] = "Ingrese un número entero mayor a 0"
  } else if (mode === "stamps" && maxStamps !== null && threshold > maxStamps) {
    errors[key("threshold")] = `El hito no puede superar los ${maxStamps} casilleros`
  }
  if (reward.validFrom && reward.validUntil && reward.validUntil < reward.validFrom) {
    errors[key("validity")] = "La fecha final no puede ser anterior a la inicial"
  }
  return errors
}

/**
 * Valida el programa. Sin `forActivation` solo se rechaza lo inconsistente
 * (se puede guardar incompleto como Inactivo); con él también se exige lo faltante.
 */
export function validateProgram(
  program: Program,
  forActivation: boolean,
  draft: ProgramDraft,
): ProgramErrors {
  const errors: ProgramErrors = {}

  for (const field of ["primaryColor", "secondaryColor"] as const) {
    const message = validateColor(program[field])
    if (message) errors[field] = message
  }

  if (program.mode === "points") {
    if (program.currencyPerPoint === null) {
      if (forActivation) errors.currencyPerPoint = "Ingrese cuántos soles equivalen a 1 punto"
    } else if (program.currencyPerPoint <= 0) {
      errors.currencyPerPoint = "Ingrese un valor mayor a 0"
    }
  } else if (program.maxStamps === null) {
    if (forActivation) errors.maxStamps = "Ingrese el total de casilleros"
  } else if (
    !Number.isInteger(program.maxStamps) ||
    program.maxStamps < MIN_STAMPS ||
    program.maxStamps > MAX_STAMPS
  ) {
    errors.maxStamps = `Use entre ${MIN_STAMPS} y ${MAX_STAMPS} casilleros`
  }

  if (program.cooldownHours === null) {
    if (forActivation) errors.cooldownHours = "Ingrese el tiempo de espera entre registros"
  } else if (program.cooldownHours <= 0 || program.cooldownHours > 72) {
    errors.cooldownHours = "Use un valor entre 0.5 y 72 horas"
  }

  if (forActivation && draft.rewards.length === 0) {
    errors.rewards = "Debe configurar al menos una recompensa para activar el programa"
  }
  for (const reward of draft.rewards) {
    Object.assign(
      errors,
      validateReward(reward, program.mode, program.maxStamps, forActivation),
    )
  }
  return errors
}
