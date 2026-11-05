import { Suspense } from "react"

import { CashierScreen } from "@/components/cashier/cashier-screen"

export const metadata = {
  title: "Caja · Fidelización",
}

/**
 * Interfaz de Caja. El modo (points | stamps) y la equivalencia de soles por
 * punto vendrán de la configuración del comercio; mientras tanto se pueden
 * probar con ?mode=stamps y ?currencyPerPoint=2.
 */
export default function CashierPage(props: PageProps<"/cashier">) {
  return (
    <Suspense>
      <ConfiguredCashier searchParams={props.searchParams} />
    </Suspense>
  )
}

async function ConfiguredCashier({
  searchParams,
}: {
  searchParams: PageProps<"/cashier">["searchParams"]
}) {
  const params = await searchParams
  const mode = params.mode === "stamps" ? "stamps" : "points"
  const rate = Number(params.currencyPerPoint)
  const currencyPerPoint = Number.isFinite(rate) && rate > 0 ? rate : 1

  return <CashierScreen mode={mode} currencyPerPoint={currencyPerPoint} />
}
