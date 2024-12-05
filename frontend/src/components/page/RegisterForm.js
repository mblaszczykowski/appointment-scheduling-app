import React, {useState} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import css from './RegisterForm.module.css';
import {useNavigate} from "react-router-dom";
import {request, setAuthHeader} from "../../util/axios_helper";
import MeetingDurationSlider from "../MeetingDurationSlider";
import {Slide, toast} from "react-toastify";
import axios from "axios";
import EyeButton from "../EyeButton";

const validationSchemas = [
    Yup.object().shape({
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
        password: Yup.string()
            .matches(
                /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_`+=[\]{};':"\\|,.<>/?]*$/,
                'At least one digit and one uppercase latin letter.'
            )
            .min(8, 'Password must be at least 8 symbols.')
            .max(20, 'Max length is 20.')
            .required('Password is required.')
    }),
    Yup.object().shape({
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
    }),
    Yup.object().shape({
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
            .required('Available days are required.'),
        meetingDuration: Yup.number()
            .min(5, 'Meeting duration must be at least 5 minutes.')
            .max(120, 'Meeting duration can be at most 2 hours.')
            .required('Meeting duration is required.'),
    })
];

function displayNotification(message, type = "error", duration = 5000,
                             transition = Slide, position = "top-center") {
    toast[type](message, {
        position: position,
        autoClose: duration,
        transition: transition
    });
}

function RegisterForm({onToggleForm}) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = (obj) => {
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
            meetingDuration
        } = obj;
        request(
            "POST",
            "api/users",
            {
                firstname,
                lastname,
                email,
                password,
                calendarUrl,
                meetingLink,
                availableFromHour,
                availableToHour,
                availableDays,
                meetingDuration
            }).then(
            (response) => {
                setAuthHeader(response.data);
                navigate("/dashboard");
            }).catch(
            (error) => {
                setAuthHeader(null);
                displayNotification("Error");
                console.error("Register error:", error.response || error.message);
            }
        );
    };

    const handleNext = async (validateForm, setTouched, values) => {
        const errors = await validateForm();
        if (Object.keys(errors).length > 0) {
            setTouched(errors);
            displayNotification("Please correct the errors on the form.");
            return;
        }

        const stepConfig = [
            {path: `/api/users/email/${values.email}`, message: "Email already exists"},
            {path: `/api/calendar/${values.calendarUrl}`, message: "Calendar URL already exists"}
        ];
        if (currentStep < stepConfig.length) {
            await handleApiRequest(stepConfig[currentStep].path, stepConfig[currentStep].message);
        } else {
            setCurrentStep(prev => prev + 1);
        }

        async function handleApiRequest(apiPath, errorMessage) {
            try {
                await axios.get(apiPath);
                displayNotification(errorMessage);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    const errorStatus = error.response ? error.response.status : "Network or unknown error";
                    displayNotification(`Error checking data: ${errorStatus}`);
                }
            }
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const selectWorkingDays = (setFieldValue) => {
        setFieldValue('availableDays', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    };

    const selectWorkingHours = (setFieldValue) => {
        setFieldValue('availableFromHour', 9);
        setFieldValue('availableToHour', 17);
    };

    const steps = [
        {id: 0, title: 'Tell us a bit about yourself'},
        {id: 1, title: 'Set the calendar'},
        {id: 2, title: 'Set your availability'}
    ];

    return (
        <div className={css['form-container']}>
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    calendarUrl: '',
                    meetingLink: '',
                    availableFromHour: '',
                    availableToHour: '',
                    availableDays: [],
                    meetingDuration: 60
                }}
                validationSchema={validationSchemas[currentStep]}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={(values, {setSubmitting}) => {
                    values.availableFromHour = parseInt(values.availableFromHour, 10);
                    values.availableToHour = parseInt(values.availableToHour, 10);
                    values.availableDays = values.availableDays.join(',');

                    handleRegister(values);
                    setSubmitting(false);
                }}
            >
                {({errors, validateForm, setTouched, setFieldValue, values}) => (
                    <Form className="max-w-sm mx-auto">
                        <TransitionGroup>
                            <CSSTransition
                                key={currentStep}
                                timeout={300}
                                classNames="fade"
                            >
                                <div className={css['form-step']}>
                                    {currentStep === 0 && (
                                        <div>
                                            <div className="py-3">
                                                <h1 className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">
                                                    Get started
                                                </h1>
                                                <h1 className="block text-lg mt-4 font-bold text-gray-600 dark:text-white">Create
                                                    a free account</h1>
                                            </div>
                                            <div className="flex items-start mb-6">
                                                <label
                                                    htmlFor="terms"
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Already have an account?{' '}
                                                    <a
                                                        onClick={onToggleForm}
                                                        className="text-blue-600 hover:underline dark:text-blue-500"
                                                    >
                                                        Log in
                                                    </a>
                                                </label>
                                            </div>
                                            <div className="mb-3">
                                                <h1 className="block text-md mt-1 font-bold text-gray-600 dark:text-white">{steps[0].title}</h1>
                                            </div>
                                            <div className={`mb-3 ${errors.firstname ? "mb-1" : "mb-5"}`}>
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
                                            <div className={`mb-3 ${errors.lastname ? "mb-1" : "mb-5"}`}>
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
                                            <div className={`mb-3 ${errors.email ? "mb-1" : "mb-5"}`}>
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
                                            <div className={`mb-3 ${errors.password ? "mb-1" : "mb-5"}`}>

                                                <div className="relative">
                                                    <Field
                                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        placeholder={`Password`}
                                                    ></Field>
                                                    <EyeButton showPassword={showPassword}
                                                               setShowPassword={setShowPassword}/>
                                                </div>
                                                <ErrorMessage
                                                    className={css.error}
                                                    name="password"
                                                    component="span"
                                                />

                                            </div>

                                            <div className="relative w-full h-16">
                                                <button
                                                    type="button"
                                                    onClick={() => handleNext(validateForm, setTouched, values)}
                                                    className="absolute top-0 right-0 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Next
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                    {currentStep === 1 && (
                                        <div>
                                            <div className="mb-3">
                                                <h1 className="block text-lg font-bold text-gray-800 dark:text-white">{steps[1].title}</h1>
                                            </div>
                                            <div className={`mb-3 ${errors.calendarUrl ? "mb-1" : "mb-5"}`}>
                                                <Field
                                                    type="text"
                                                    name="calendarUrl"
                                                    className="mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                    placeholder={`Your calendar's URL`}
                                                ></Field>
                                                <ErrorMessage
                                                    name="calendarUrl"
                                                    component="span"
                                                    className={css.error}
                                                />
                                            </div>
                                            <div className={`mb-3 ${errors.meetingLink ? "mb-1" : "mb-5"}`}>
                                                <Field
                                                    type="text"
                                                    name="meetingLink"
                                                    className="mt-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                    placeholder={'Your meeting link'}
                                                ></Field>
                                                <ErrorMessage
                                                    name="meetingLink"
                                                    component="span"
                                                    className={css.error}
                                                />
                                            </div>
                                            <div className="relative w-full h-16">
                                                <button
                                                    type="button"
                                                    onClick={handlePrev}
                                                    className="absolute left-0 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleNext(validateForm, setTouched, values)}
                                                    className="absolute top-0 right-0 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {currentStep === 2 && (
                                        <div>
                                            <div className="mb-3">
                                                <h1 className="block text-lg font-bold text-gray-800 dark:text-white">{steps[2].title}</h1>
                                            </div>
                                            <MeetingDurationSlider/>
                                            <div className="mb-3 mt-5">
                                                <h1 className="block text-md font-medium text-gray-800 dark:text-white">Available
                                                    hours:</h1>
                                            </div>
                                            <div className="flex justify-between items-center my-3">
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
                                                <ErrorMessage name="availableFromHour" component="div"
                                                              className={css.error}/>
                                                <ErrorMessage name="availableToHour" component="div"
                                                              className={css.error}/>
                                            </div>
                                            <div className="mt-3 flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => selectWorkingHours(setFieldValue)}
                                                    className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Select 9-17
                                                </button>
                                            </div>
                                            <div className="mt-5">
                                                <h1 className="block text-md font-medium text-gray-800 dark:text-white">Available
                                                    days:</h1>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-3">
                                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                                    <label key={day} className="flex items-center space-x-2">
                                                        <Field type="checkbox" name="availableDays" value={day}
                                                               className="form-checkbox text-blue-600 w-5 h-5"/>
                                                        <span className="text-gray-700 dark:text-white">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="mt-1 flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => selectWorkingDays(setFieldValue)}
                                                    className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Select Mon-Fri
                                                </button>
                                                <ErrorMessage name="availableDays" component="div"
                                                              className={css.error}/>
                                            </div>

                                            <div className="relative w-full h-16 mt-8">
                                                <button
                                                    type="button"
                                                    onClick={handlePrev}
                                                    className="absolute left-0 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="absolute top-0 right-0 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Register
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CSSTransition>
                        </TransitionGroup>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default RegisterForm;
