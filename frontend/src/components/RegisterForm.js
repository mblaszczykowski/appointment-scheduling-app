import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
  userName: Yup.string()
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
    this.setState({ [name]: value });
  };

  onSubmitRegister = e => {
    this.state.onRegister(
      e,
      this.state.firstName,
      this.state.lastName,
      this.state.login,
      this.state.password,
    );
  };

  render() {
    return (
      <div>
        <form className="max-w-sm mx-auto" onSubmit={this.onSubmitRegister}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="name@flowbite.com"
              required
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="repeat-password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="login"
              name="login"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="repeat-password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              onChange={this.onChangeHandler}
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
        </form>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
          }}
          onSubmit={(values, action) => {
            action.resetForm();
          }}
          validationSchema={contactSchema}
        >
          <Form className={css.wrapper}>
            <div className={css.formWrapper}>
              <Field
                type="text"
                name="firstName"
                className={css.field}
                placeholder={`First name`}
              ></Field>
              <ErrorMessage
                name="firstName"
                component="span"
                className={css.error}
              />
            </div>
            <div className={css.formWrapper}>
              <Field
                type="text"
                name="lastName"
                className={css.field}
                placeholder={`Last name`}
              ></Field>
              <ErrorMessage
                name="lastName"
                component="span"
                className={css.error}
              />
            </div>
            <div className={css.formWrapper}>
              <Field
                type="text"
                name="userName"
                className={css.field}
                placeholder={`Username`}
              ></Field>
              <ErrorMessage
                name="userName"
                component="span"
                className={css.error}
              />
            </div>
            <div className={css.formWrapper}>
              <Field
                className={css.field}
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
            <div
              className="flex items-start mb-5"
              style={{ justifyContent: 'center' }}
            >
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
            <button className={css.button} type="submit">
              Register new account
            </button>
          </Form>
        </Formik>
      </div>
    );
  }
}
