import React from 'react';
import Pagination from 'react-paginate';

interface IPaginationProps {
    totalPages: number;
    currentPage: number;
    onChangePage: (val: number) => void;
}

import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationComponent: React.FC<IPaginationProps> = ({ totalPages, currentPage, onChangePage }) => {
    if (totalPages <= 1) return null;

    const handlePageChange = (data: { selected: number }) => {
        onChangePage(data.selected + 1);
    };

    return (
        <div className='flex flex-col sm:flex-row justify-between items-center my-3 bg-neutral-800 px-2 rounded-sm py-2 gap-4'>
            <div className="text-sm">Current Page: {currentPage}</div>
            <div aria-label="Pagination Navigation" className="w-full sm:w-auto">
                <Pagination
                    previousLabel={<ChevronLeft className="h-4 w-4" />}
                    nextLabel={<ChevronRight className="h-4 w-4" />}
                    breakLabel="..."
                    pageCount={totalPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    forcePage={currentPage - 1} // `currentPage` is 1-based
                    onPageChange={handlePageChange}
                    containerClassName="flex flex-wrap justify-center items-center gap-2"
                    pageClassName="rounded-md overflow-hidden"
                    pageLinkClassName="block px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-sm transition-colors"
                    activeClassName="!bg-primary"
                    activeLinkClassName="!bg-primary !text-primary-text font-medium"
                    previousClassName="rounded-md overflow-hidden"
                    previousLinkClassName="block p-1 bg-neutral-700 hover:bg-neutral-600 transition-colors flex items-center justify-center"
                    nextClassName="rounded-md overflow-hidden"
                    nextLinkClassName="block p-1 bg-neutral-700 hover:bg-neutral-600 transition-colors flex items-center justify-center"
                    breakClassName="self-center"
                    breakLinkClassName="text-neutral-400"
                    disabledClassName="opacity-50 pointer-events-none"
                />
            </div>
            <div className="hidden sm:block"></div>
        </div>
    );
};

export default PaginationComponent;