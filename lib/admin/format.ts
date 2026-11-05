export const numberFormat = new Intl.NumberFormat("es-PE")

const dateFormat = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  year: "numeric",
})
const dateTimeFormat = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

/** Fecha local como `yyyy-mm-dd`. */
export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function fromDateKey(key: string) {
  return new Date(`${key}T00:00:00`)
}

export function formatDate(key: string) {
  return dateFormat.format(fromDateKey(key))
}

export function formatDateTime(iso: string) {
  return dateTimeFormat.format(new Date(iso))
}

export function daysAgoKey(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return toDateKey(date)
}
