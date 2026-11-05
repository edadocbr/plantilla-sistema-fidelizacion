"use client"

import { CalendarDays } from "lucide-react"
import { es } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DateRange } from "@/lib/admin/types"
import { formatDate, fromDateKey, toDateKey } from "@/lib/admin/format"

type Props = {
  range: DateRange
  active: boolean
  onChange: (range: DateRange) => void
}

export function DateRangePicker({ range, active, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={active ? "secondary" : "outline"}
          className="h-10 gap-2 px-3 text-sm tabular-nums"
        >
          <CalendarDays aria-hidden="true" />
          {formatDate(range.from)} – {formatDate(range.to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="range"
          locale={es}
          numberOfMonths={2}
          defaultMonth={fromDateKey(range.from)}
          selected={{ from: fromDateKey(range.from), to: fromDateKey(range.to) }}
          disabled={{ after: new Date() }}
          onSelect={(selected) => {
            if (selected?.from && selected.to) {
              onChange({
                from: toDateKey(selected.from),
                to: toDateKey(selected.to),
              })
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
