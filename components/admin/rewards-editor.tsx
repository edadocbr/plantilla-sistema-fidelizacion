"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2, TriangleAlert } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/admin/format"
import {
  validateReward,
  type ProgramErrors,
  type RewardDraft,
} from "@/lib/admin/program-form"
import type { LoyaltyMode } from "@/lib/cashier/types"

type Props = {
  mode: LoyaltyMode
  maxStamps: number | null
  rewards: RewardDraft[]
  errors: ProgramErrors
  onChange: (rewards: RewardDraft[]) => void
}

const EMPTY: Omit<RewardDraft, "id"> = {
  name: "",
  threshold: "",
  validFrom: "",
  validUntil: "",
}

function validityLabel(reward: RewardDraft) {
  if (!reward.validFrom && !reward.validUntil) return "Permanente"
  if (reward.validFrom && reward.validUntil) {
    return `${formatDate(reward.validFrom)} – ${formatDate(reward.validUntil)}`
  }
  return reward.validFrom
    ? `Desde ${formatDate(reward.validFrom)}`
    : `Hasta ${formatDate(reward.validUntil)}`
}

export function RewardsEditor({ mode, maxStamps, rewards, errors, onChange }: Props) {
  const [editing, setEditing] = useState<RewardDraft | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [sheetErrors, setSheetErrors] = useState<ProgramErrors>({})
  const [toDelete, setToDelete] = useState<RewardDraft | null>(null)

  const thresholdLabel = mode === "points" ? "Puntos necesarios" : "Sello del hito"

  function openNew() {
    setEditing({ id: crypto.randomUUID(), ...EMPTY })
    setIsNew(true)
    setSheetErrors({})
  }

  function openEdit(reward: RewardDraft) {
    setEditing(reward)
    setIsNew(false)
    setSheetErrors({})
  }

  function submit() {
    if (!editing) return
    const found = validateReward(editing, mode, maxStamps, true)
    if (Object.keys(found).length > 0) {
      setSheetErrors(found)
      return
    }
    onChange(
      isNew
        ? [...rewards, editing]
        : rewards.map((reward) => (reward.id === editing.id ? editing : reward)),
    )
    setEditing(null)
  }

  const field = (name: "name" | "threshold" | "validity") => (editing ? sheetErrors[`reward.${editing.id}.${name}`] : undefined)

  return (
    <div className="flex flex-col gap-3">
      {rewards.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay recompensas.</p>
      ) : (
        <div className="rounded-xl ring-1 ring-foreground/10">
          <Table>
            <caption className="sr-only">Recompensas del programa</caption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Recompensa</TableHead>
                <TableHead scope="col">{thresholdLabel}</TableHead>
                <TableHead scope="col" className="hidden md:table-cell">Vigencia</TableHead>
                <TableHead scope="col" className="w-28">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => {
                const rowErrors = Object.entries(errors)
                  .filter(([key]) => key.startsWith(`reward.${reward.id}.`))
                  .map(([, message]) => message)
                return (
                  <TableRow key={reward.id} className="h-11 align-top">
                    <TableCell className="font-medium">
                      {reward.name || "Sin nombre"}
                      {rowErrors.map((message) => (
                        <p key={message} className="flex items-center gap-1 text-sm font-normal text-destructive">
                          <TriangleAlert className="size-3.5" aria-hidden="true" />
                          {message}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell className="tabular-nums">{reward.threshold || "—"}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {validityLabel(reward)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-10"
                          aria-label={`Editar ${reward.name || "recompensa"}`}
                          onClick={() => openEdit(reward)}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-10"
                          aria-label={`Eliminar ${reward.name || "recompensa"}`}
                          onClick={() => setToDelete(reward)}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {errors.rewards && (
        <p role="alert" className="flex items-center gap-1 text-sm text-destructive">
          <TriangleAlert className="size-4" aria-hidden="true" />
          {errors.rewards}
        </p>
      )}

      <Button variant="outline" className="h-10 w-fit gap-2 px-4" onClick={openNew}>
        <Plus aria-hidden="true" />
        Añadir recompensa
      </Button>

      <Sheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-[420px]">
          <SheetHeader className="border-b p-4">
            <SheetTitle>{isNew ? "Nueva recompensa" : "Editar recompensa"}</SheetTitle>
            <SheetDescription>
              Sin fechas de vigencia, la recompensa es permanente.
            </SheetDescription>
          </SheetHeader>

          {editing && (
            <form
              id="reward-form"
              className="flex flex-col gap-4 p-4"
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                submit()
              }}
            >
              <Field data-invalid={field("name") ? true : undefined}>
                <FieldLabel htmlFor="reward-name">Nombre</FieldLabel>
                <Input
                  id="reward-name"
                  value={editing.name}
                  onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                  autoComplete="off"
                  aria-invalid={field("name") ? true : undefined}
                  className="h-10"
                />
                {field("name") && <FieldError>{field("name")}</FieldError>}
              </Field>

              <Field data-invalid={field("threshold") ? true : undefined}>
                <FieldLabel htmlFor="reward-threshold">{thresholdLabel}</FieldLabel>
                <Input
                  id="reward-threshold"
                  inputMode="numeric"
                  value={editing.threshold}
                  onChange={(event) =>
                    setEditing({ ...editing, threshold: event.target.value.replace(/\D/g, "") })
                  }
                  aria-invalid={field("threshold") ? true : undefined}
                  className="h-10 tabular-nums"
                />
                {mode === "stamps" && maxStamps !== null && !field("threshold") && (
                  <FieldDescription>De 1 a {maxStamps} casilleros.</FieldDescription>
                )}
                {field("threshold") && <FieldError>{field("threshold")}</FieldError>}
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="reward-from">Vigente desde</FieldLabel>
                  <Input
                    id="reward-from"
                    type="date"
                    value={editing.validFrom}
                    onChange={(event) => setEditing({ ...editing, validFrom: event.target.value })}
                    className="h-10"
                  />
                </Field>
                <Field data-invalid={field("validity") ? true : undefined}>
                  <FieldLabel htmlFor="reward-until">Vigente hasta</FieldLabel>
                  <Input
                    id="reward-until"
                    type="date"
                    value={editing.validUntil}
                    onChange={(event) => setEditing({ ...editing, validUntil: event.target.value })}
                    aria-invalid={field("validity") ? true : undefined}
                    className="h-10"
                  />
                </Field>
              </div>
              {field("validity") && <FieldError>{field("validity")}</FieldError>}
            </form>
          )}

          <SheetFooter className="border-t p-4 sm:flex-row sm:justify-end">
            <Button variant="outline" className="h-10 px-4" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button type="submit" form="reward-form" className="h-10 px-4">
              {isNew ? "Añadir" : "Guardar"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar la recompensa?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.name || "Esta recompensa"} dejará de estar disponible al guardar los cambios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) onChange(rewards.filter((reward) => reward.id !== toDelete.id))
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
