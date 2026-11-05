"use client"

import { useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { daysAgoKey, toDateKey } from "@/lib/admin/format"
import type { DateRange, Granularity, OverviewData } from "@/lib/admin/types"
import { getOverview } from "@/lib/cashier/mock-api"

import { useAdmin } from "./admin-context"
import { ActivityTable } from "./activity-table"
import { DateRangePicker } from "./date-range-picker"
import { KpiCards } from "./kpi-cards"
import { PerformanceChart } from "./performance-chart"

type Preset = "today" | "7d" | "30d" | "custom"

function rangeFor(preset: Exclude<Preset, "custom">): DateRange {
  const to = toDateKey(new Date())
  if (preset === "today") return { from: to, to }
  return { from: daysAgoKey(preset === "7d" ? 6 : 29), to }
}

export function OverviewView() {
  const { mode } = useAdmin()
  const [preset, setPreset] = useState<Preset>("30d")
  const [range, setRange] = useState<DateRange>(() => rangeFor("30d"))
  const [granularity, setGranularity] = useState<Granularity>("day")
  const [data, setData] = useState<OverviewData | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const next = await getOverview(mode, range, granularity)
        if (cancelled) return
        setData(next)
        setFailed(false)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [mode, range, granularity])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">Resumen del programa</h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            value={preset === "custom" ? "" : preset}
            onValueChange={(value) => {
              if (!value) return
              const next = value as Exclude<Preset, "custom">
              setPreset(next)
              setRange(rangeFor(next))
            }}
            aria-label="Período"
          >
            <ToggleGroupItem value="today" className="h-10 px-3">
              Hoy
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-10 px-3">
              7 días
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-10 px-3">
              30 días
            </ToggleGroupItem>
          </ToggleGroup>
          <DateRangePicker
            range={range}
            active={preset === "custom"}
            onChange={(next) => {
              setPreset("custom")
              setRange(next)
            }}
          />
        </div>

        <Tabs
          value={granularity}
          onValueChange={(value) => setGranularity(value as Granularity)}
        >
          <TabsList aria-label="Agrupar por">
            <TabsTrigger value="day" className="h-8 px-4">Día</TabsTrigger>
            <TabsTrigger value="month" className="h-8 px-4">Mes</TabsTrigger>
            <TabsTrigger value="year" className="h-8 px-4">Año</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {failed && (
        <Alert variant="destructive" className="px-4 py-3">
          <AlertTitle className="text-base">No se pudieron cargar las métricas</AlertTitle>
          <AlertDescription>Compruebe su conexión e inténtelo de nuevo.</AlertDescription>
        </Alert>
      )}

      <KpiCards mode={mode} data={data} />

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">
              {mode === "points" ? "Puntos emitidos y canjeados" : "Sellos emitidos y canjeados"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart mode={mode} data={data} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Actividad reciente en caja</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTable data={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
