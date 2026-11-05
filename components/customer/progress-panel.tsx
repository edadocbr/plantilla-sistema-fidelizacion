import { Progress } from "@/components/ui/progress"
import type { LoyaltyMode, Reward } from "@/lib/cashier/types"

import { StampGrid } from "./stamp-grid"

type Props = {
  mode: LoyaltyMode
  balance: number
  maxStamps: number
  next: Reward | undefined
  newlyEarned: number
}

const number = new Intl.NumberFormat("es-PE")

export function ProgressPanel({
  mode,
  balance,
  maxStamps,
  next,
  newlyEarned,
}: Props) {
  const isPoints = mode === "points"
  const remaining = next ? next.cost - balance : 0
  const unit = isPoints ? "pts" : remaining === 1 ? "sello" : "sellos"
  const progress = next ? Math.min(100, (balance / next.cost) * 100) : 100

  return (
    <section className="motion-enter flex flex-col gap-3" aria-labelledby="progress-title">
      <h2 id="progress-title" className="text-lg font-semibold">
        Tu progreso
      </h2>

      {isPoints ? (
        <>
          <div
            className="flex items-baseline gap-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="sr-only">Saldo actual:</span>
            <span className="text-5xl leading-none font-semibold tabular-nums">
              {number.format(balance)}
            </span>
            <span className="text-lg text-muted-foreground">puntos</span>
          </div>
          <Progress
            value={progress}
            className="h-3"
            aria-label={
              next
                ? `Avance hacia ${next.name}`
                : "Todas las recompensas alcanzadas"
            }
          />
        </>
      ) : (
        <>
          <p
            className="text-lg font-medium tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {Math.min(balance, maxStamps)} de {maxStamps} sellos
          </p>
          <StampGrid
            earned={balance}
            max={maxStamps}
            newlyEarned={newlyEarned}
          />
        </>
      )}

      <p className="text-sm text-muted-foreground tabular-nums">
        {next
          ? `Faltan ${number.format(remaining)} ${unit} para ${next.name}`
          : "Alcanzaste todas las recompensas del programa"}
      </p>
    </section>
  )
}
