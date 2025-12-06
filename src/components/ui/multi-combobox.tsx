"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

export type ComboboxItem = {
  value: string
  label: string
}

interface MultiComboboxProps {
  items: ComboboxItem[]
  placeholder?: string
  emptyText?: string
  createText?: string
  loadingText?: string
  value: string[]
  onChange: (value: string[]) => void
  onSearch: (query: string) => Promise<void>
  onCreateItem?: (value: string) => Promise<ComboboxItem | null>
  disabled?: boolean
  className?: string
}

export function MultiCombobox({
  items,
  placeholder = "Select items...",
  emptyText = "No items found.",
  createText = "Create new",
  loadingText = "Loading...",
  value,
  onChange,
  onSearch,
  onCreateItem,
  disabled = false,
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [creatingItem, setCreatingItem] = React.useState(false)
  const debouncedInput = useDebounce(inputValue, 300)

  // Fetch items when input changes
  React.useEffect(() => {
    const fetchItems = async () => {
      if (debouncedInput) {
        setLoading(true)
        try {
          await onSearch(debouncedInput)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchItems()
  }, [debouncedInput, onSearch])

  // Handle creating a new item
  const handleCreateItem = async () => {
    if (!inputValue.trim() || !onCreateItem) return

    setCreatingItem(true)
    try {
      const newItem = await onCreateItem(inputValue.trim())
      if (newItem) {
        // Add the new item to the selected values
        onChange([...value, newItem.value])
        setInputValue("")
      }
    } finally {
      setCreatingItem(false)
    }
  }

  // Handle selecting an item
  const handleSelect = (itemValue: string) => {
    const isSelected = value.includes(itemValue)
    
    if (isSelected) {
      onChange(value.filter(v => v !== itemValue))
    } else {
      onChange([...value, itemValue])
    }
  }

  // Remove a selected item
  const removeItem = (itemValue: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(value.filter(v => v !== itemValue))
  }

  // Get labels for selected values
  const selectedLabels = React.useMemo(() => {
    return value.map(v => {
      const item = items.find(item => item.value === v)
      return item ? item.label : v
    })
  }, [value, items])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, i) => (
                <Badge key={i} variant="secondary" className="mr-1 mb-1">
                  {label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => removeItem(value[i], e)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>{loadingText}</CommandEmpty>
            ) : items.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(item.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {inputValue.trim() && onCreateItem && !items.some(item => 
              item.label.toLowerCase() === inputValue.trim().toLowerCase()
            ) && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreateItem}
                    disabled={creatingItem}
                    className="text-primary"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {creatingItem ? "Creating..." : `${createText} "${inputValue}"`}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
