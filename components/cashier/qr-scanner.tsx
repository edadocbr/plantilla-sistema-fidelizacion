"use client"

import { useEffect, useRef, useState } from "react"
import { CameraOff } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

const READER_ID = "cashier-qr-reader"
const REPEAT_WINDOW_MS = 2500

export type ScannerFailure = "denied" | "unavailable"

type Props = {
  onDecode: (text: string) => void
  onUnavailable: (reason: ScannerFailure) => void
}

export function QrScanner({ onDecode, onUnavailable }: Props) {
  const [status, setStatus] = useState<"starting" | "ready" | "unavailable">(
    "starting",
  )
  const onDecodeRef = useRef(onDecode)
  const onUnavailableRef = useRef(onUnavailable)

  useEffect(() => {
    onDecodeRef.current = onDecode
    onUnavailableRef.current = onUnavailable
  })

  useEffect(() => {
    let cancelled = false
    let scanner: import("html5-qrcode").Html5Qrcode | null = null
    let started = false
    let last = { text: "", at: 0 }

    const release = async () => {
      if (!scanner || !started) return
      started = false
      try {
        await scanner.stop()
        scanner.clear()
      } catch {
        /* la cámara ya estaba detenida */
      }
    }

    ;(async () => {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          "html5-qrcode"
        )
        if (cancelled) return
        scanner = new Html5Qrcode(READER_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        })
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 12,
            qrbox: (width, height) => {
              const side = Math.floor(Math.min(width, height) * 0.7)
              return { width: side, height: side }
            },
          },
          (text) => {
            const now = Date.now()
            if (text === last.text && now - last.at < REPEAT_WINDOW_MS) return
            last = { text, at: now }
            onDecodeRef.current(text)
          },
          () => {},
        )
        started = true
        if (cancelled) {
          await release()
          return
        }
        setStatus("ready")
      } catch (error) {
        if (cancelled) return
        const denied =
          error instanceof Error &&
          /NotAllowed|Permission|denied/i.test(`${error.name} ${error.message}`)
        setStatus("unavailable")
        onUnavailableRef.current(denied ? "denied" : "unavailable")
      }
    })()

    return () => {
      cancelled = true
      void release()
    }
  }, [])

  return (
    <div className="@container relative size-full overflow-hidden rounded-xl bg-muted">
      <div
        id={READER_ID}
        className="qr-viewport absolute inset-0"
        aria-hidden={status !== "ready"}
      />

      {status === "starting" && (
        <Skeleton
          className="absolute inset-0 rounded-none"
          role="status"
          aria-label="Iniciando la cámara"
        />
      )}

      {status === "ready" && (
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <div className="qr-frame size-[70cqmin]" />
        </div>
      )}

      {status === "unavailable" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
          <CameraOff className="size-8" aria-hidden="true" />
          <p className="text-base font-medium text-foreground">
            Cámara no disponible
          </p>
          <p className="text-sm">Ingrese el DNI del cliente para continuar.</p>
        </div>
      )}
    </div>
  )
}
