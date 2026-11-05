"use client"

import { useEffect } from "react"

/** Mantiene la pantalla encendida mientras `active` sea `true` (si el navegador lo permite). */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen")
        if (cancelled) {
          void lock.release()
          return
        }
        sentinel = lock
      } catch {
        /* el navegador o el ahorro de batería lo rechazó: no es crítico */
      }
    }

    // El bloqueo se pierde al ocultar la pestaña; se pide de nuevo al volver.
    const onVisibility = () => {
      if (document.visibilityState === "visible") void request()
    }

    void request()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVisibility)
      void sentinel?.release()
    }
  }, [active])
}
