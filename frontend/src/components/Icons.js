import React from 'react';

export const HomeIcon = () => (
    <svg
        className="flex-shrink-0 size-4"
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

export const CalendarIcon = () => (
    <svg
        className="flex-shrink-0 size-4"
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width={18} height={18} x={3} y={4} rx={2} ry={2} />
        <line x1={16} x2={16} y1={2} y2={6} />
        <line x1={8} x2={8} y1={2} y2={6} />
        <line x1={3} x2={21} y1={10} y2={10} />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
    </svg>
);

export const UserIcon = () => (
    <svg
        className="flex-shrink-0 mt-0.5 size-4"
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx={18} cy={15} r={3} />
        <circle cx={9} cy={7} r={4} />
        <path d="M10 15H6a4 4 0 0 0-4 4v2" />
        <path d="m21.7 16.4-.9-.3" />
        <path d="m15.2 13.9-.9-.3" />
        <path d="m16.6 18.7.3-.9" />
        <path d="m19.1 12.2.3-.9" />
        <path d="m19.6 18.7-.4-1" />
        <path d="m16.8 12.3-.4-1" />
        <path d="m14.3 16.6 1-.4" />
        <path d="m20.7 13.8 1-.4" />
    </svg>
);

export const SearchIcon = () => (
    <svg
        className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-neutral-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx={11} cy={11} r={8} />
        <path d="m21 21-4.3-4.3" />
    </svg>
);
