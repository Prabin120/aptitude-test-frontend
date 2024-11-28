import React from 'react';
import Pagination from 'react-paginate';

interface IPaginationProps {
    totalPages: number;
    currentPage: number;
    onChangePage: (val: number) => void;
}

const PaginationComponent: React.FC<IPaginationProps> = ({ totalPages, currentPage, onChangePage }) => {
    // Prevent rendering if there's only one page
    if (totalPages <= 1) return null;

    const handlePageChange = (data: { selected: number }) => {
        // `data.selected` is zero-based index, so add 1 for actual page number
        onChangePage(data.selected + 1);
    };

    return (
        <div aria-label="Pagination Navigation">
            <Pagination className='flex justify-center gap-5 py-2 px-6 rounded-sm bg-neutral-800'
                previousLabel="Prev"
                nextLabel="Next"
                breakLabel="..."
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                forcePage={currentPage - 1} // `currentPage` is 1-based
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                previousClassName="previous"
                nextClassName="next"
                pageClassName="page"
                disabledClassName="disabled"
            />
        </div>
    );
};

export default PaginationComponent;