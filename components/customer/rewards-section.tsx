import { Gift } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import type { LoyaltyMode, Reward } from "@/lib/cashier/types"

type Props = {
  mode: LoyaltyMode
  /** Recompensas que el cliente ya puede canjear. */
  available: Reward[]
}

/** Para que la pantalla no necesite scroll solo se listan las primeras filas. */
const VISIBLE_ROWS = 2

const number = new Intl.NumberFormat("es-PE")

export function RewardsSection({ mode, available }: Props) {
  const unit = mode === "points" ? "pts" : "sellos"
  const visible = available.slice(0, VISIBLE_ROWS)
  const hidden = available.length - visible.length

  return (
    <section className="flex flex-col gap-2" aria-labelledby="rewards-title">
      <h2 id="rewards-title" className="text-lg font-semibold">
        Recompensas disponibles
      </h2>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aún no alcanzas ninguna recompensa.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((reward) => (
            <li key={reward.id} className="motion-enter">
              <Item className="border-transparent bg-primary px-4 py-3 text-primary-foreground">
                <ItemMedia>
                  <Gift className="size-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{reward.name}</ItemTitle>
                  <ItemDescription className="text-primary-foreground/85">
                    Muéstrala en caja para canjearla
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="text-sm tabular-nums">
                  {number.format(reward.cost)} {unit}
                </ItemActions>
              </Item>
            </li>
          ))}
        </ul>
      )}

      {hidden > 0 && (
        <p className="text-sm text-muted-foreground">+{hidden} más</p>
      )}
    </section>
  )
}
