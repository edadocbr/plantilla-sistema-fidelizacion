"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useHotkeys } from "@/hooks/use-hotkeys"
import {
  fromDraft,
  MAX_STAMPS,
  MIN_STAMPS,
  toDraft,
  validateProgram,
  type ProgramDraft,
  type ProgramErrors,
} from "@/lib/admin/program-form"
import type { Program } from "@/lib/admin/types"
import { saveProgram } from "@/lib/cashier/mock-api"

import { useAdmin } from "./admin-context"
import { ColorField } from "./color-field"
import { ProgramStatusPanel, type Requirement } from "./program-status-panel"
import { ProgramWizard } from "./program-wizard"
import { RewardsEditor } from "./rewards-editor"

const FIELD_IDS: Record<string, string> = {
  primaryColor: "program-primary",
  secondaryColor: "program-secondary",
  currencyPerPoint: "currency-per-point",
  maxStamps: "max-stamps",
  cooldownHours: "cooldown-hours",
}

function focusFirstError(errors: ProgramErrors) {
  const key = Object.keys(errors).find((name) => FIELD_IDS[name])
  requestAnimationFrame(() => {
    if (key) document.getElementById(FIELD_IDS[key])?.focus()
    else document.getElementById("rewards-heading")?.scrollIntoView({ block: "nearest" })
  })
}

export function ProgramView() {
  const { program, setProgram } = useAdmin()

  if (program === undefined) return <Skeleton className="h-[32rem] w-full" />
  if (program === null) {
    return (
      <>
        <h1 className="sr-only">Programa de fidelización</h1>
        <ProgramWizard onCreated={setProgram} />
      </>
    )
  }
  return <ProgramForm key={program.id} program={program} onSaved={setProgram} />
}

