import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { request, setAuthHeader } from "../../util/axios_helper";
import css from '../page/RegisterForm.module.css';

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters.')
        .required('Password is required.'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
        .required('Please confirm your password.'),
});

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleResetPassword = (values) => {
        request(
            'PATCH',
            `/api/users/reset-pass/${token}`,
            { password: values.newPassword, retPassword: values.confirmNewPassword }
        ).then(response => {
            setSuccessMessage('Your password has been successfully reset. Now you can log in to your Meetly account.');
            setAuthHeader(null);
            setTimeout(() => {
                navigate("/login");
            }, 3000); // Navigate after 3 seconds
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid or expired token.');
            } else if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data || 'Passwords should be the same.');
            } else {
                setErrorMessage('Failed to reset password. Please try again.');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-20">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-neutral-900">
                <Formik
                    initialValues={{ newPassword: '', confirmNewPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleResetPassword}
                >
                    {({ setFieldValue }) => (
                        <Form className="max-w-sm mx-auto space-y-6">
                            <div className="py-5 mt-12 text-center">
                                <h1 className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                    Reset your password
                                </h1>
                                <p className="block text-lm mt-2 font-bold text-gray-600 dark:text-white">
                                    Do not worry. Resetting your password is simple, just enter your new password...
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
                                                Successfully updated.
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
                                    type="password"
                                    name="newPassword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter new password"
                                    onChange={(e) => {
                                        setErrorMessage('');
                                        setFieldValue('newPassword', e.target.value);
                                    }}
                                />
                                <ErrorMessage
                                    name="newPassword"
                                    component="span"
                                    className={css.error}
                                />
                            </div>
                            <div className="mb-5">
                                <Field
                                    type="password"
                                    name="confirmNewPassword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Confirm new password"
                                    onChange={(e) => {
                                        setErrorMessage('');
                                        setFieldValue('confirmNewPassword', e.target.value);
                                    }}
                                />
                                <ErrorMessage
                                    name="confirmNewPassword"
                                    component="span"
                                    className={css.error}
                                />
                            </div>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <button
                                    type="submit"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default ResetPassword;
