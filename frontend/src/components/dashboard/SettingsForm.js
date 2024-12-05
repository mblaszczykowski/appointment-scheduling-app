import React, {useEffect, useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import css from '../page/RegisterForm.module.css';
import {useNavigate} from "react-router-dom";
import {getUserIdFromToken, request} from "../../util/axios_helper";
import EyeButton from "../EyeButton";
import {Slide, toast} from "react-toastify";
import ProfilePicture from "./ProfilePicture";
import axios from 'axios';

const generalValidationSchema = Yup.object().shape({
    firstname: Yup.string()
        .min(2, 'First name must be at least 2 symbols.')
        .max(20, 'Max length is 20.')
        .required('First name is required.'),
    lastname: Yup.string()
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
    meetingLink: Yup.string()
        .matches(
            /^(https?:\/\/)[a-zA-Z0-9.\/]+$/,
            'Invalid URL format. Please enter a valid meeting link.'
        )
        .required('Meeting link is required.'),
    availableFromHour: Yup.number()
        .min(0, 'Earliest hour must be 0.')
        .max(23, 'Latest hour can be 23.')
        .required('Available from hour is required.'),
    availableToHour: Yup.number()
        .min(0, 'Earliest hour must be 0.')
        .max(23, 'Latest hour can be 23.')
        .required('Available to hour is required.')
        .moreThan(Yup.ref('availableFromHour'), 'Available to hour must be later than available from hour.'),
    availableDays: Yup.array()
        .of(Yup.string().required())
        .min(1, 'At least one day must be selected.')
        .required('Available days are required.')
});

const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required.'),
    newPassword: Yup.string()
        .matches(
            /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_`+=[\]{};':"\\|,.<>/?]*$/,
            'At least one digit and one uppercase Latin letter.'
        )
        .min(8, 'Password must be at least 8 symbols.')
        .max(20, 'Max length is 20.')
        .required('Password is required.'),
    newPassword2: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match.')
        .required('Confirmation password is required.')
});

function displayNotification(message, type = "success", duration = 2500,
                             transition = Slide, position = "top-center") {
    toast[type](message, {
        position: position,
        autoClose: duration,
        transition: transition
    });
}

function SettingsForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        calendarUrl: '',
        meetingLink: '',
        availableFromHour: '',
        availableToHour: '',
        availableDays: [],
        profilePicture: null,
    });

    const [currentPasswordValid, setCurrentPasswordValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        if (!(localStorage.getItem("auth_token") !== null)) {
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
                        meetingLink,
                        availableFromHour,
                        availableToHour,
                        availableDays,
                        profilePicture
                    } = response.data;
                    const availableDaysArray = availableDays.split(',');

                    setUserData({
                        firstname,
                        lastname,
                        email,
                        password,
                        calendarUrl,
                        meetingLink,
                        availableFromHour,
                        availableToHour,
                        availableDays: availableDaysArray,
                        profilePicture
                    });
                    setLoading(false);
                })
                .catch(error => {
                    // Handle error
                });
        };

        handleSettings();
    }, []);

    const validateCurrentPassword = async (password) => {
        return await bcrypt.compare(password, userData.password);
    };

    const handleUpdate = (values) => {
        const {
            firstname,
            lastname,
            email,
            calendarUrl,
            meetingLink,
            availableFromHour,
            availableToHour,
            availableDays,
            profilePicture
        } = values;
        const userData = new FormData();
        userData.append("firstname", firstname);
        userData.append("lastname", lastname);
        userData.append("email", email);
        userData.append("calendarUrl", calendarUrl);
        userData.append("meetingLink", meetingLink);
        userData.append("availableFromHour", availableFromHour);
        userData.append("availableToHour", availableToHour);
        userData.append("availableDays", availableDays.join(','));
        if (profilePicture) {
            userData.append("profilePicture", profilePicture);
        }
        request(
            "PUT",
            `api/users/${getUserIdFromToken()}`,
            userData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(
            () => {
                displayNotification('Account successfully updated.')
            }).catch(
            (error) => {
                console.error("Update error:", error.response || error.message);
            }
        );
    };

    const handlePasswordUpdate = (newPassword) => {
        const formData = new FormData();
        formData.append('password', newPassword);
        request(
            "PUT",
            `/api/users/${getUserIdFromToken()}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(
            () => {
                displayNotification('Account successfully updated.')
            }).catch(
            (error) => {
                console.error("Password update error:", error.response || error.message);
            }
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Formik
            initialValues={{
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                email: userData.email || '',
                currentPassword: '',
                newPassword: '',
                newPassword2: '',
                calendarUrl: userData.calendarUrl || '',
                meetingLink: userData.meetingLink || '',
                availableFromHour: userData.availableFromHour || '',
                availableToHour: userData.availableToHour || '',
                availableDays: userData.availableDays || [],
                profilePicture: profilePicture || null,
            }}

            validationSchema={currentPasswordValid ? passwordValidationSchema : generalValidationSchema}

            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                const { email, calendarUrl } = values;
                let hasError = false;

                if (email !== userData.email) {
                    try {
                        await axios.get(`/api/users/email/${email}`);
                        // Email exists in the database
                        setFieldError('email', 'Email already exists.');
                        hasError = true;
                    } catch (error) {
                        if (error.response && error.response.status !== 404) {
                            setFieldError('email', 'Email already exists.');
                            hasError = true;
                        }
                    }
                }

                if (calendarUrl !== userData.calendarUrl) {
                    try {
                        await axios.get(`/api/calendar/${calendarUrl}`);
                        setFieldError('calendarUrl', 'Calendar URL already exists.');
                        hasError = true;
                    } catch (error) {
                        if (error.response && error.response.status !== 404) {
                            setFieldError('calendarUrl', 'Calendar URL already exists.');
                            hasError = true;
                        }
                    }
                }

                if (hasError) {
                    setSubmitting(false);
                    return;
                }

                handleUpdate(values);
                setSubmitting(false);
            }}
        >
            {({errors, touched, handleBlur, resetForm, values, validateField, setFieldError, setFieldValue}) => (
                <Form className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div>
                            <div className="mb-3">
                                <h1 className="block text-lg font-bold text-gray-800 dark:text-white">Profile
                                    Picture</h1>
                            </div>
                            <div className="mb-5 flex items-center">
                                <ProfilePicture firstName={userData.firstname} lastName={userData.lastname}
                                                onProfilePictureChange={(file) => setFieldValue('profilePicture', file)}
                                                profilePicture={userData.profilePicture}/>
                            </div>
                            <div className="mb-3">
                                <h1 className="block text-lg font-bold text-gray-800 dark:text-white">Personal
                                    Information</h1>
                            </div>
                            <div className="mb-5 flex items-center">
                                <label htmlFor="firstname" className="mr-4 text-m font-medium text-gray-700">
                                    First name
                                </label>
                                <div>
                                    <Field
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        onBlur={handleBlur}
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
                                        onBlur={handleBlur}
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
                                        onBlur={handleBlur}
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
                                    <h1 className="block text-lg font-bold text-gray-800 dark:text-white">Reset your
                                        password</h1>
                                </div>
                                {!currentPasswordValid ? (
                                    <div className="mb-5">
                                        <div className="relative">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                name="currentPassword"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                placeholder="Enter current password"
                                            />
                                            <EyeButton showPassword={showPassword} setShowPassword={setShowPassword}/>
                                        </div>
                                        <ErrorMessage
                                            name="currentPassword"
                                            component="span"
                                            className={css.error}
                                        /><br/>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const isValid = await validateCurrentPassword(values.currentPassword);
                                                    if (isValid) {
                                                        setCurrentPasswordValid(true);
                                                        await validateField('newPassword');
                                                        await validateField('newPassword2');
                                                    } else {
                                                        setFieldError('currentPassword', 'Current password is incorrect.');
                                                    }
                                                }}
                                                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-gray-700 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-5">
                                            <Field
                                                type="password"
                                                name="newPassword"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                placeholder="Enter new password"
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
                                                name="newPassword2"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                placeholder="Confirm new password"
                                            />
                                            <ErrorMessage
                                                name="newPassword2"
                                                component="span"
                                                className={css.error}
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    resetForm({
                                                        values: {
                                                            firstname: userData.firstname || '',
                                                            lastname: userData.lastname || '',
                                                            email: userData.email || '',
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            newPassword2: '',
                                                            calendarUrl: userData.calendarUrl || '',
                                                            meetingLink: userData.meetingLink || '',
                                                            availableFromHour: userData.availableFromHour || '',
                                                            availableToHour: userData.availableToHour || '',
                                                            availableDays: userData.availableDays || [],
                                                            profilePicture: userData.profilePicture || '',
                                                        },
                                                    });
                                                    setCurrentPasswordValid(false);
                                                }}
                                                className="text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-700 dark:focus:ring-gray-800 mt-3"
                                            >
                                                Back
                                            </button>
                                            {values.newPassword && values.newPassword2 && values.newPassword === values.newPassword2 && !errors.newPassword && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handlePasswordUpdate(values.newPassword);
                                                    }}
                                                    className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
                                                >
                                                    Update password
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
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
                                        placeholder="Your calendar's URL"
                                    />
                                    <ErrorMessage
                                        name="calendarUrl"
                                        component="span"
                                        className={css.error}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 mb-5">
                                <div className="mb-3">
                                    <h1 className="block text-lg font-bold text-gray-800 dark:text-white">Set the
                                        meeting link</h1>
                                </div>
                                <div className="mb-5">
                                    <Field
                                        type="text"
                                        name="meetingLink"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                        placeholder="Your meeting link"
                                    />
                                    <ErrorMessage
                                        name="meetingLink"
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
                                           className="form-select block w-40 px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
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
                                <ErrorMessage name="availableDays" component="div" className={css.error}/>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <button type="submit"
                                        className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default SettingsForm;
