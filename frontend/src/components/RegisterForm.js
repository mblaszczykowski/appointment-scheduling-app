import * as React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import css from './RegisterForm.module.css';

const contactSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Only Latin characters and digits are allowed.')
        .min(2, 'First name must be at least 2 symbols.')
        .max(20, 'Max length is 20.')
        .required('First name is required.'),
    lastName: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Only Latin characters and digits are allowed.')
        .min(2, 'Last name must be at least 2 symbols.')
        .max(20, 'Max length is 20.')
        .required('Last name is required.'),
    username: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Only Latin characters and digits are allowed.')
        .min(4, 'Username must be at least 4 symbols.')
        .max(20, 'Max length is 20.')
        .required('Username is required.'),
    password: Yup.string()
        .matches(
            /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_`+=[\]{};':"\\|,.<>/?]*$/,
            'At least one digit and one uppercase latin letter.',
        )
        .min(8, 'Password must be at least 8 symbols.')
        .max(20, 'Max length is 20.')
        .required('Password is required.'),
});

export default class RegisterForm extends React.Component {
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

    onChangeHandler = event => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    };

    onSubmitRegister = obj => {
        this.state.onRegister(obj);
    };

    render() {
        return (
            <div>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        username: '',
                        password: '',
                    }}
                    onSubmit={(values) => {
                        console.log(values);
                        this.onSubmitRegister(values);
                    }}
                    validationSchema={contactSchema}
                >
                    <Form className="max-w-sm mx-auto">
                        <div className="mb-5">
                            <Field
                                type="text"
                                name="firstName"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                placeholder={`First name`}
                            ></Field>
                            <ErrorMessage
                                name="firstName"
                                component="span"
                                className={css.error}
                            />
                        </div>
                        <div className="mb-5">
                            <Field
                                type="text"
                                name="lastName"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                placeholder={`Last name`}
                            ></Field>
                            <ErrorMessage
                                name="lastName"
                                component="span"
                                className={css.error}
                            />
                        </div>
                        <div className="mb-5">
                            <Field
                                type="text"
                                name="username"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                placeholder={`Username`}
                            ></Field>
                            <ErrorMessage
                                name="username"
                                component="span"
                                className={css.error}
                            />
                        </div>
                        <div className="mb-5">
                            <Field
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
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
                                Already have an account?{' '}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Log in
                                </a>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Register new account
                        </button>
                    </Form>
                </Formik>
            </div>
        );
    }
}
