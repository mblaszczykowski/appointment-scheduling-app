import * as React from "react";
import { useState } from "react";
import SettingsForm from "./SettingsForm";

export default function SettingsContent({ onRegister, onLogin, show }) {
    const [showForm, setShowForm] = useState(show);

    const handleToggleForm = () => {
        setShowForm((prev) => (prev === "login" ? "register" : "login"));
    };

    return (
        <React.Fragment>
            <div className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
                <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                    <div className="grid items-center md:grid-cols-2 lg:mb-8">
                        <div className="max-w-2xl mx-auto p-14">
                            <div className="max-w-2xl">
                                <h1 className="pb-1 block font-semibold text-transparent bg-clip-text bg-gradient-to-b from-black to-blue-500 text-4xl md:text-5xl lg:text-6xl dark:from-black dark:to-blue-800">
                                    Manage your Meetly Cloud account
                                </h1>
                            </div>
                            <div className="mt-5 max-w-3xl">
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
                                          <svg
                                              className="flex-shrink-0 size-3.5"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width={24}
                                              height={24}
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                          >
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                                          <span className="font-bold">Simplify</span> your
                                          scheduling with easy calendar setup
                                        </span>
                                    </li>
                                    <li className="flex space-x-3">
                    <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                      <svg
                          className="flex-shrink-0 size-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                                        <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                      Allow others to book your available slots{" "}
                                            <span className="font-bold">in just a few clicks</span>
                    </span>
                                    </li>
                                    <li className="flex space-x-3">
                    <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                      <svg
                          className="flex-shrink-0 size-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                                        <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                      Get <span className="font-bold">automatic</span> email
                      reminders for all appointments
                    </span>
                                    </li>
                                </ul>
                                {/* End List */}
                            </div>
                        </div>
                        <div>
                            <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto px-4">
                                <div className="p-4 mt-6 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">
                                        <SettingsForm
                                            onRegister={onRegister}
                                            onToggleForm={handleToggleForm}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>

                    <>
                    </>

                    <div className="mt-6 md:mt-12 lg:mt-6 py-3 flex items-center text-sm text-gray-800 gap-x-1.5 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-700">
            <span className="font-semibold bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
              Web Application Technologies
            </span>
                        team project
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}