import * as React from "react";
import {useEffect, useState} from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { CheckIcon, StarIcon } from '../Icons';
import Footer from "./Footer";

export default function WelcomeContent({ show }) {
    const [showForm, setShowForm] = useState(show);
    const navigate = useNavigate();

    const handleResetForm = () => {
        navigate('/reset-password');
    };
    const handleToggleForm = () => {
        setShowForm((prev) => (prev === "login" ? "register" : "login"));
    };

    useEffect(() => {
        let isLoggedIn = localStorage.getItem("auth_token") !== null;
        if(isLoggedIn) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <React.Fragment>
            <div className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
                <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                    <div className="grid items-center md:grid-cols-2 lg:mb-8">
                        <div className="max-w-2xl mx-auto p-14">
                            <div className="max-w-2xl">
                                <h1 className="pb-2 block font-semibold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500 text-3xl md:text-5xl lg:text-5xl dark:from-black dark:to-blue-800">
                                    The Intuitive Appointment<br /> Scheduling
                                </h1>
                            </div>
                            <div className="mt-3 max-w-3xl">
                                <p className="text-lg text-gray-600 dark:text-neutral-400">
                                    Meetly is a platform designed to streamline
                                    <br />
                                    meeting and appointment scheduling effortlessly.
                                </p>
                            </div>
                            <div className="pt-6">
                                <ul className="space-y-2 sm:space-y-4">
                                    <li className="flex space-x-3">
                                        <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                                            <CheckIcon className="flex-shrink-0 size-3.5" />
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                                            <span className="font-bold">Simplify</span> your
                                            scheduling with easy calendar setup
                                        </span>
                                    </li>
                                    <li className="flex space-x-3">
                                        <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                                            <CheckIcon className="flex-shrink-0 size-3.5" />
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                                            Allow others to book your available slots{" "}
                                            <span className="font-bold">in just a few clicks</span>
                                        </span>
                                    </li>
                                    <li className="flex space-x-3">
                                        <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                                            <CheckIcon className="flex-shrink-0 size-3.5" />
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                                            Get <span className="font-bold">automatic</span> email
                                            reminders for all appointments
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 flex items-center gap-x-5">
                                <div className="flex -space-x-2">
                                    <img
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
                                        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                                        alt="Image Description"
                                    />
                                    <img
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
                                        src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                                        alt="Image Description"
                                    />
                                    <img
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
                                        src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                                        alt="Image Description"
                                    />

                                    <span className="inline-flex justify-center items-center h-8 w-8 rounded-full bg-blue-600 text-white ring-2 ring-white">
                                        <StarIcon className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-neutral-500">
                                    Rated best by over 500 reviews
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto px-4">
                                <div className="p-4 mt-6 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">
                                    {showForm !== "login" ? (
                                        <RegisterForm
                                            onToggleForm={handleToggleForm}
                                        />
                                    ) : (
                                        <LoginForm
                                            onToggleForm={handleToggleForm}
                                            onResetForm={handleResetForm}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <>
                        <div className="max-w-[85rem] px-4 mt-8 sm:px-6 lg:px-8 lg:mt-14 mx-auto mb-8">
                            <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between">
                                <div className="lg:w-1/3">
                                    <div className="lg:pe-6 xl:pe-12 ml-20">
                                        <p className="text-4xl font-bold leading-10 text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                            1,000+
                                            <span className="ml-3 ms-1 inline-flex items-center gap-x-1 bg-gray-200 font-medium text-gray-800 text-xs leading-4 rounded-full py-0.5 px-2 dark:bg-neutral-800 dark:text-neutral-300">
                                                +20% this month
                                            </span>
                                        </p>
                                        <p className="mt-2 sm:mt-3 text-gray-900 dark:text-neutral-500">
                                            Professionals use our app<br /> for scheduling meetings
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:w-2/3 flex justify-center mt-4">
                                    <div className="grid gap-6 grid-cols-2 sm:gap-8">
                                        <div className="col-span-1">
                                            <p className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                                10,000+
                                            </p>
                                            <p className="mt-1 text-gray-900 dark:text-neutral-500">
                                                Appointments scheduled this year
                                            </p>
                                        </div>
                                        <div className="col-span-1 ml-10">
                                            <p className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                                100+
                                            </p>
                                            <p className="mt-1 text-gray-900 dark:text-neutral-500">
                                                Businesses trust our platform
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            </div>
            <Footer/>
        </React.Fragment>
    );
}
