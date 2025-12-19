import { Input } from "./input"
import { Button } from "./button"
import { Search as SearchIcon } from "lucide-react"

interface SearchProps {
    onClick: () => void
    onChange: (value: string) => void
    value: string
    className?: string
    placeholder?: string
}

export const Search = ({ onClick, onChange, value, className, placeholder = "Search..." }: SearchProps) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClick()
                    }
                }}
            />
            <Button onClick={() => onClick()} size="icon" variant="outline">
                <SearchIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}