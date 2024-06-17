import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { getAuthToken } from "../../util/axios_helper";

const AppointmentCard = ({ appointment }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const cancelAppointment = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            await axios.put(
                `/api/appointments/cancel/${appointment.id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelConfirmation = async (allowCancellation) => {
        if (allowCancellation) {
            await cancelAppointment();
        }
        setShowAlert(false);
    };

    useEffect(() => {
        if (showSuccessAlert || showErrorAlert) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert, showErrorAlert]);

    return (
        <div>
            {showSuccessAlert && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-teal-50 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <div className="text-sm font-medium">
                                Meeting has been successfully canceled.
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showErrorAlert && (
                <div id="dismiss-alert" className="fixed top-4 left-1/2 transform -translate-x-1/2 hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-teal-50 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <div className="text-sm font-medium">
                                Error occurred while canceling the meeting.
                            </div>
                        </div>
                        <div className="ps-3 ms-auto">
                            <div className="-mx-1.5 -my-1.5">
                                <button type="button" className="inline-flex bg-teal-50 rounded-lg p-1.5 text-teal-500 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-50 focus:ring-teal-600 dark:bg-transparent dark:hover:bg-teal-800/50 dark:text-teal-600" onClick={() => setShowErrorAlert(false)}>
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="relative group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                {showAlert && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-blue-100 border border-blue-200 text-gray-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-white max-w-md mx-auto">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="flex-shrink-0 size-4 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                </div>
                                <div className="ms-3">
                                    <h3 className="font-semibold">
                                        Cancel meeting
                                    </h3>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                                        Are you sure you want to cancel the meeting with <br/>
                                        <strong>{appointment.bookerName}</strong> <br/>
                                        on {dayjs(appointment.startTime).format('MMMM D, YYYY')} at
                                        {dayjs(appointment.startTime).format('h:mm A')}?
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                                                onClick={() => handleCancelConfirmation(false)}
                                            >
                                                Don't cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400"
                                                onClick={() => handleCancelConfirmation(true)}
                                            >
                                                Cancel
                                            </button>
                                            {loading && (
                                                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!appointment.isActual && (
                    <div className="absolute top-2 right-2 text-xs text-gray-500">
                        Canceled
                    </div>
                )}
                <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
                        {dayjs(appointment.startTime).format('MMMM D, YYYY')}
                    </span>
                    <h3 className="text-xl mt-3 font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                        {appointment.bookerName}
                    </h3>
                    {appointment.meetingNote !== null && (
                        <h5 className="mt-3 text-base font-medium text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                            Meeting note:
                        </h5>
                        )}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-500 dark:text-neutral-500">
                            {appointment.meetingNote}
                        </p>
                        {appointment.isActual && dayjs(appointment.startTime).isAfter(dayjs()) && (
                            <button
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-red-600 hover:text-red-800 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                                onClick={() => setShowAlert(true)}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                    <div className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                        Start time: {dayjs(appointment.startTime).format('h:mm A')}
                    </div>
                    <div className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                        Duration: {dayjs(appointment.endTime).diff(dayjs(appointment.startTime), 'minute')} min
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;
