"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Search } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { formatDate, formatDateTime, numberFormat } from "@/lib/admin/format"
import type { CustomerRow, CustomerStatus } from "@/lib/admin/types"
import { listCustomers } from "@/lib/cashier/mock-api"

import { useAdmin } from "./admin-context"
import { CustomerSheet } from "./customer-sheet"

type StatusFilter = "all" | CustomerStatus
type SortKey = "name" | "enrolledAt" | "balance" | "lastOperationAt"

const PAGE_SIZE = 25

type SortState = { key: SortKey; direction: "asc" | "desc" }

function SortableHead({
  sortKey,
  sort,
  onSort,
  children,
  className,
}: {
  sortKey: SortKey
  sort: SortState
  onSort: (key: SortKey) => void
  children: React.ReactNode
  className?: string
}) {
  const active = sort.key === sortKey
  const Icon = !active ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown
  return (
    <TableHead
      scope="col"
      className={className}
      aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
    >
      <Button
        variant="ghost"
        className="-ml-2 h-10 gap-1 px-2 text-sm font-medium"
        onClick={() => onSort(sortKey)}
      >
        {children}
        <Icon aria-hidden="true" />
      </Button>
    </TableHead>
  )
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}

export function CustomersView() {
  const { mode } = useAdmin()
  const [customers, setCustomers] = useState<CustomerRow[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useHotkeys({ "/": () => searchRef.current?.focus() })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await listCustomers(mode)
        if (!cancelled) setCustomers(rows)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [mode])

  const filtered = useMemo(() => {
    if (!customers) return []
    const needle = normalize(query.trim())
    const rows = customers.filter(
      (customer) =>
        (status === "all" || customer.status === status) &&
        (needle === "" ||
          customer.nationalId.includes(needle) ||
          normalize(customer.name).includes(needle)),
    )
    const factor = sort.direction === "asc" ? 1 : -1
    return rows.sort((a, b) => {
      const left = a[sort.key] ?? ""
      const right = b[sort.key] ?? ""
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * factor
      }
      return String(left).localeCompare(String(right), "es") * factor
    })
  }, [customers, query, status, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function toggleSort(key: SortKey) {
    setSort((previous) =>
      previous.key === key
        ? { key, direction: previous.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    )
  }

  async function copyNationalId(nationalId: string) {
    try {
      await navigator.clipboard.writeText(nationalId)
      toast.success("DNI copiado")
    } catch {
      toast.error("No se pudo copiar el DNI")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">Clientes</h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="h-10 w-72 max-w-full">
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar por DNI o nombre"
              aria-label="Buscar por DNI o nombre"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-end">
              <Kbd aria-hidden="true">/</Kbd>
            </InputGroupAddon>
          </InputGroup>

          <ToggleGroup
            type="single"
            variant="outline"
            value={status}
            onValueChange={(value) => {
              if (!value) return
              setStatus(value as StatusFilter)
              setPage(1)
            }}
            aria-label="Estado del cliente"
          >
            <ToggleGroupItem value="all" className="h-10 px-3">Todos</ToggleGroupItem>
            <ToggleGroupItem value="active" className="h-10 px-3">Activos</ToggleGroupItem>
            <ToggleGroupItem value="inactive" className="h-10 px-3">Inactivos</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {customers ? `${numberFormat.format(filtered.length)} clientes` : ""}
        </p>
      </div>

      {failed && (
        <Alert variant="destructive" className="px-4 py-3">
          <AlertTitle className="text-base">No se pudieron cargar los clientes</AlertTitle>
          <AlertDescription>Compruebe su conexión e inténtelo de nuevo.</AlertDescription>
        </Alert>
      )}

      {!customers ? (
        <Skeleton className="h-96 w-full" />
      ) : filtered.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyTitle>Ningún cliente coincide</EmptyTitle>
            <EmptyDescription>Prueba con otro DNI, nombre o estado.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-xl ring-1 ring-foreground/10">
          <Table>
            <caption className="sr-only">Clientes inscritos en el programa</caption>
            <TableHeader>
              <TableRow>
                <SortableHead sortKey="name" sort={sort} onSort={toggleSort}>Cliente</SortableHead>
                <SortableHead sortKey="enrolledAt" sort={sort} onSort={toggleSort} className="hidden lg:table-cell">
                  Inscrito
                </SortableHead>
                <SortableHead sortKey="balance" sort={sort} onSort={toggleSort} className="text-right">
                  Saldo
                </SortableHead>
                <SortableHead sortKey="lastOperationAt" sort={sort} onSort={toggleSort} className="hidden md:table-cell">
                  Última operación
                </SortableHead>
                <TableHead scope="col">Estado</TableHead>
                <TableHead scope="col" className="w-14">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((customer) => (
                <TableRow
                  key={customer.nationalId}
                  className="h-11 cursor-pointer"
                  onClick={() => setSelected(customer.nationalId)}
                >
                  <TableCell>
                    <button
                      type="button"
                      className="flex min-h-10 flex-col items-start rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelected(customer.nationalId)
                      }}
                    >
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        DNI {customer.nationalId}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                    {formatDate(customer.enrolledAt)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {numberFormat.format(customer.balance)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums md:table-cell">
                    {customer.lastOperationAt
                      ? formatDateTime(customer.lastOperationAt)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.status === "active" ? "default" : "outline"}
                      className="h-6 px-2.5 text-sm"
                    >
                      {customer.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-10"
                          aria-label={`Acciones de ${customer.name}`}
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setSelected(customer.nationalId)}>
                          Ver detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => void copyNationalId(customer.nationalId)}>
                          Copiar DNI
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="Paginación" className="flex items-center justify-end gap-3">
          <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            Página {currentPage} de {pageCount}
          </p>
          <Button
            variant="outline"
            className="h-10 px-4"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4"
            disabled={currentPage === pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </nav>
      )}

      <CustomerSheet
        mode={mode}
        nationalId={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
