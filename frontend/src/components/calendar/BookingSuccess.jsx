import React from 'react';
import {Link} from "react-router-dom";

function ErrorPage() {
    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Booking succeed</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">Congratulations! You have successfully booked an
                    appointment.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default ErrorPage;
