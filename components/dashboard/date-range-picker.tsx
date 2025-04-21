"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onRangeChange: (start: Date | undefined, end: Date | undefined) => void
  className?: string
}

export function DateRangePicker({ startDate, endDate, onRangeChange, className }: DateRangePickerProps) {
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const handleStartDateSelect = (date: Date | undefined) => {
    onRangeChange(date, endDate)
    setIsStartOpen(false)
    if (!endDate) {
      setIsEndOpen(true)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    onRangeChange(startDate, date)
    setIsEndOpen(false)
  }

  const handleClear = () => {
    onRangeChange(undefined, undefined)
  }

  const handleQuickSelect = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    onRangeChange(start, end)
  }

  return (
    <div className={cn("flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0", className)}>
      <div className="flex space-x-2">
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[200px]",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus locale={ptBR} />
          </PopoverContent>
        </Popover>

        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[200px]",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              initialFocus
              locale={ptBR}
              disabled={(date) => (startDate ? date < startDate : false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleQuickSelect(7)}>
          7 dias
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickSelect(30)}>
          30 dias
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          Limpar
        </Button>
      </div>
    </div>
  )
}
