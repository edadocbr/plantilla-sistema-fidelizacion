"use client"

import { useEffect, useRef } from "react"

type Bindings = Record<string, () => void>

const SEQUENCE_WINDOW_MS = 900

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  )
}

/**
 * Atajos de teclado. Claves admitidas: una tecla ("/"), una secuencia ("g c")
 * o una combinación con control ("mod+s"). Las teclas simples se ignoran
 * mientras se escribe en un campo.
 */
export function useHotkeys(bindings: Bindings) {
  const bindingsRef = useRef(bindings)

  useEffect(() => {
    bindingsRef.current = bindings
  })

  useEffect(() => {
    let pending: { key: string; at: number } | null = null

    function onKeyDown(event: KeyboardEvent) {
      const current = bindingsRef.current
      const key = event.key.toLowerCase()

      if ((event.ctrlKey || event.metaKey) && !event.altKey) {
        const handler = current[`mod+${key}`]
        if (handler) {
          event.preventDefault()
          handler()
        }
        return
      }
      if (event.altKey || isEditable(event.target)) return

      if (pending && Date.now() - pending.at < SEQUENCE_WINDOW_MS) {
        const handler = current[`${pending.key} ${key}`]
        pending = null
        if (handler) {
          event.preventDefault()
          handler()
          return
        }
      }

      const single = current[key]
      if (single) {
        event.preventDefault()
        single()
        return
      }
      pending = { key, at: Date.now() }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}
