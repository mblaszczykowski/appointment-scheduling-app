import * as React from 'react';

export default function Header(props) {
    return (
        <header className="flex justify-center w-full py-4 z-50">
            <nav className="relative max-w-7xl w-full flex justify-between items-center px-4 md:px-8 mx-auto" aria-label="Global">
                <button className="flex items-center justify-center md:justify-start" onClick={props.isLoggedIn ? props.dashboard : props.welcome}>
                    <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Logo"/>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Meetly</span>
                </button>

                <div className="flex items-center gap-x-2 py-1">
                    {!props.isLoggedIn ? (
                        <React.Fragment>
                            <button type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-600"
                                    onClick={props.register}>
                                Sign up
                            </button>
                            <button type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white"
                                    onClick={props.login}>
                                Log in
                            </button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <button type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-600"
                                    onClick={props.dashboard}>
                                Dashboard
                            </button>
                            <button type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white"
                                    onClick={props.logout}>
                                Log out
                            </button>
                        </React.Fragment>
                    )}
                </div>
            </nav>
        </header>
    );
};
