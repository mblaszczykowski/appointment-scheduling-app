import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { request } from "../../util/axios_helper";

function CancelMeeting() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCancelMeeting = (values, { setSubmitting }) => {
        request(
            'PUT',
            `/api/appointments/cancelMeeting/${token}`,
            {}
        ).then(response => {
            setSuccessMessage('Your meeting has been successfully canceled.');
            setTimeout(() => {
                navigate("/login");
            }, 3000); // Navigate after 3 seconds
        }).catch(error => {
            setErrorMessage('There was an error canceling your meeting.');
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-20">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-neutral-900">
                <Formik
                    initialValues={{}} // Provide an empty initial values object
                    onSubmit={handleCancelMeeting}
                >
                    <Form className="max-w-sm mx-auto space-y-6">
                        <div className="py-5 mt-12 text-center">
                            <h1 className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                Cancel your meeting
                            </h1>
                            <p className="block text-lm mt-2 font-bold text-gray-600 dark:text-white">
                                Do not worry, the person with whom you were supposed to have a meeting will be informed
                            </p>
                        </div>
                        {errorMessage && (
                            <div className="text-center text-red-600 mt-4">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30" role="alert">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                                            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                                <path d="m9 12 2 2 4-4"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <h3 className="text-gray-800 font-semibold dark:text-white">
                                            Successfully cancelled.
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                                            {successMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                type="submit"
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
                            >
                                Cancel Meeting
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default CancelMeeting;
