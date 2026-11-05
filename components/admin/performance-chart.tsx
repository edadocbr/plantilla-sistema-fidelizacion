"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { numberFormat } from "@/lib/admin/format"
import type { OverviewData } from "@/lib/admin/types"
import type { LoyaltyMode } from "@/lib/cashier/types"

type Props = {
  mode: LoyaltyMode
  data: OverviewData | null
}

export function PerformanceChart({ mode, data }: Props) {
  const unit = mode === "points" ? "puntos" : "sellos"
  const config = {
    issued: { label: `${mode === "points" ? "Puntos" : "Sellos"} emitidos`, color: "var(--chart-5)" },
    redeemed: { label: `${mode === "points" ? "Puntos" : "Sellos"} canjeados`, color: "var(--chart-2)" },
  } satisfies ChartConfig

  if (!data) return <Skeleton className="h-72 w-full" />

  if (data.operationCount === 0) {
    return (
      <Empty className="h-72 border">
        <EmptyHeader>
          <EmptyTitle>No hay registros para este período</EmptyTitle>
          <EmptyDescription>
            Ajusta el rango de fechas para ver la actividad del programa.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={config} className="h-72 w-full">
        <BarChart accessibilityLayer data={data.series} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(value: number) => numberFormat.format(value)}
          />
          <ChartTooltip
            isAnimationActive={false}
            content={<ChartTooltipContent />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {/* Sin animación interna de recharts: anima la altura, no solo transform. */}
          <Bar dataKey="issued" fill="var(--color-issued)" radius={2} isAnimationActive={false} />
          <Bar dataKey="redeemed" fill="var(--color-redeemed)" radius={2} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>

      {/* Equivalente textual del gráfico para lectores de pantalla. */}
      <Table className="sr-only">
        <caption>Emitidos y canjeados por período, en {unit}</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Período</TableHead>
            <TableHead scope="col">Emitidos</TableHead>
            <TableHead scope="col">Canjeados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.series.map((point) => (
            <TableRow key={point.key}>
              <TableCell>{point.label}</TableCell>
              <TableCell>{point.issued}</TableCell>
              <TableCell>{point.redeemed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
