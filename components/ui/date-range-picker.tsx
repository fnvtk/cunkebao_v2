"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "选择日期范围",
  disabled = false,
}: DateRangePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate?.from ? (
              selectedDate.to ? (
                <>
                  {format(selectedDate.from, "yyyy年MM月dd日", { locale: zhCN })} -{" "}
                  {format(selectedDate.to, "yyyy年MM月dd日", { locale: zhCN })}
                </>
              ) : (
                format(selectedDate.from, "yyyy年MM月dd日", { locale: zhCN })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// 预设日期范围选项
export const DateRangePresets = {
  today: {
    label: "今天",
    range: {
      from: new Date(),
      to: new Date(),
    },
  },
  yesterday: {
    label: "昨天",
    range: {
      from: addDays(new Date(), -1),
      to: addDays(new Date(), -1),
    },
  },
  last7Days: {
    label: "最近7天",
    range: {
      from: addDays(new Date(), -6),
      to: new Date(),
    },
  },
  last30Days: {
    label: "最近30天",
    range: {
      from: addDays(new Date(), -29),
      to: new Date(),
    },
  },
  thisMonth: {
    label: "本月",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  },
  lastMonth: {
    label: "上月",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  },
}

// 带预设选项的日期范围选择器
interface DateRangePickerWithPresetsProps extends DateRangePickerProps {
  showPresets?: boolean
  presets?: typeof DateRangePresets
}

export function DateRangePickerWithPresets({
  className,
  date,
  onDateChange,
  placeholder = "选择日期范围",
  disabled = false,
  showPresets = true,
  presets = DateRangePresets,
}: DateRangePickerWithPresetsProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const handlePresetSelect = (preset: { label: string; range: DateRange }) => {
    handleDateSelect(preset.range)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate?.from ? (
              selectedDate.to ? (
                <>
                  {format(selectedDate.from, "yyyy年MM月dd日", { locale: zhCN })} -{" "}
                  {format(selectedDate.to, "yyyy年MM月dd日", { locale: zhCN })}
                </>
              ) : (
                format(selectedDate.from, "yyyy年MM月dd日", { locale: zhCN })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {showPresets && (
              <div className="border-r p-3">
                <div className="text-sm font-medium mb-2">快速选择</div>
                <div className="space-y-1">
                  {Object.entries(presets).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDate?.from}
                selected={selectedDate}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                locale={zhCN}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRangePicker
