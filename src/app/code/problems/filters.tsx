import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'

interface IFilters {
    title: string
    difficulty: string
    status: string
}

const difficultyMap = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
}

const statusMap = {
    solve: "Solve",
    attempted: "Attemted"
}

const QuestionsFilters = ({ searchQuery, setSearchQuery, filteredProblems }: { searchQuery: IFilters, setSearchQuery: (val: IFilters) => void, filteredProblems: ()=>void }) => {
    useEffect(() => {
        const debounceTimeout =setTimeout(() => {
            filteredProblems();
        }, 500);
        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, filteredProblems]);
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                        {difficultyMap[searchQuery.difficulty as keyof typeof difficultyMap]??"Difficulty"} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, difficulty: ''})}>All</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, difficulty: 'easy'})}>Easy</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, difficulty: 'medium'})}>Medium</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, difficulty: 'hard'})}>Hard</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button variant="outline">
                        {statusMap[searchQuery.status as keyof typeof statusMap] ?? "Status"} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, status: ''})}>All</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, status: 'solved'})}>Solved</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSearchQuery({...searchQuery, status: 'attempted'})}>Attempted</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex items-center space-x-2">
                <Input
                    type="search"
                    placeholder="Search questions"
                    className="md:w-full lg:w-64"
                    value={searchQuery.title}
                    onChange={(e) => setSearchQuery({...searchQuery, title :e.target.value})}
                />
            </div>
        </div>
    )
}

export default QuestionsFilters