import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { FormControl } from './ui/form'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'

function DateAndTime({ field, disableField, disablePastDate }: Readonly<{ field: { value: Date; onChange: (date: Date) => void }; disableField?: boolean; disablePastDate?: boolean }>) {
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number)
        const newDate = new Date(field.value)
        newDate.setHours(hours??0)
        newDate.setMinutes(minutes??0)
        const now = new Date()
        if (!disablePastDate && newDate.toDateString() === now.toDateString() && newDate < now) {
            field.onChange(now)
        } else {
            field.onChange(newDate)
        }
    }
    const now = new Date()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        disabled={disableField}
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                        )}
                    >
                        {field.value ? format(field.value, "PPP HH:mm"): "Select Date and Time"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => date && field.onChange(date)}
                    disabled={(date) => {
                        if (!disablePastDate) return false
                        return date < new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    }}
                    initialFocus
                />
                <div className="p-3 border-t">
                    <Input
                        disabled={disableField}
                        type="time"
                        onChange={handleTimeChange}
                        value={field.value ? format(field.value, "HH:mm") : ""}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateAndTime