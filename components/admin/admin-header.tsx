"use client"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { useAdmin } from "./admin-context"

const SECTION_LABELS: Record<string, string> = {
  "/admin": "Resumen",
  "/admin/customers": "Clientes",
  "/admin/program": "Programa",
}

export function AdminHeader({ pathname }: { pathname: string }) {
  const { program } = useAdmin()
  const section = SECTION_LABELS[pathname] ?? "Administración"

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger className="size-10 lg:hidden" aria-label="Abrir menú" />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:inline-flex">
            Mi comercio
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{section}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2" aria-live="polite">
        {program === undefined ? null : program === null ? (
          <Badge variant="outline" className="h-6 px-2.5 text-sm">
            Sin programa
          </Badge>
        ) : (
          <>
            <Badge variant="secondary" className="h-6 px-2.5 text-sm">
              {program.mode === "points" ? "Puntos" : "Sellos"}
            </Badge>
            <Badge
              variant={program.active ? "default" : "outline"}
              className="h-6 px-2.5 text-sm"
            >
              {program.active ? "Activo" : "Inactivo"}
            </Badge>
          </>
        )}
      </div>
    </header>
  )
}
