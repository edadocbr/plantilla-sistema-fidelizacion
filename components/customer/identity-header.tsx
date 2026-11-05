import { WifiOff } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Client } from "@/lib/cashier/types"

type Props = {
  client: Client
  /** Si hay que avisar que el saldo viene de la copia local. */
  offline: boolean
  updatedAt: string
}

const dateFormat = new Intl.DateTimeFormat("es-PE", {
  month: "short",
  year: "numeric",
})
const timeFormat = new Intl.DateTimeFormat("es-PE", {
  hour: "2-digit",
  minute: "2-digit",
})

export function IdentityHeader({ client, offline, updatedAt }: Props) {
  return (
    <header className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold text-balance">{client.name}</h1>
        <div aria-live="polite" className="shrink-0">
          {offline && (
            <Badge variant="secondary" className="h-6 px-2.5 text-sm">
              <WifiOff aria-hidden="true" />
              Modo sin conexión · {timeFormat.format(new Date(updatedAt))}
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">
        Miembro desde{" "}
        {dateFormat.format(new Date(`${client.enrolledAt}T00:00:00`))}
      </p>
    </header>
  )
}
