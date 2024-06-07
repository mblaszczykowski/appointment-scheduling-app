import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import logo from '../../logo.svg';
import {request} from "../../util/axios_helper";

export default function Header({isLoggedIn, onLogout}) {
    const [calendarUrl, setCalendarUrl] = useState('');
    useEffect(() => {
        const fetchCalendarUrl = () => {
            if (!isLoggedIn) {
                setCalendarUrl('');
                return;
            }
            request('GET', `/api/users`, {})
                .then((response) => {
                    setCalendarUrl(response.data.calendarUrl);
                })
                .catch((error) => {
                    console.error("Failed to fetch user's calendarUrl:", error);
                    setCalendarUrl('');
                });
        };

        fetchCalendarUrl();
    }, [isLoggedIn]);
    return (
        <header className="flex justify-center w-full py-4 z-50">
            <nav className="relative max-w-7xl w-full flex justify-between items-center px-4 md:px-8 mx-auto"
                 aria-label="Global">
                <Link className="flex items-center justify-center md:justify-start"
                      to={isLoggedIn ? "/dashboard" : "/"}>
                    <img src={logo} className="mr-3 h-6 sm:h-10" alt="Logo"/>
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
                                  to={"/calendar/" + calendarUrl}>
                                My Calendar
                            </Link>
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
                        </React.Fragment>
                    )}
                </div>
            </nav>
        </header>
    );
};
