"use client"

import { useEffect, useState } from "react"

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const

/**
 * Devuelve `true` cuando pasan `timeoutMs` sin actividad del usuario.
 * Una vez caducada, la sesión no se reactiva: hay que recargar la página.
 */
export function useSessionTimeout(timeoutMs: number) {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    let timer = setTimeout(() => setExpired(true), timeoutMs)
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setExpired(true), timeoutMs)
    }
    for (const type of ACTIVITY_EVENTS) {
      window.addEventListener(type, reset, { passive: true })
    }
    return () => {
      clearTimeout(timer)
      for (const type of ACTIVITY_EVENTS) {
        window.removeEventListener(type, reset)
      }
    }
  }, [timeoutMs])

  return expired
}
