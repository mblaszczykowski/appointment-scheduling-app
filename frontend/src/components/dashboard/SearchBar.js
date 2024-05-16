import React from 'react';
import { SearchIcon } from '../Icons';

const SearchBar = ({ searchQuery, handleSearchChange }) => (
    <div className="mb-4">
        <label htmlFor="icon" className="sr-only">
            Search
        </label>
        <div className="relative min-w-72 md:min-w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-3">
                <SearchIcon />
            </div>
            <input
                type="text"
                id="icon"
                name="icon"
                className="py-2 pl-10 pr-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Search by booker name"
                value={searchQuery}
                onChange={handleSearchChange}
            />
        </div>
    </div>
);

export default SearchBar;
