import React from 'react';
import Pagination from 'react-paginate';

interface IPaginationProps {
    totalPages: number;
    currentPage: number;
    onChangePage: (val: number) => void;
}

const PaginationComponent: React.FC<IPaginationProps> = ({ totalPages, currentPage, onChangePage }) => {
    if (totalPages <= 1) return null;

    const handlePageChange = (data: { selected: number }) => {
        onChangePage(data.selected + 1);
    };

    return (
        <div className='flex justify-between items-center my-3 bg-neutral-800 px-2 rounded-sm'>
            <div>Current Page: {currentPage}</div>
            <div aria-label="Pagination Navigation flex flex-row">
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
            <div></div>
        </div>
    );
};

export default PaginationComponent;