function ProgramForm({
  program,
  onSaved,
}: {
  program: Program
  onSaved: (program: Program) => void
}) {
  const [saved, setSaved] = useState(() => JSON.stringify(toDraft(program)))
  const [draft, setDraft] = useState<ProgramDraft>(() => toDraft(program))
  const [errors, setErrors] = useState<ProgramErrors>({})
  const [saving, setSaving] = useState(false)

  const isPoints = program.mode === "points"
  const dirty = JSON.stringify(draft) !== saved
  const candidate = fromDraft(program, draft)

  const update = (patch: Partial<ProgramDraft>) => {
    setDraft((previous) => ({ ...previous, ...patch }))
    setErrors({})
  }

  const pending = validateProgram(candidate, true, draft)
  const requirements: Requirement[] = [
    { label: "Colores válidos", done: !pending.primaryColor && !pending.secondaryColor },
    isPoints
      ? { label: "Equivalencia de puntos", done: !pending.currencyPerPoint }
      : { label: "Total de casilleros", done: !pending.maxStamps },
    { label: "Tiempo de espera", done: !pending.cooldownHours },
    {
      label: "Al menos una recompensa completa",
      done:
        draft.rewards.length > 0 &&
        !Object.keys(pending).some((key) => key === "rewards" || key.startsWith("reward.")),
    },
  ]

  function toggleActive(next: boolean) {
    if (!next) {
      update({ active: false })
      return
    }
    const found = validateProgram(candidate, true, draft)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      focusFirstError(found)
      toast.error("Complete la configuración para activar el programa")
      return
    }
    update({ active: true })
  }

  async function save() {
    if (!dirty || saving) return
    const hard = validateProgram(candidate, false, draft)
    if (Object.keys(hard).length > 0) {
      setErrors(hard)
      focusFirstError(hard)
      return
    }

    const wantsActive = draft.active
    const found = wantsActive ? validateProgram(candidate, true, draft) : {}
    const incomplete = Object.keys(found).length > 0
    const nextDraft = incomplete ? { ...draft, active: false } : draft

    setSaving(true)
    try {
      const stored = await saveProgram(fromDraft(program, nextDraft))
      onSaved(stored)
      setDraft(nextDraft)
      setSaved(JSON.stringify(nextDraft))
      if (incomplete) {
        setErrors(found)
        focusFirstError(found)
        toast.warning("Se guardó como inactivo: faltan campos por completar")
      } else {
        setErrors({})
        toast.success(wantsActive ? "Programa activado" : "Cambios guardados")
      }
    } catch {
      toast.error("No se pudieron guardar los cambios. Compruebe su conexión")
    } finally {
      setSaving(false)
    }
  }

  useHotkeys({ "mod+s": () => void save() })

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <h1 className="sr-only">Programa de fidelización</h1>

      <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-2">
        <section aria-labelledby="mode-heading" className="flex flex-col gap-2">
          <h2 id="mode-heading" className="text-lg font-semibold">Modalidad</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="h-6 px-2.5 text-sm">
              {isPoints ? "Sistema de puntos" : "Sistema de sellos"}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Quedó fija al crear el programa y no se puede cambiar.
            </p>
          </div>
        </section>

        <Separator />

        <section aria-labelledby="identity-heading" className="flex flex-col gap-4">
          <h2 id="identity-heading" className="text-lg font-semibold">Identidad visual</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="program-primary"
              label="Color principal"
              value={draft.primaryColor}
              error={errors.primaryColor}
              description="Contraste mínimo de 3:1 con el blanco."
              onChange={(value) => update({ primaryColor: value })}
            />
            <ColorField
              id="program-secondary"
              label="Color secundario"
              value={draft.secondaryColor}
              error={errors.secondaryColor}
              onChange={(value) => update({ secondaryColor: value })}
            />
          </div>
          <div
            className="flex h-20 items-end justify-between rounded-xl p-4 text-sm font-medium text-white"
            style={{ backgroundColor: draft.primaryColor }}
            aria-label="Vista previa de la tarjeta digital"
            role="img"
          >
            <span>Tarjeta digital</span>
            <span
              className="h-2 w-16 rounded-full"
              style={{ backgroundColor: draft.secondaryColor }}
            />
          </div>
        </section>

        <Separator />

        <section aria-labelledby="accrual-heading" className="flex flex-col gap-4">
          <h2 id="accrual-heading" className="text-lg font-semibold">Acumulación</h2>
          {isPoints ? (
            <Field className="max-w-xs" data-invalid={errors.currencyPerPoint ? true : undefined}>
              <FieldLabel htmlFor="currency-per-point">Soles por punto</FieldLabel>
              <Input
                id="currency-per-point"
                inputMode="decimal"
                value={draft.currencyPerPoint}
                onChange={(event) =>
                  update({ currencyPerPoint: event.target.value.replace(/[^\d.,]/g, "") })
                }
                aria-invalid={errors.currencyPerPoint ? true : undefined}
                className="h-10 tabular-nums"
              />
              {errors.currencyPerPoint ? (
                <FieldError>{errors.currencyPerPoint}</FieldError>
              ) : (
                <FieldDescription>
                  Cada S/ {draft.currencyPerPoint || "X"} suma 1 punto; el sobrante se redondea hacia abajo.
                </FieldDescription>
              )}
            </Field>
          ) : (
            <Field className="max-w-xs" data-invalid={errors.maxStamps ? true : undefined}>
              <FieldLabel htmlFor="max-stamps">Total de casilleros</FieldLabel>
              <Input
                id="max-stamps"
                inputMode="numeric"
                value={draft.maxStamps}
                onChange={(event) =>
                  update({ maxStamps: event.target.value.replace(/\D/g, "") })
                }
                aria-invalid={errors.maxStamps ? true : undefined}
                className="h-10 tabular-nums"
              />
              {errors.maxStamps ? (
                <FieldError>{errors.maxStamps}</FieldError>
              ) : (
                <FieldDescription>
                  Entre {MIN_STAMPS} y {MAX_STAMPS} casilleros por cartilla.
                </FieldDescription>
              )}
            </Field>
          )}
        </section>

        <Separator />

        <section aria-labelledby="rewards-heading" className="flex flex-col gap-3">
          <h2 id="rewards-heading" className="text-lg font-semibold">Recompensas</h2>
          <RewardsEditor
            mode={program.mode}
            maxStamps={candidate.maxStamps}
            rewards={draft.rewards}
            errors={errors}
            onChange={(rewards) => update({ rewards })}
          />
        </section>

        <Separator />

        <section aria-labelledby="security-heading" className="flex flex-col gap-4">
          <h2 id="security-heading" className="text-lg font-semibold">Seguridad</h2>
          <Field className="max-w-xs" data-invalid={errors.cooldownHours ? true : undefined}>
            <FieldLabel htmlFor="cooldown-hours">Cooldown (horas)</FieldLabel>
            <Input
              id="cooldown-hours"
              inputMode="decimal"
              value={draft.cooldownHours}
              onChange={(event) =>
                update({ cooldownHours: event.target.value.replace(/[^\d.,]/g, "") })
              }
              aria-invalid={errors.cooldownHours ? true : undefined}
              className="h-10 tabular-nums"
            />
            {errors.cooldownHours ? (
              <FieldError>{errors.cooldownHours}</FieldError>
            ) : (
              <FieldDescription>
                Espera obligatoria entre registros consecutivos de un mismo cliente.
              </FieldDescription>
            )}
          </Field>
        </section>
      </div>

      <div className="order-1 lg:order-2">
        <ProgramStatusPanel
          active={draft.active}
          qrValue={program.qrValue}
          requirements={requirements}
          dirty={dirty}
          saving={saving}
          onToggleActive={toggleActive}
          onSave={() => void save()}
        />
      </div>
    </div>
  )
}
