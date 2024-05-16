import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import css from './RegisterForm.module.css';
import {request, setAuthHeader} from "../util/axios_helper";
import {useNavigate} from "react-router-dom";

const contactSchema = Yup.object().shape({
    login: Yup.string()
        .email('Invalid email address format.')
        .required('Email is required.'),
    password: Yup.string()
        .matches(
            /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_`+=[\]{};':"\\|,.<>/?]*$/,
            'At least one digit and one capital letter.',
        )
        .min(8, 'Password must be at least 8 symbols.')
        .max(20, 'Max length is 20.')
        .required('Password is required.'),
});

function LoginForm({onLogin, onToggleForm}) {
    const navigate = useNavigate();
    const handleLogin = (obj) => {
        const {login, password} = obj;
        let email = login;
        request(
            "POST",
            "/api/auth/login",
            {
                email,
                password,
            }).then(
            (response) => {
                setAuthHeader(response.data);
                onLogin();
                navigate('/dashboard');
            }).catch(
            (error) => {
                setAuthHeader(null);
                navigate("/");
                console.error("Login error:", error.response || error.message);
            }
        );
    }

    return (
        <div className={css['form-container']}>
            <Formik
                initialValues={{
                    login: '',
                    password: '',
                }}
                onSubmit={(values) => {
                    handleLogin(values);
                }}
                validationSchema={contactSchema}
            >
                <Form className="max-w-sm mx-auto">

                    <div className="py-5 mt-12">
                        <h1 className="block text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                            Welcome back
                        </h1>
                        <h1 className="block text-xl mt-2 font-bold text-gray-600 dark:text-white">Log in to see your
                            schedule</h1>
                    </div>
                    <div className="flex items-start mb-6 pt-1">
                        <label
                            htmlFor="terms"
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Don't have an account?{' '}
                            <a
                                onClick={onToggleForm}
                                className="text-blue-600 hover:underline dark:text-blue-500"
                            >
                                Sign up
                            </a>
                        </label>
                    </div>
                    <div className="mb-5">
                        <Field
                            type="text"
                            name="login"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={`Username`}
                        ></Field>
                        <ErrorMessage
                            name="login"
                            component="span"
                            className={css.error}
                        />
                    </div>
                    <div className="mb-5">
                        <Field
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            type="password"
                            name="password"
                            placeholder={`Password`}
                        ></Field>
                        <ErrorMessage
                            className={css.error}
                            name="password"
                            component="span"
                        />
                    </div>

                    <button
                        type="submit"
                        className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    );
}

export default LoginForm;
