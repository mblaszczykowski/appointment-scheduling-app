import * as React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import css from './RegisterForm.module.css';

// Updated validation schema
const contactSchema = Yup.object().shape({
    firstname: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Only Latin characters and digits are allowed.')
        .min(2, 'First name must be at least 2 symbols.')
        .max(20, 'Max length is 20.')
        .required('First name is required.'),
    lastname: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Only Latin characters and digits are allowed.')
        .min(2, 'Last name must be at least 2 symbols.')
        .max(20, 'Max length is 20.')
        .required('Last name is required.'),
    email: Yup.string()
        .email('Invalid email address format.')
        .required('Email is required.'),
    password: Yup.string()
        .matches(
            /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_`+=[\]{};':"\\|,.<>/?]*$/,
            'At least one digit and one uppercase latin letter.'
        )
        .min(8, 'Password must be at least 8 symbols.')
        .max(20, 'Max length is 20.')
        .required('Password is required.'),
    availableFromHour: Yup.number()
        .min(0, 'Earliest hour must be 0.')
        .max(23, 'Latest hour can be 23.')
        .required('Available from hour is required.'),
    availableToHour: Yup.number()
        .min(0, 'Earliest hour must be 0.')
        .max(23, 'Latest hour can be 23.')
        .required('Available to hour is required.'),
    availableDays: Yup.array()
        .of(Yup.string())
        .required('At least one day must be selected.'),
});

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 'login',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            availableFromHour: 0,
            availableToHour: 0,
            availableDays: [],
            onLogin: props.onLogin,
            onRegister: props.onRegister,
        };
    }

    componentDidMount() {
        console.log("RegisterForm mounted");
    }

    onChangeHandler = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        this.setState({ [name]: newValue });
    };

    onSubmitRegister = (values) => {
        console.log("Registration submitted", values);
        this.state.onRegister(values);
    };

    render() {
        return (
            <div>
                <Formik
                    initialValues={{
                        firstname: '',
                        lastname: '',
                        email: '',
                        password: '',
                        availableFromHour: '',
                        availableToHour: '',
                        availableDays: [],
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        // Convert hours to integers
                        values.availableFromHour = parseInt(values.availableFromHour, 10);
                        values.availableToHour = parseInt(values.availableToHour, 10);

                        // Join the availableDays array into a comma-separated string
                        values.availableDays = values.availableDays.join(',');

                        console.log(values); // You can see the modified values in the console
                        this.onSubmitRegister(values);
                        setSubmitting(false);
                    }}
                    validationSchema={contactSchema}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="max-w-sm mx-auto">
                            <div className="mb-5">
                                <Field
                                    type="text"
                                    name="firstname"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder={`First name`}
                                ></Field>
                                <ErrorMessage
                                    name="firstname"
                                    component="span"
                                    className={css.error}
                                />
                            </div>
                            <div className="mb-5">
                                <Field
                                    type="text"
                                    name="lastname"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder={`Last name`}
                                ></Field>
                                <ErrorMessage
                                    name="lastname"
                                    component="span"
                                    className={css.error}
                                />
                            </div>
                            <div className="mb-5">
                                <Field
                                    type="text"
                                    name="email"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder={`Email`}
                                ></Field>
                                <ErrorMessage
                                    name="email"
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
                            <div className="mb-5">
                                <Field as="select" name="availableFromHour" className="select">
                                    {Array.from({length: 24}, (_, i) => (
                                        <option key={i} value={i}>{i}:00</option>
                                    ))}
                                </Field>
                                <Field as="select" name="availableToHour" className="select">
                                    {Array.from({length: 24}, (_, i) => (
                                        <option key={i} value={i}>{i}:00</option>
                                    ))}
                                </Field>
                                <div>
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                        <label key={day}>
                                            <Field type="checkbox" name="availableDays" value={day}/>
                                            {day}
                                        </label>
                                    ))}
                                </div>

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
                    )}
                </Formik>
            </div>
        );
    }
}
