import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  earned: number
  max: number
  /** Cuántos de los últimos sellos ganados son nuevos y se animan al aparecer. */
  newlyEarned?: number
}

/** Cuadrícula de 5 columnas: sellos ganados rellenos, faltantes en contorno. */
export function StampGrid({ earned, max, newlyEarned = 0 }: Props) {
  const filled = Math.min(earned, max)

  return (
    <div
      role="img"
      aria-label={`${filled} de ${max} sellos`}
      className="grid grid-cols-5 gap-2"
    >
      {Array.from({ length: max }, (_, index) => {
        const isEarned = index < filled
        const isNew = isEarned && index >= filled - newlyEarned
        return (
          <div
            key={index}
            className={cn(
              "grid aspect-square place-items-center rounded-lg",
              isEarned
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground ring-1 ring-inset ring-foreground/25",
              isNew && "motion-pop",
            )}
          >
            {isEarned ? (
              <Check className="size-5" aria-hidden="true" />
            ) : (
              <span className="text-sm tabular-nums">{index + 1}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
