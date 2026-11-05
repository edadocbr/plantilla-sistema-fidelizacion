import { Suspense } from "react"

import { CustomerScreen } from "@/components/customer/customer-screen"

export const metadata = {
  title: "Mi pase · Fidelización",
}

/**
 * Pase digital del cliente. El modo, la cantidad de sellos y el documento
 * vendrán de la sesión y de la configuración del comercio; mientras tanto se
 * pueden probar con ?mode=stamps, ?maxStamps=8, ?nationalId=12345678 y
 * ?sessionTimeoutMs=10000.
 */
export default function CustomerPage(props: PageProps<"/customer">) {
  return (
    <Suspense>
      <ConfiguredCustomer searchParams={props.searchParams} />
    </Suspense>
  )
}

function positiveInt(value: string | string[] | undefined) {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

async function ConfiguredCustomer({
  searchParams,
}: {
  searchParams: PageProps<"/customer">["searchParams"]
}) {
  const params = await searchParams
  const mode = params.mode === "stamps" ? "stamps" : "points"
  const nationalId =
    typeof params.nationalId === "string" && /^\d{8}$/.test(params.nationalId)
      ? params.nationalId
      : "70123456"

  return (
    <CustomerScreen
      nationalId={nationalId}
      mode={mode}
      maxStamps={positiveInt(params.maxStamps)}
      sessionTimeoutMs={positiveInt(params.sessionTimeoutMs)}
    />
  )
}
