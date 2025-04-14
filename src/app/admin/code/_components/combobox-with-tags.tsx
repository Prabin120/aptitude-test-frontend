"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type TagItem = {
    id: string
    name: string
    count?: number
}

interface ComboboxWithTagsProps {
    items: TagItem[]
    placeholder?: string
    emptyText?: string
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    className?: string
}

export function ComboboxWithTags({
    items,
    placeholder = "Select or create items...",
    emptyText = "No items found.",
    value,
    onChange,
    disabled = false,
    className,
}: ComboboxWithTagsProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    // Parse comma-separated values into an array
    const selectedValues = React.useMemo(() => {
        return (typeof value === "string" ? value : "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
    }, [value])

    // Filter items based on input
    const filteredItems = React.useMemo(() => {
        if (!inputValue) return items

        const lowerInput = inputValue.toLowerCase()
        return items.filter((item) => item.name.toLowerCase().includes(lowerInput) && !selectedValues.includes(item.id))
    }, [items, inputValue, selectedValues])

    // Handle selecting an item
    const handleSelect = (itemId: string) => {
        // Find the selected item
        const item = items.find((i) => i.id === itemId)

        if (item) {
            // Add to selected values if not already included
            if (!selectedValues.includes(itemId)) {
                const newValues = [...selectedValues, itemId]
                onChange(newValues.join(", "))
            }

            // Clear input and close popover
            setInputValue("")
            setOpen(false)
        }
    }

    // Handle creating a new item
    const handleCreateItem = () => {
        if (!inputValue.trim()) return

        // Check if this is a new value
        const newValue = inputValue.trim()
        const normalizedValue = newValue.toLowerCase().replace(/\s+/g, "-")

        if (!selectedValues.includes(normalizedValue)) {
            const newValues = [...selectedValues, normalizedValue]
            onChange(newValues.join(", "))
        }

        // Clear input and close popover
        setInputValue("")
        setOpen(false)
    }

    // Remove a selected item
    const removeItem = (itemId: string) => {
        const newValues = selectedValues.filter((v) => v !== itemId)
        onChange(newValues.join(", "))
    }

    // Get display names for selected values
    const selectedLabels = React.useMemo(() => {
        return selectedValues.map((id) => {
            const item = items.find((item) => item.id === id)
            return item ? item.name : id
        })
    }, [selectedValues, items])

    // Handle input keydown events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Create item on Enter
        if (e.key === "Enter" && inputValue) {
            e.preventDefault()
            handleCreateItem()
        }

        // Remove last item on Backspace if input is empty
        if (e.key === "Backspace" && !inputValue && selectedValues.length > 0) {
            e.preventDefault()
            const newValues = [...selectedValues]
            newValues.pop()
            onChange(newValues.join(", "))
        }
    }

    return (
        <div className="relative">
            <div
                className={cn(
                    "flex flex-wrap gap-1.5 p-2 min-h-10 rounded-md border border-input bg-background text-sm ring-offset-background",
                    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    disabled && "opacity-50 cursor-not-allowed",
                    className,
                )}
                onClick={() => !disabled && setOpen(true)}
            >
                {selectedLabels.map((label, i) => (
                    <Badge key={i} variant="secondary" className="mr-1 mb-1">
                        {label}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                if (!disabled) removeItem(selectedValues[i])
                            }}
                            disabled={disabled}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {label}</span>
                        </Button>
                    </Badge>
                ))}

                <Popover open={open && !disabled} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <input
                            className={cn(
                                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]",
                                disabled && "cursor-not-allowed",
                            )}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={selectedValues.length === 0 ? placeholder : ""}
                            disabled={disabled}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search..." value={inputValue} onValueChange={setInputValue} />
                            <CommandList>
                                {filteredItems.length === 0 ? (
                                    <CommandEmpty>
                                        {emptyText}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 w-full justify-start text-primary"
                                            onClick={handleCreateItem}
                                        >
                                            Create &quot;{inputValue}&quot;
                                        </Button>
                                    </CommandEmpty>
                                ) : (
                                    <CommandGroup>
                                        {filteredItems.map((item) => (
                                            <CommandItem key={item.id} value={item.id} onSelect={() => handleSelect(item.id)}>
                                                <Check
                                                    className={cn("mr-2 h-4 w-4", selectedValues.includes(item.id) ? "opacity-100" : "opacity-0")}
                                                />
                                                {item.name}
                                                {item.count !== undefined && (
                                                    <span className="ml-auto text-xs text-muted-foreground">({item.count})</span>
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

