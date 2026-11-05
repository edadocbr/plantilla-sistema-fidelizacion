"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, Gift, Stamp } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { eligibleRewards, nextReward } from "@/lib/cashier/rewards"
import type { Client, LoyaltyMode, Reward } from "@/lib/cashier/types"

type Props = {
  client: Client
  /** Saldo a mostrar (incluye el cambio optimista mientras la operación está en curso). */
  balance: number
  mode: LoyaltyMode
  currencyPerPoint: number
  rewards: Reward[]
  busy: "register" | "redeem" | null
  prizeNow: boolean
  amount: string
  onAmountChange: (value: string) => void
  onRegister: (delta: number) => Promise<boolean>
  onRedeem: (reward: Reward) => Promise<boolean>
  onCancel: () => void
}

const number = new Intl.NumberFormat("es-PE")
const dateFormat = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const AMOUNT_PATTERN = /^\d{0,7}([.,]\d{0,2})?$/

export function ServeView({
  client,
  balance,
  mode,
  currencyPerPoint,
  rewards,
  busy,
  prizeNow,
  amount,
  onAmountChange,
  onRegister,
  onRedeem,
  onCancel,
}: Props) {
  const isPoints = mode === "points"
  const unit = isPoints ? "pts" : "sellos"
  const unitLong = isPoints ? "puntos" : "sellos"

  const amountRef = useRef<HTMLInputElement>(null)
  const stampRef = useRef<HTMLButtonElement>(null)
  const amountId = useId()
  const amountMessageId = useId()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  useEffect(() => {
    if (isPoints) amountRef.current?.focus()
    else stampRef.current?.focus()
  }, [isPoints])

  const available = eligibleRewards(rewards, balance)
  const next = nextReward(rewards, balance)
  const progress = next ? Math.min(100, (balance / next.cost) * 100) : 100

  const parsed = amount === "" ? null : Number(amount.replace(",", "."))
  const amountInvalid = parsed !== null && !(Number.isFinite(parsed) && parsed > 0)
  const points =
    parsed !== null && !amountInvalid ? Math.floor(parsed / currencyPerPoint) : 0
  const belowMinimum = parsed !== null && !amountInvalid && points < 1
  const canRegister = points >= 1 && busy === null

  const amountMessage = amountInvalid
    ? "Ingrese un monto válido mayor a 0"
    : belowMinimum
      ? `Monto mínimo de S/ ${number.format(currencyPerPoint)} para sumar puntos`
      : null

  function handleAmountChange(raw: string) {
    if (AMOUNT_PATTERN.test(raw)) onAmountChange(raw)
  }

  async function redeem(reward: Reward) {
    await onRedeem(reward)
    setConfirmingId(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4">
      {prizeNow && (
        <Alert className="motion-alert-enter border-transparent bg-primary px-4 py-3 text-primary-foreground *:data-[slot=alert-description]:text-primary-foreground/85">
          <Gift aria-hidden="true" />
          <AlertTitle className="text-base">
            ¡Premio disponible por la compra actual!
          </AlertTitle>
          <AlertDescription>
            Pregunte al cliente si desea canjearlo hoy.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold text-balance">{client.name}</p>
            <p className="text-sm text-muted-foreground tabular-nums">
              DNI {client.nationalId} · Inscrito el{" "}
              {dateFormat.format(new Date(`${client.enrolledAt}T00:00:00`))}
            </p>
          </div>

          <div
            className="flex items-baseline gap-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="sr-only">Saldo actual:</span>
            <span className="text-5xl leading-none font-semibold tabular-nums">
              {number.format(balance)}
            </span>
            <span className="text-lg text-muted-foreground">{unitLong}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Progress
              value={progress}
              className="h-3"
              aria-label={
                next
                  ? `Avance hacia ${next.name}`
                  : "Todas las recompensas alcanzadas"
              }
            />
            <p className="text-sm text-muted-foreground tabular-nums">
              {next
                ? `Faltan ${number.format(next.cost - balance)} ${unit} para ${next.name}`
                : "Alcanzó todas las recompensas del programa"}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3" aria-labelledby="register">
        <h2 id="register" className="text-lg font-semibold">
          {isPoints ? "Registrar compra" : "Asignar sello"}
        </h2>

        {isPoints ? (
          <form
            className="flex flex-col gap-2"
            noValidate
            onSubmit={async (event) => {
              event.preventDefault()
              if (!canRegister) return
              await onRegister(points)
            }}
          >
            <Label htmlFor={amountId}>Monto de la compra (S/)</Label>
            <Input
              ref={amountRef}
              id={amountId}
              value={amount}
              onChange={(event) => handleAmountChange(event.target.value)}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              aria-invalid={amountInvalid ? true : undefined}
              aria-describedby={amountMessage ? amountMessageId : undefined}
              className="h-14 px-4 text-2xl font-medium tabular-nums md:text-2xl"
            />
            <div className="flex min-h-12 flex-col justify-center gap-1">
              <p
                className="text-2xl font-semibold tabular-nums"
                aria-live="polite"
              >
                {points >= 1 ? `= ${number.format(points)} pts` : " "}
              </p>
              <p
                id={amountMessageId}
                role={amountInvalid ? "alert" : undefined}
                className={
                  amountInvalid
                    ? "text-sm text-destructive"
                    : "text-sm text-muted-foreground"
                }
              >
                {amountMessage}
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!canRegister}
              className="h-14 w-full text-base"
            >
              {busy === "register" ? (
                <>
                  <Spinner aria-hidden="true" />
                  Registrando
                </>
              ) : (
                "Registrar compra"
              )}
            </Button>
          </form>
        ) : (
          <Button
            ref={stampRef}
            size="lg"
            disabled={busy !== null}
            onClick={() => void onRegister(1)}
            className="h-14 w-full text-base"
          >
            {busy === "register" ? (
              <>
                <Spinner aria-hidden="true" />
                Asignando
              </>
            ) : (
              <>
                <Stamp aria-hidden="true" />
                Asignar sello
              </>
            )}
          </Button>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="rewards">
        <h2 id="rewards" className="text-lg font-semibold">
          Recompensas disponibles
        </h2>

        {available.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no alcanza ninguna recompensa.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {available.map((reward) => {
              const confirming = confirmingId === reward.id
              return (
                <li
                  key={reward.id}
                  className="flex flex-col gap-3 rounded-xl p-3 ring-1 ring-foreground/10"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setConfirmingId(null)
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{reward.name}</p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {number.format(reward.cost)} {unit}
                    </p>
                  </div>

                  {confirming ? (
                    <div className="motion-enter flex gap-2">
                      <Button
                        size="lg"
                        autoFocus
                        disabled={busy !== null}
                        onClick={() => void redeem(reward)}
                        className="h-12 flex-1 text-base"
                      >
                        {busy === "redeem" ? (
                          <>
                            <Spinner aria-hidden="true" />
                            Canjeando
                          </>
                        ) : (
                          <>
                            <Check aria-hidden="true" />
                            Confirmar canje
                          </>
                        )}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        disabled={busy !== null}
                        onClick={() => setConfirmingId(null)}
                        className="h-12 px-5 text-base"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      disabled={busy !== null}
                      aria-label={`Canjear ${reward.name}`}
                      onClick={() => setConfirmingId(reward.id)}
                      className="h-12 w-full text-base"
                    >
                      Canjear
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <Button
        variant="ghost"
        size="lg"
        disabled={busy !== null}
        onClick={onCancel}
        className="mt-auto h-12 self-end px-5 text-base"
      >
        Cancelar atención
      </Button>
    </div>
  )
}
