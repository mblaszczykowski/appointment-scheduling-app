import React, {Component} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import css from './RegisterForm.module.css';

const contactSchema = Yup.object().shape({
    login: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Only Latin characters and digits are allowed.')
        .min(4, 'Username must be at least 4 symbols.')
        .max(20, 'Max length is 20.')
        .required('Username is required.'),
    password: Yup.string()
        .matches(
            /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_`+=[\]{};':"\\|,.<>/?]*$/,
            'At least one digit and one capital letter.',
        )
        .min(8, 'Password must be at least 8 symbols.')
        .max(20, 'Max length is 20.')
        .required('Password is required.'),
});

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 'login',
            firstName: '',
            lastName: '',
            login: '',
            password: '',
            onLogin: props.onLogin,
            onRegister: props.onRegister,
        };
    }

    onSubmitLogin = obj => {
        this.state.onLogin(obj);
    };

    render() {
        return (
            <div>
                <Formik
                    initialValues={{
                        login: '',
                        password: '',
                    }}
                    onSubmit={(values) => {
                        this.onSubmitLogin(values);
                    }}
                    validationSchema={contactSchema}
                >
                    <Form className="max-w-sm mx-auto">
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="password"
                                placeholder={`Password`}
                            ></Field>
                            <ErrorMessage
                                className={css.error}
                                name="password"
                                component="span"
                            />
                        </div>
                        <div className="flex items-start mb-5">
                            <label
                                htmlFor="terms"
                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Don't have an account?{' '}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Sign up
                                </a>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Submit
                        </button>
                    </Form>
                </Formik>
            </div>
        );
    }
}
