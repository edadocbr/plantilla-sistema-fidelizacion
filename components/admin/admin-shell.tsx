"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useHotkeys } from "@/hooks/use-hotkeys"
import type { Program } from "@/lib/admin/types"
import { getProgram } from "@/lib/cashier/mock-api"
import type { LoyaltyMode } from "@/lib/cashier/types"

import { AdminContext } from "./admin-context"
import { AdminHeader } from "./admin-header"
import { AppSidebar } from "./app-sidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const mode: LoyaltyMode =
    searchParams.get("mode") === "stamps" ? "stamps" : "points"
  const demoEmpty = searchParams.get("program") === "none"
  const query = searchParams.toString()

  const [program, setProgram] = useState<Program | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const loaded = demoEmpty ? null : await getProgram(mode)
      if (!cancelled) setProgram(loaded)
    })()
    return () => {
      cancelled = true
    }
  }, [mode, demoEmpty])

  const go = (path: string) =>
    router.push(query ? `${path}?${query}` : path)

  useHotkeys({
    "g r": () => go("/admin"),
    "g c": () => go("/admin/customers"),
    "g p": () => go("/admin/program"),
  })

  return (
    <AdminContext.Provider value={{ mode, program, setProgram, query }}>
      <TooltipProvider>
        <SidebarProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Saltar al contenido
          </a>
          <AppSidebar pathname={pathname} />
          <SidebarInset>
            <AdminHeader pathname={pathname} />
            <main
              id="main"
              tabIndex={-1}
              className="flex flex-1 flex-col gap-4 p-4 outline-none lg:p-6"
            >
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AdminContext.Provider>
  )
}
