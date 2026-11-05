import { Suspense } from "react"

import { AdminShell } from "@/components/admin/admin-shell"

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  )
}
