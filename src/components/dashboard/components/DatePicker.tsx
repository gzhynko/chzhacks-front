"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/components/shadcn-ui/lib/utils"
import { Button } from "@/components/shadcn-ui/button"
import { Calendar } from "@/components/shadcn-ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-ui/popover"
import { useState } from "react"

export interface DatePickerProps {
  date: Date;
  placeholder?: string;
  onSelect: (date: Date|undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({date, placeholder, onSelect}) => {
  const [open, setOpen] = useState(false);

  const onCalendarSelect = (date: Date | undefined) => {
    setOpen(false);
    onSelect(date);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onCalendarSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
