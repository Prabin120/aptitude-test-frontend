"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CountryCode } from "@/lib/countryCodes"

interface CountryCodeSelectProps {
    countryCodes: CountryCode[]
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function CountryCodeSelect({ countryCodes, value, onChange, disabled = false }: CountryCodeSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    // Find the selected country based on dial code
    const selectedCountry = countryCodes.find((country) => country.dial_code === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-[110px] justify-between"
                >
                    {selectedCountry ? (
                        <span className="flex items-center">
                            <span className="mr-1">{selectedCountry.flag}</span>
                            {selectedCountry.dial_code}
                        </span>
                    ) : (
                        "Select"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {countryCodes.map((country) => (
                                <CommandItem
                                    key={country.code}
                                    value={`${country.name} ${country.dial_code}`}
                                    onSelect={() => {
                                        onChange(country.dial_code)
                                        setOpen(false)
                                        setSearchQuery("")
                                    }}
                                >
                                    <span className="mr-2">{country.flag}</span>
                                    <span className="flex-1 truncate">
                                        {country.name} ({country.dial_code})
                                    </span>
                                    <Check className={cn("ml-auto h-4 w-4", value === country.dial_code ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

