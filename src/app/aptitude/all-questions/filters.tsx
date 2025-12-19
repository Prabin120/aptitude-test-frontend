import React from 'react'
import { FilterQuestionProps } from '../commonInterface'
import { Search } from '@/components/ui/search'

interface IfilterQuestionProps {
	searchQuery: FilterQuestionProps,
	setSearchQuery: React.Dispatch<React.SetStateAction<FilterQuestionProps>>
	handleSearchButton: () => void
}

const QuestionsFilters: React.FC<IfilterQuestionProps> = ({ searchQuery, setSearchQuery, handleSearchButton }: IfilterQuestionProps) => {
	return (
		<div className="flex justify-end items-center mb-6 w-full">
			<Search
				value={searchQuery.title}
				onChange={(val) => setSearchQuery({ ...searchQuery, title: val })}
				onClick={handleSearchButton}
				placeholder="Search questions"
				className="w-full sm:w-auto"
			/>
		</div>
	)
}

export default QuestionsFilters