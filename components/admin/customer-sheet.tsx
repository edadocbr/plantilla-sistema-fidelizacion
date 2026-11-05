"use client"

import { useEffect, useState } from "react"
import { Gift, Plus, TriangleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatDateTime, numberFormat } from "@/lib/admin/format"
import type { CustomerDetail } from "@/lib/admin/types"
import { getCustomerDetail } from "@/lib/cashier/mock-api"
import type { LoyaltyMode } from "@/lib/cashier/types"

type Props = {
  mode: LoyaltyMode
  /** DNI del cliente abierto; `null` cierra el panel. */
  nationalId: string | null
  onClose: () => void
}

export function CustomerSheet({ mode, nationalId, onClose }: Props) {
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const unit = mode === "points" ? "pts" : "sellos"

  useEffect(() => {
    if (!nationalId) return
    let cancelled = false
    ;(async () => {
      const loaded = await getCustomerDetail(mode, nationalId)
      if (!cancelled) setDetail(loaded)
    })()
    return () => {
      cancelled = true
    }
  }, [mode, nationalId])

  const current =
    detail && detail.customer.nationalId === nationalId ? detail : null

  return (
    <Sheet open={nationalId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-[480px]">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-lg">
            {current ? current.customer.name : "Detalle del cliente"}
          </SheetTitle>
          <SheetDescription className="tabular-nums">
            {nationalId ? `DNI ${nationalId}` : ""}
          </SheetDescription>
        </SheetHeader>

        {!current ? (
          <div className="flex flex-col gap-3 p-4" role="status" aria-label="Cargando detalle">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-5 p-4">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Saldo</dt>
                <dd className="text-3xl font-semibold tabular-nums">
                  {numberFormat.format(current.customer.balance)}{" "}
                  <span className="text-base font-normal text-muted-foreground">{unit}</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Estado</dt>
                <dd className="mt-1">
                  <Badge
                    variant={current.customer.status === "active" ? "default" : "outline"}
                    className="h-6 px-2.5 text-sm"
                  >
                    {current.customer.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Inscrito</dt>
                <dd className="tabular-nums">{formatDate(current.customer.enrolledAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Última operación</dt>
                <dd className="tabular-nums">
                  {current.customer.lastOperationAt
                    ? formatDateTime(current.customer.lastOperationAt)
                    : "Sin operaciones"}
                </dd>
              </div>
            </dl>

            {current.duplicateAlerts.length > 0 && (
              <Alert variant="destructive" className="px-4 py-3">
                <TriangleAlert aria-hidden="true" />
                <AlertTitle className="text-base">Posible registro duplicado</AlertTitle>
                <AlertDescription>
                  Registros repetidos dentro del tiempo de espera:{" "}
                  {current.duplicateAlerts.map(formatDateTime).join(" · ")}.
                </AlertDescription>
              </Alert>
            )}

            <section aria-labelledby="history-title" className="flex flex-col gap-2">
              <h3 id="history-title" className="text-base font-semibold">
                Historial reciente
              </h3>
              {current.history.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay operaciones.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Hora</TableHead>
                      <TableHead scope="col">Acción</TableHead>
                      <TableHead scope="col" className="text-right">
                        {mode === "points" ? "Puntos" : "Sellos"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.history.map((operation) => (
                      <TableRow key={operation.id} className="h-11">
                        <TableCell className="text-muted-foreground tabular-nums">
                          {formatDateTime(operation.at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="h-6 px-2 text-sm">
                            {operation.type === "register" ? (
                              <Plus aria-hidden="true" />
                            ) : (
                              <Gift aria-hidden="true" />
                            )}
                            {operation.type === "register" ? "Registro" : "Canje"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {operation.type === "register" ? "+" : "−"}
                          {numberFormat.format(operation.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
