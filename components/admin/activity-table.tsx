import { Gift, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import { formatDateTime } from "@/lib/admin/format"
import type { OverviewData } from "@/lib/admin/types"

export function ActivityTable({ data }: { data: OverviewData | null }) {
  if (!data) return <Skeleton className="h-72 w-full" />

  if (data.activity.length === 0) {
    return (
      <Empty className="h-72 border">
        <EmptyHeader>
          <EmptyTitle>No hay registros para este período</EmptyTitle>
          <EmptyDescription>
            Las operaciones de caja aparecerán aquí.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Hora</TableHead>
          <TableHead scope="col">Acción</TableHead>
          <TableHead scope="col">Cliente</TableHead>
          <TableHead scope="col" className="hidden md:table-cell">
            Cajero
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.activity.map((operation) => (
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
            <TableCell className="font-medium">{operation.customerName}</TableCell>
            <TableCell className="hidden md:table-cell">
              {operation.cashier}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
