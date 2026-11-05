"use client"

import { useState } from "react"
import { Coins, Stamp } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { validateColor } from "@/lib/admin/program-form"
import type { Program } from "@/lib/admin/types"
import { createProgram } from "@/lib/cashier/mock-api"
import type { LoyaltyMode } from "@/lib/cashier/types"

import { ColorField } from "./color-field"

const OPTIONS: { value: LoyaltyMode; title: string; description: string; icon: typeof Coins }[] = [
  {
    value: "points",
    title: "Sistema de puntos",
    description: "El cliente suma puntos según el monto de cada compra.",
    icon: Coins,
  },
  {
    value: "stamps",
    title: "Sistema de sellos",
    description: "El cliente completa una cartilla de casilleros.",
    icon: Stamp,
  },
]

/**
 * Asistente inicial bloqueante: la modalidad es irrevocable, por eso el diálogo
 * no se puede cerrar hasta completar el paso.
 */
export function ProgramWizard({ onCreated }: { onCreated: (program: Program) => void }) {
  const [mode, setMode] = useState<LoyaltyMode | "">("")
  const [primaryColor, setPrimaryColor] = useState("#0f172a")
  const [secondaryColor, setSecondaryColor] = useState("#475569")
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const primaryError = validateColor(primaryColor) ?? undefined
  const secondaryError = validateColor(secondaryColor) ?? undefined
  const canContinue = mode !== "" && !primaryError && !secondaryError && !saving

  async function submit() {
    if (mode === "" || !canContinue) return
    setSaving(true)
    setFailed(false)
    try {
      onCreated(await createProgram(mode, { primaryColor, secondaryColor }))
    } catch {
      setFailed(true)
      setSaving(false)
    }
  }

  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Crear programa de fidelización</DialogTitle>
          <DialogDescription>
            Elija la modalidad y los colores de la tarjeta digital para continuar.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
        >
          <FieldSet>
            <FieldLegend variant="label">Modalidad</FieldLegend>
            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as LoyaltyMode)}
              className="grid gap-2 sm:grid-cols-2"
            >
              {OPTIONS.map(({ value, title, description, icon: Icon }) => (
                <label
                  key={value}
                  htmlFor={`mode-${value}`}
                  className="flex min-h-24 cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-foreground/20 has-data-checked:bg-primary has-data-checked:text-primary-foreground has-data-checked:ring-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                >
                  <RadioGroupItem id={`mode-${value}`} value={value} className="mt-1" />
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="size-4" aria-hidden="true" />
                      {title}
                    </span>
                    <span className="text-sm opacity-85">{description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </FieldSet>

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="wizard-primary"
              label="Color principal"
              value={primaryColor}
              error={primaryError}
              onChange={setPrimaryColor}
            />
            <ColorField
              id="wizard-secondary"
              label="Color secundario"
              value={secondaryColor}
              error={secondaryError}
              onChange={setSecondaryColor}
            />
          </div>

          <Alert className="px-4 py-3">
            <AlertTitle>La modalidad no se puede cambiar</AlertTitle>
            <AlertDescription>
              Quedará fija para este programa. El resto de reglas se completa después.
            </AlertDescription>
          </Alert>

          {failed && (
            <p role="alert" className="text-sm text-destructive">
              No se pudo crear el programa. Compruebe su conexión e inténtelo de nuevo.
            </p>
          )}

          <DialogFooter>
            <Button type="submit" size="lg" disabled={!canContinue} className="h-10 px-6">
              {saving ? (
                <>
                  <Spinner aria-hidden="true" />
                  Creando
                </>
              ) : (
                "Continuar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
