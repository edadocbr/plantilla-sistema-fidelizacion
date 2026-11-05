import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { numberFormat } from "@/lib/admin/format"
import type { OverviewData } from "@/lib/admin/types"
import type { LoyaltyMode } from "@/lib/cashier/types"

type Props = {
  mode: LoyaltyMode
  data: OverviewData | null
}

export function KpiCards({ mode, data }: Props) {
  const isPoints = mode === "points"
  const unit = isPoints ? "puntos" : "sellos"

  const items = data
    ? [
        {
          label: "Clientes inscritos",
          value: numberFormat.format(data.enrolled),
          hint: `${numberFormat.format(data.active)} activos en 30 días`,
        },
        {
          label: isPoints ? "Puntos emitidos" : "Cartillas completadas",
          value: numberFormat.format(
            isPoints ? data.issued : data.cardsCompleted,
          ),
          hint: isPoints
            ? "En el período seleccionado"
            : `${numberFormat.format(data.issued)} ${unit} emitidos`,
        },
        {
          label: isPoints ? "Puntos canjeados" : "Premios entregados",
          value: numberFormat.format(
            isPoints ? data.redeemed : data.rewardsDelivered,
          ),
          hint: isPoints
            ? `${numberFormat.format(data.rewardsDelivered)} canjes`
            : "En el período seleccionado",
        },
        {
          label: "Tasa de canje",
          value: `${(data.redemptionRate * 100).toFixed(1)} %`,
          hint: `Canjeado sobre emitido (${unit})`,
        },
      ]
    : null

  return (
    <section
      aria-label="Indicadores principales"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      {(items ?? Array.from({ length: 4 }, () => null)).map((item, index) => (
        <Card key={item?.label ?? index} size="sm">
          <CardContent className="flex flex-col gap-1">
            {item ? (
              <>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-semibold tabular-nums">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {item.hint}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-4 w-36" />
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
