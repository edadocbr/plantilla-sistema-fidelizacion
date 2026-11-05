"use client"

import { useId, useRef, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

import { QrScanner, type ScannerFailure } from "./qr-scanner"

export type NationalIdResult = "found" | "not-found" | "error"

type Props = {
  busy: boolean
  onScan: (text: string) => void
  onSubmitNationalId: (nationalId: string) => Promise<NationalIdResult>
  onCameraUnavailable: (reason: ScannerFailure) => void
  onEdit: () => void
}

const NATIONAL_ID_LENGTH = 8

export function IdentifyView({
  busy,
  onScan,
  onSubmitNationalId,
  onCameraUnavailable,
  onEdit,
}: Props) {
  const [nationalId, setDni] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const errorId = useId()

  async function submit(value: string) {
    if (value.length !== NATIONAL_ID_LENGTH) {
      setError(`El DNI debe tener ${NATIONAL_ID_LENGTH} dígitos`)
      inputRef.current?.focus()
      return
    }
    setError(null)
    const result = await onSubmitNationalId(value)
    if (result === "not-found") {
      setDni("")
      inputRef.current?.focus()
    }
  }

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, NATIONAL_ID_LENGTH)
    setDni(digits)
    setError(null)
    onEdit()
    if (digits.length === NATIONAL_ID_LENGTH) void submit(digits)
  }

  function handleCameraUnavailable(reason: ScannerFailure) {
    onCameraUnavailable(reason)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[42dvh] flex-1">
        <QrScanner
          onDecode={onScan}
          onUnavailable={handleCameraUnavailable}
        />
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Separator className="flex-1" />
        <span>o ingresar DNI</span>
        <Separator className="flex-1" />
      </div>

      <form
        className="flex flex-col gap-2"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void submit(nationalId)
        }}
      >
        <Label htmlFor={inputId}>DNI del cliente</Label>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            id={inputId}
            value={nationalId}
            onChange={(event) => handleChange(event.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={NATIONAL_ID_LENGTH}
            placeholder="8 dígitos"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="h-14 flex-1 px-4 text-2xl font-medium tracking-widest tabular-nums md:text-2xl"
          />
          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="h-14 min-w-32 px-6 text-base"
          >
            {busy ? (
              <>
                <Spinner aria-hidden="true" />
                Buscando
              </>
            ) : (
              <>
                <Search aria-hidden="true" />
                Buscar
              </>
            )}
          </Button>
        </div>
        <p
          id={errorId}
          role={error ? "alert" : undefined}
          className="min-h-5 text-sm text-destructive"
        >
          {error}
        </p>
      </form>
    </div>
  )
}
