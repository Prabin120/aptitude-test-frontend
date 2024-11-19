import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChevronDown, Shuffle } from 'lucide-react'
import React from 'react'

const QuestionsFilters = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (val: string) => void }) => {
  return (
    <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Difficulty <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Easy</DropdownMenuItem>
              <DropdownMenuItem>Medium</DropdownMenuItem>
              <DropdownMenuItem>Hard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Todo</DropdownMenuItem>
              <DropdownMenuItem>Solved</DropdownMenuItem>
              <DropdownMenuItem>Attempted</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search questions"
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant={"secondary"} className="">
            <Shuffle className="mr-2 h-4 w-4" /> Pick One
          </Button>
        </div>
      </div>
  )
}

export default QuestionsFilters