import React, { useState } from 'react';
import css from "../page/RegisterForm.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { request, setAuthHeader } from "../../util/axios_helper";

const validationSchema = Yup.object().shape({
    login: Yup.string()
        .email('Invalid email address format.')
        .required('Email is required.'),
});

function ResetPasswordMailForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendingResetMail = (values) => {
        let email = values.login;
        request(
            "POST",
            "/api/users/reset-pass",
            { email }
        ).then(
            (response) => {
                setAuthHeader(response.data);
                setSuccessMessage(`We have sent an email to reset your password to ${email}.`);
                setErrorMessage('');
            }
        ).catch(
            (error) => {
                setAuthHeader(null);
                setSuccessMessage('');
                if (error.response) {
                    setErrorMessage('Email not found. Please check your email and try again.');
                }
                console.error("Sending mail error:", error.response || error.message);
            }
        );
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-20">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-neutral-900">
                <Formik
                    initialValues={{ login: '' }}
                    onSubmit={(values) => {
                        handleSendingResetMail(values);
                    }}
                    validationSchema={validationSchema}
                >
                    {({ setFieldValue }) => (
                        <Form className="max-w-sm mx-auto space-y-6">
                            <div className="py-5 mt-4 text-center">
                                <h1 className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                    Don't remember the password?
                                </h1>
                                <p className="block text-lm mt-3 font-lg text-gray-600 dark:text-white">
                                    Don't worry, enter your email used for registration, and we will send you a reset link.
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
                                                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                                    <path d="m9 12 2 2 4-4"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="ms-3">
                                            <h3 className="text-gray-800 font-semibold dark:text-white">
                                                Successfully sent.
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-neutral-400">
                                                {successMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mb-5">
                                <Field
                                    type="text"
                                    name="login"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter your email"
                                    onChange={(e) => {
                                        setFieldValue('login', e.target.value);
                                        setErrorMessage('');
                                        setSuccessMessage('');
                                    }}
                                />
                                <ErrorMessage
                                    name="login"
                                    component="span"
                                    className={css.error}
                                />
                            </div>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <button
                                    type="submit"
                                    className="mb-6 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
                                >
                                    Send reset link
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default ResetPasswordMailForm;
