import * as React from "react";

export default function Footer(props) {
    return (
        <div className="max-w-[85rem] px-4 mb-10 sm:px-6 lg:px-8 lg:mb-14 mx-auto">

        <div
            className="py-3 flex items-center text-sm text-gray-800 gap-x-1.5 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-700">
                        <span
                            className="font-semibold bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                          Web Application Technologies
                        </span>
            team project
        </div>
        </div>
    );
};