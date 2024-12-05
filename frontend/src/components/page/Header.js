import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.svg';
import { request } from "../../util/axios_helper";

export default function Header({ isLoggedIn, onLogout }) {
    const [calendarUrl, setCalendarUrl] = useState('');
    const [isUserAdmin, setIsUserAdmin] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchCalendarUrl = () => {
            if (!isLoggedIn) {
                setCalendarUrl('');
                return;
            }
            request('GET', `/api/users`, {})
                .then((response) => {
                    setCalendarUrl(response.data.calendarUrl);
                    setIsUserAdmin(response.data.isAdmin);
                })
                .catch((error) => {
                    console.error("Failed to fetch user's calendarUrl:", error);
                    setCalendarUrl('');
                });
        };

        fetchCalendarUrl();
    }, [isLoggedIn]);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="flex justify-center w-full py-4 z-50">
            <nav
                className="relative max-w-7xl w-full flex justify-between items-center px-4 md:px-8 mx-auto"
                aria-label="Global"
            >
                <Link
                    className="flex items-center justify-center md:justify-start"
                    to={isLoggedIn ? "/dashboard" : "/"}
                >
                    <img src={logo} className="mr-3 h-6 sm:h-10" alt="Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                        Meetly
                    </span>
                </Link>

                <div className="flex items-center gap-x-2 py-1">
                    {!isLoggedIn ? (
                        <React.Fragment>
                            <Link
                                to={"/register"}
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
                            >
                                Sign up
                            </Link>
                            <Link
                                to={"/login"}
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white"
                            >
                                Log in
                            </Link>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white whitespace-nowrap"
                                    onClick={toggleMenu}
                                >
                                    Menu
                                </button>
                                {showMenu && (
                                    <div className="absolute top-full mt-2 bg-white border rounded-md shadow-lg p-2 z-10">
                                        <Link
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                                            to={"/dashboard"}
                                            onClick={closeMenu}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                                            to={"/calendar/" + calendarUrl}
                                            onClick={closeMenu}
                                        >
                                            My Calendar
                                        </Link>
                                        {isUserAdmin && (
                                            <Link
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                                                to={"/adminpage/"}
                                                onClick={closeMenu}
                                            >
                                                Admin Page
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                                            onClick={() => {
                                                onLogout();
                                                closeMenu();
                                            }}
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </nav>
        </header>
    );
}
