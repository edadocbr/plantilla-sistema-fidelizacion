"use client"

import { useRef, useState } from "react"
import { CircleAlert, Info, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { findClient, redeemReward, registerPurchase } from "@/lib/cashier/mock-api"
import {
  defaultRewards,
  eligibleRewards,
  extractNationalId,
} from "@/lib/cashier/rewards"
import type { Client, LoyaltyMode, Reward } from "@/lib/cashier/types"

import { IdentifyView, type NationalIdResult } from "./identify-view"
import type { ScannerFailure } from "./qr-scanner"
import { ServeView } from "./serve-view"

type Props = {
  mode?: LoyaltyMode
  /** Soles por cada punto. Configurable por el Administrador. */
  currencyPerPoint?: number
  rewards?: Reward[]
}

type Notice = {
  id: number
  tone: "error" | "info"
  title: string
  description?: string
  retry?: () => void
}

export function CashierScreen({
  mode = "points",
  currencyPerPoint = 1,
  rewards: rewardsProp,
}: Props) {
  const rewards = rewardsProp ?? defaultRewards(mode)

  const [client, setClient] = useState<Client | null>(null)
  const [balance, setBalance] = useState(0)
  const [pendingDelta, setPendingDelta] = useState(0)
  const [busy, setBusy] = useState<"search" | "register" | "redeem" | null>(
    null,
  )
  const [notice, setNotice] = useState<Notice | null>(null)
  const [amount, setAmount] = useState("")
  const [prizeNow, setPrizeNow] = useState(false)

  const busyRef = useRef(false)
  const noticeSeq = useRef(0)

  const online = useOnlineStatus()

  function showNotice(next: Omit<Notice, "id">) {
    noticeSeq.current += 1
    setNotice({ id: noticeSeq.current, ...next })
  }

  function finish() {
    setClient(null)
    setBalance(0)
    setAmount("")
    setPrizeNow(false)
  }

  async function identify(nationalId: string): Promise<NationalIdResult> {
    if (busyRef.current) return "error"
    busyRef.current = true
    setBusy("search")
    setNotice(null)
    try {
      const found = await findClient(nationalId, mode)
      if (!found) {
        showNotice({
          tone: "error",
          title: "Cliente no encontrado",
          description:
            "Verifique el DNI o invite al cliente a registrarse en el programa.",
        })
        return "not-found"
      }
      setClient(found)
      setBalance(found.balance)
      return "found"
    } catch {
      showNotice({
        tone: "error",
        title: "No se pudo buscar al cliente",
        description: "Compruebe su conexión e intente de nuevo.",
        retry: () => void identify(nationalId),
      })
      return "error"
    } finally {
      busyRef.current = false
      setBusy(null)
    }
  }

  function handleScan(text: string) {
    const nationalId = extractNationalId(text)
    if (!nationalId) {
      showNotice({
        tone: "error",
        title: "Código QR no reconocido",
        description:
          "Pida al cliente que muestre su credencial otra vez o ingrese el DNI.",
      })
      return
    }
    void identify(nationalId)
  }

  function handleCameraUnavailable(reason: ScannerFailure) {
    showNotice({
      tone: "error",
      title:
        reason === "denied"
          ? "Sin acceso a la cámara"
          : "No se pudo iniciar la cámara",
      description: "Ingrese el DNI del cliente.",
    })
  }

  async function register(delta: number): Promise<boolean> {
    if (!client || busyRef.current) return false
    busyRef.current = true
    setBusy("register")
    setPendingDelta(delta)
    setNotice(null)
    try {
      const next = await registerPurchase(client.nationalId, mode, delta)
      const before = eligibleRewards(rewards, balance).length
      const after = eligibleRewards(rewards, next).length
      setBalance(next)
      toast.success(
        mode === "points"
          ? `+${delta} pts para ${client.name}`
          : `Sello asignado a ${client.name}`,
      )
      if (after > 0) {
        setPrizeNow(after > before)
        setAmount("")
      } else {
        finish()
      }
      return true
    } catch {
      showNotice({
        tone: "error",
        title: "No se pudo registrar",
        description: "Compruebe su conexión. El monto sigue en pantalla.",
        retry: () => void register(delta),
      })
      return false
    } finally {
      setPendingDelta(0)
      busyRef.current = false
      setBusy(null)
    }
  }

  async function redeem(reward: Reward): Promise<boolean> {
    if (!client || busyRef.current) return false
    busyRef.current = true
    setBusy("redeem")
    setPendingDelta(-reward.cost)
    setNotice(null)
    try {
      await redeemReward(client.nationalId, mode, reward.cost)
      toast.success(`Canje aplicado: ${reward.name}`)
      finish()
      return true
    } catch {
      showNotice({
        tone: "error",
        title: "No se pudo procesar el canje",
        description: "Verifique su red. El saldo no cambió.",
        retry: () => void redeem(reward),
      })
      return false
    } finally {
      setPendingDelta(0)
      busyRef.current = false
      setBusy(null)
    }
  }

  function cancelAttention() {
    finish()
    setNotice(null)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b bg-background px-4">
        <h1 className="text-lg font-semibold">Caja</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-6 px-2.5 text-sm">
            {mode === "points" ? "Puntos" : "Sellos"}
          </Badge>
          {online ? (
            <Badge variant="outline" className="h-6 px-2.5 text-sm">
              <Wifi aria-hidden="true" />
              En línea
            </Badge>
          ) : (
            <Badge variant="destructive" className="h-6 px-2.5 text-sm">
              <WifiOff aria-hidden="true" />
              Sin conexión
            </Badge>
          )}
        </div>
      </header>

      {notice && (
        <div className="px-4 pt-4">
          <Alert
            key={notice.id}
            variant={notice.tone === "error" ? "destructive" : "default"}
            className="motion-alert-enter px-4 py-3"
          >
            {notice.tone === "error" ? (
              <CircleAlert aria-hidden="true" />
            ) : (
              <Info aria-hidden="true" />
            )}
            <AlertTitle className="text-base">{notice.title}</AlertTitle>
            {notice.description && (
              <AlertDescription>{notice.description}</AlertDescription>
            )}
            {notice.retry && (
              <div className="col-start-2 mt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-5 text-base text-foreground"
                  disabled={busy !== null}
                  onClick={notice.retry}
                >
                  Reintentar
                </Button>
              </div>
            )}
          </Alert>
        </div>
      )}

      <div
        key={client ? "serve" : "identify"}
        className="motion-enter flex flex-1 flex-col"
      >
        {client ? (
          <ServeView
            client={client}
            balance={balance + pendingDelta}
            mode={mode}
            currencyPerPoint={currencyPerPoint}
            rewards={rewards}
            busy={busy === "register" || busy === "redeem" ? busy : null}
            prizeNow={prizeNow}
            amount={amount}
            onAmountChange={(value) => {
              setAmount(value)
              setNotice(null)
            }}
            onRegister={register}
            onRedeem={redeem}
            onCancel={cancelAttention}
          />
        ) : (
          <IdentifyView
            busy={busy === "search"}
            onScan={handleScan}
            onSubmitNationalId={identify}
            onCameraUnavailable={handleCameraUnavailable}
            onEdit={() => setNotice(null)}
          />
        )}
      </div>
    </div>
  )
}
