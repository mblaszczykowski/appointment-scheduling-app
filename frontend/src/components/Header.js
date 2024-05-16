import * as React from 'react';
import {Link} from 'react-router-dom';

export default function Header({isLoggedIn, onLogout}) {
    return (
        <header className="flex justify-center w-full py-4 z-50">
            <nav className="relative max-w-7xl w-full flex justify-between items-center px-4 md:px-8 mx-auto"
                 aria-label="Global">
                <Link className="flex items-center justify-center md:justify-start"
                      to={isLoggedIn ? "/dashboard" : "/"}>
                    <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Logo"/>
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">Meetly</span>
                </Link>

                <div className="flex items-center gap-x-2 py-1">
                    {!isLoggedIn ? (
                        <React.Fragment>
                            <Link to={"/register"}
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500">
                                Sign up
                            </Link>
                            <Link to={"/login"}
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white">
                                Log in
                            </Link>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Link type="Link"
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
                                  to={"/dashboard"}>
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white"
                                onClick={onLogout}>
                                Log out
                            </button>
                            <Link to="/settings">
                                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="15" r="3"></circle>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M10 15H6a4 4 0 0 0-4 4v2"></path>
                                    <path d="m21.7 16.4-.9-.3"></path>
                                    <path d="m15.2 13.9-.9-.3"></path>
                                    <path d="m16.6 18.7.3-.9"></path>
                                    <path d="m19.1 12.2.3-.9"></path>
                                    <path d="m19.6 18.7-.4-1"></path>
                                    <path d="m16.8 12.3-.4-1"></path>
                                    <path d="m14.3 16.6 1-.4"></path>
                                    <path d="m20.7 13.8 1-.4"></path>
                                </svg>
                            </Link>


                        </React.Fragment>
                    )}
                </div>
            </nav>
        </header>
    );
};
