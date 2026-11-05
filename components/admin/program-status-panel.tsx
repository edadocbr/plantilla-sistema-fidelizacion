"use client"

import { Check, Circle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

export type Requirement = { label: string; done: boolean }

type Props = {
  active: boolean
  qrValue: string
  requirements: Requirement[]
  dirty: boolean
  saving: boolean
  onToggleActive: (next: boolean) => void
  onSave: () => void
}

export function ProgramStatusPanel({
  active,
  qrValue,
  requirements,
  dirty,
  saving,
  onToggleActive,
  onSave,
}: Props) {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle className="text-base">Estado del programa</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="program-active" className="text-sm">
            Programa activo
          </Label>
          <Switch
            id="program-active"
            checked={active}
            onCheckedChange={onToggleActive}
          />
        </div>

        <ul className="flex flex-col gap-1.5" aria-label="Requisitos para activar">
          {requirements.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Circle className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
              <span className={item.done ? "" : "text-muted-foreground"}>
                {item.label}
                <span className="sr-only">{item.done ? ": completo" : ": pendiente"}</span>
              </span>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="flex flex-col items-center gap-2">
          {/* El QR se genera aun con el programa inactivo (CUS-05 paso 4). */}
          <div className="rounded-xl bg-white p-2 ring-1 ring-foreground/10">
            <QRCodeSVG
              value={qrValue}
              size={128}
              level="M"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#000000"
              role="img"
              aria-label="Código QR del programa"
            />
          </div>
          <p className="text-sm text-muted-foreground">QR del programa</p>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Button className="h-10 gap-2" disabled={!dirty || saving} onClick={onSave}>
            {saving ? (
              <>
                <Spinner aria-hidden="true" />
                Guardando
              </>
            ) : (
              <>
                Guardar cambios
                <KbdGroup aria-hidden="true">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>S</Kbd>
                </KbdGroup>
              </>
            )}
          </Button>
          <p className="min-h-5 text-center text-sm text-muted-foreground" aria-live="polite">
            {dirty ? "Hay cambios sin guardar" : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
