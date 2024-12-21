import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { FilterQuestionProps } from '../commonInterface'
import { Search } from 'lucide-react'
interface IfilterQuestionProps {
	searchQuery: FilterQuestionProps,
	setSearchQuery: React.Dispatch<React.SetStateAction<FilterQuestionProps>>
	handleSearchButton: (e: React.FormEvent<HTMLFormElement>) => void
}

const QuestionsFilters: React.FC<IfilterQuestionProps> = ({ searchQuery, setSearchQuery, handleSearchButton }: IfilterQuestionProps) => {
	return (
		<div className="flex justify-end items-center mb-6">
			<form onSubmit={handleSearchButton} className="flex items-center space-x-2">
				<Input
					type="search"
					placeholder="Search questions"
					className="w-64"
					value={searchQuery.title}
					onChange={(e) => setSearchQuery({ ...searchQuery, title: e.target.value })}
				/>
				<Button type='submit' variant={"secondary"}  className="">
					<Search className="mr-2 h-4 w-4" />
					Search
				</Button>
			</form>
		</div>
	)
}

export default QuestionsFilters