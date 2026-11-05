"use client"

import Link from "next/link"
import { LayoutDashboard, Settings2, UserCircle, Users } from "lucide-react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAdmin } from "./admin-context"

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, keys: "r" },
  { href: "/admin/customers", label: "Clientes", icon: Users, keys: "c" },
  { href: "/admin/program", label: "Programa", icon: Settings2, keys: "p" },
] as const

export function AppSidebar({ pathname }: { pathname: string }) {
  const { query } = useAdmin()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-14 justify-center border-b px-4">
        <p className="text-base font-semibold">Fidelización</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu aria-label="Secciones">
              {NAV.map(({ href, label, icon: Icon, keys }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    className="h-10 text-sm"
                  >
                    <Link
                      href={query ? `${href}?${query}` : href}
                      aria-current={pathname === href ? "page" : undefined}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                      <KbdGroup className="ml-auto" aria-hidden="true">
                        <Kbd>g</Kbd>
                        <Kbd>{keys}</Kbd>
                      </KbdGroup>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Marcador de posición: el inicio de sesión queda fuera de alcance. */}
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 text-sm">
          <UserCircle className="size-5 text-muted-foreground" aria-hidden="true" />
          <span>Administrador</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
