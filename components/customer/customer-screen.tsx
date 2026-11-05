"use client"

import { useEffect, useState } from "react"
import { CircleAlert, PartyPopper } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useSessionTimeout } from "@/hooks/use-session-timeout"
import { useWakeLock } from "@/hooks/use-wake-lock"
import {
  DEFAULT_MAX_STAMPS,
  defaultRewards,
  eligibleRewards,
  nextReward,
} from "@/lib/cashier/rewards"
import type { LoyaltyMode } from "@/lib/cashier/types"
import { loadPass, markBalanceSeen, type LoadedPass } from "@/lib/customer/pass"

import { IdentityHeader } from "./identity-header"
import { ProgressPanel } from "./progress-panel"
import { QrPass } from "./qr-pass"
import { RewardsSection } from "./rewards-section"

type Props = {
  /** Documento del cliente con sesión iniciada (simulado en este prototipo). */
  nationalId: string
  mode?: LoyaltyMode
  /** Casilleros de la cartilla de sellos. Configurable por el comercio. */
  maxStamps?: number
  /** Inactividad tras la cual caduca la sesión (5 minutos por defecto). */
  sessionTimeoutMs?: number
}

const FIVE_MINUTES_MS = 5 * 60 * 1000

export function CustomerScreen({
  nationalId,
  mode = "points",
  maxStamps = DEFAULT_MAX_STAMPS,
  sessionTimeoutMs = FIVE_MINUTES_MS,
}: Props) {
  const [pass, setPass] = useState<LoadedPass | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const online = useOnlineStatus()
  const expired = useSessionTimeout(sessionTimeoutMs)
  useWakeLock(!expired)

  // Carga al abrir y vuelve a pedir el saldo cuando regresa la conexión.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const loaded = await loadPass(nationalId, mode)
        if (cancelled) return
        setPass(loaded)
        setFailed(false)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [nationalId, mode, online, attempt])

  // Recuerda el saldo ya visto para animar solo los sellos nuevos la próxima vez.
  const seenBalance = pass && !pass.stale ? pass.client.balance : null
  useEffect(() => {
    if (seenBalance === null) return
    const timer = setTimeout(
      () => markBalanceSeen(nationalId, mode, seenBalance),
      1000,
    )
    return () => clearTimeout(timer)
  }, [nationalId, mode, seenBalance])

  const rewards = defaultRewards(mode, maxStamps)

  if (!pass) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 p-4">
        {failed ? (
          <Alert variant="destructive" className="motion-alert-enter px-4 py-3">
            <CircleAlert aria-hidden="true" />
            <AlertTitle className="text-base">No se pudo cargar tu pase</AlertTitle>
            <AlertDescription>
              Conéctate a internet e inténtalo de nuevo.
            </AlertDescription>
            <div className="col-start-2 mt-2">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-5 text-base text-foreground"
                onClick={() => {
                  setFailed(false)
                  setAttempt((value) => value + 1)
                }}
              >
                Reintentar
              </Button>
            </div>
          </Alert>
        ) : (
          <div
            className="flex flex-col gap-4"
            role="status"
            aria-label="Cargando tu pase"
          >
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="size-[min(72vw,38dvh)] self-center" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </main>
    )
  }

  const { client } = pass
  const available = eligibleRewards(rewards, client.balance)
  const next = nextReward(rewards, client.balance)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 p-4">
      <IdentityHeader
        client={client}
        offline={!online || pass.stale}
        updatedAt={pass.updatedAt}
      />

      <QrPass nationalId={client.nationalId} expired={expired} />

      {client.balance === 0 && (
        <Alert className="motion-alert-enter px-4 py-3">
          <PartyPopper aria-hidden="true" />
          <AlertTitle className="text-base">¡Te damos la bienvenida!</AlertTitle>
          <AlertDescription>
            Tu primera compra suma tu primer {mode === "points" ? "punto" : "sello"}.
          </AlertDescription>
        </Alert>
      )}

      <ProgressPanel
        mode={mode}
        balance={client.balance}
        maxStamps={maxStamps}
        next={next}
        newlyEarned={pass.newlyEarned}
      />

      <RewardsSection mode={mode} available={available} />
    </main>
  )
}
