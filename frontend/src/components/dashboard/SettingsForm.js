import React, {useEffect, useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import css from '../RegisterForm.module.css';
import {useNavigate} from "react-router-dom";
import {getUserIdFromToken, request, setAuthHeader} from "../../util/axios_helper";

const validationSchemas = [
    Yup.object().shape({
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
        calendarUrl: Yup.string()
            .matches(
                /^[\w\-\/]+$/,
                'Invalid subpath format. Only alphanumeric characters, dashes, and slashes are allowed.'
            )
            .required('Calendar subpath is required.'),
        availableFromHour: Yup.number()
            .min(0, 'Earliest hour must be 0.')
            .max(23, 'Latest hour can be 23.')
            .required('Available from hour is required.'),
        availableToHour: Yup.number()
            .min(0, 'Earliest hour must be 0.')
            .max(23, 'Latest hour can be 23.')
            .required('Available to hour is required.'),
        availableDays: Yup.array()
            .of(Yup.string().required())
            .min(1, 'At least one day must be selected.')
            .required('Available days are required.')
    })
];


function SettingsForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        calendarUrl: '',
        availableFromHour: '',
        availableToHour: '',
        availableDays: [],
    });

    useEffect(() => {
        if(!(localStorage.getItem("isLoggedIn") === "true")) {
            navigate("/dashboard");
        }
        const handleSettings = () => {
            request('GET', `/api/users/${getUserIdFromToken()}`, {})
                .then((response) => {
                    const {
                        firstname,
                        lastname,
                        email,
                        password,
                        calendarUrl,
                        availableFromHour,
                        availableToHour,
                        availableDays
                    } = response.data;
                    console.log(response.data);

                    const availableDaysArray = availableDays.split(',');

                    setUserData({
                        firstname,
                        lastname,
                        email,
                        password,
                        calendarUrl,
                        availableFromHour,
                        availableToHour,
                        availableDays: availableDaysArray,
                    });
                    setLoading(false);
                })
                .catch(error => {
                    // Handle error
                });
        };

        handleSettings();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    const handleUpdate = (obj) => {
        const {
            firstname,
            lastname,
            email,
            password,
            calendarUrl,
            availableFromHour,
            availableToHour,
            availableDays
        } = obj;
        console.log(obj);
        request(
            "PUT",
            `api/users/${getUserIdFromToken()}`,
            {
                firstname,
                lastname,
                email,
                password,
                calendarUrl,
                availableFromHour,
                availableToHour,
                availableDays,
            }).then(
            (response) => {
                setAuthHeader(response.data);
                navigate("/settings-success");
            }).catch(
            (error) => {
                setAuthHeader(null);
                navigate("/")
                console.error("Register error:", error.response || error.message);
            }
        );
    };

    return (
        <Formik
            initialValues={{
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                email: userData.email || '',
                password: userData.password || '',
                calendarUrl: userData.calendarUrl || '',
                availableFromHour: userData.availableFromHour || '',
                availableToHour: userData.availableToHour || '',
                availableDays: userData.availableDays || [],
            }}

            validationSchema={validationSchemas[0]}


            onSubmit={(values, {setSubmitting}) => {
                values.availableFromHour = parseInt(values.availableFromHour, 10);
                values.availableToHour = parseInt(values.availableToHour, 10);

                values.availableDays = values.availableDays.join(',');

                handleUpdate(values);
                setSubmitting(false);
            }}
        >
            {formik => (
                <Form className="max-w-sm">
                    <div className="mb-5 flex items-center">
                        <label htmlFor="firstname" className="mr-4 text-m font-medium text-gray-700">
                            First name
                        </label>
                        <div>
                            <Field
                                type="text"
                                id="firstname"
                                name="firstname"
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            />
                            <br/>
                            <ErrorMessage
                                name="firstname"
                                component="span"
                                className={css.error}
                            />
                        </div>
                    </div>
                    <div className="mb-5 flex items-center">
                        <label htmlFor="lastname" className="mr-4 text-m font-medium text-gray-700">
                            Last name
                        </label>
                        <div>
                            <Field
                                type="text"
                                id="lastname"
                                name="lastname"
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            />
                            <br/>
                            <ErrorMessage
                                name="lastname"
                                component="span"
                                className={css.error}
                            />
                        </div>
                    </div>
                    <div className="mb-5 flex items-center">
                        <label htmlFor="email" className="mr-4 text-m font-medium text-gray-700">
                            Email
                        </label>
                        <div>
                            <Field
                                type="text"
                                id="email"
                                name="email"
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            />
                            <br/>
                            <ErrorMessage
                                name="email"
                                component="span"
                                className={css.error}
                            />
                        </div>
                    </div>
                    <div className="mt-2 mb-5">
                        <div className="mb-3">
                            <h1 className="block text-lg font-bold text-gray-800 dark:text-white">Set the
                                calendar name</h1>
                        </div>
                        <div className="mb-5">
                            <Field
                                type="text"
                                name="calendarUrl"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                placeholder={`Your calendar's URL`}
                            ></Field>
                            <ErrorMessage
                                name="calendarUrl"
                                component="span"
                                className={css.error}
                            />
                        </div>
                    </div>


                    <div className="mt-2 mb-5">
                        <div className="mb-3">
                            <h1 className="block text-lg font-bold text-gray-800 dark:text-white">Set your
                                availability</h1>
                        </div>
                        <div className="mb-3">
                            <h1 className="block text-md text-gray-800 dark:text-white">Available hours:</h1>
                        </div>


                        <div className="flex justify-between items-center my-4">
                            <Field as="select" name="availableFromHour"
                                   className="form-select block w-40 px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                                {Array.from({length: 24}, (_, i) => (
                                    <option key={i} value={i}>{`${i}:00`}</option>
                                ))}
                            </Field>
                            <span className="mx-2">-</span>
                            <Field as="select" name="availableToHour"
                                   className="form-select block w-40 px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg:white focus:border-blue-600 focus:outline-none">
                                {Array.from({length: 24}, (_, i) => (
                                    <option key={i} value={i}>{`${i}:00`}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="availableFromHour" component="div" className={css.error}/>
                            <ErrorMessage name="availableToHour" component="div" className={css.error}/>
                        </div>
                        <div className="mt-3">
                            <h1 className="block text-md text-gray-800 dark:text-white">Available days:</h1>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-3">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <label key={day} className="flex items-center space-x-2">
                                    <Field type="checkbox" name="availableDays" value={day}
                                           className="form-checkbox text-blue-600 w-5 h-5"/>
                                    <span className="text-gray-700 dark:text-white">{day}</span>
                                </label>
                            ))}
                        </div>
                        <ErrorMessage name="availableDays" component="div" className={css.error}/><br/>

                        <button type="submit"
                                className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Update
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
}

export default SettingsForm;
