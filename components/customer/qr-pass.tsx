"use client"

import { QRCodeSVG } from "qrcode.react"
import { ShieldAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type Props = {
  nationalId: string
  expired: boolean
}

/** Lado del QR: grande, pero siempre cabe junto al resto de la pantalla. */
const QR_SIDE = "size-[min(72vw,38dvh)]"

export function QrPass({ nationalId, expired }: Props) {
  return (
    <section
      className="flex flex-col items-center gap-3"
      aria-label="Código de identificación"
    >
      {expired ? (
        <div className={`${QR_SIDE} flex items-center`}>
          <Alert variant="destructive" className="motion-alert-enter px-4 py-3">
            <ShieldAlert aria-hidden="true" />
            <AlertTitle className="text-base">Tu sesión expiró</AlertTitle>
            <AlertDescription>
              Por seguridad ocultamos tu código. Recarga la página para
              continuar.
            </AlertDescription>
            <div className="col-start-2 mt-2">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-5 text-base text-foreground"
                onClick={() => window.location.reload()}
              >
                Recargar página
              </Button>
            </div>
          </Alert>
        </div>
      ) : (
        // El QR es siempre negro sobre blanco, sin importar el tema, para que el lector lo resuelva.
        <div className="rounded-xl bg-white p-3 ring-1 ring-foreground/10">
          <QRCodeSVG
            value={nationalId}
            level="M"
            marginSize={1}
            bgColor="#ffffff"
            fgColor="#000000"
            className={QR_SIDE}
            role="img"
            aria-label={`Código QR de identificación. DNI ${nationalId}`}
          />
        </div>
      )}

      {/* Respaldo para dictar el número en caja si el escaneo falla. */}
      {!expired && (
        <p className="text-2xl font-medium tracking-widest tabular-nums">
          {nationalId}
        </p>
      )}
    </section>
  )
}
