import React from 'react';
import { Field, ErrorMessage } from 'formik';
import css from './page/RegisterForm.module.css';

const getDisplayText = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return hours > 0 && minutes > 0
        ? `${hours}h ${minutes}m`
        : hours > 0
        ? `${hours}h`
        : `${minutes}m`;
};

const MeetingDurationSlider = () => (
    <div className="mt-5">
        <h1 className="block text-md font-medium text-gray-800 dark:text-white">Meeting Duration:</h1>
        <Field name="meetingDuration">
            {({ field, form }) => {
                const displayText = getDisplayText(field.value);
                return (
                    <div>
                        <input
                            type="range"
                            min="5"
                            max="120"
                            step="5"
                            {...field}
                            className="w-full"
                            onChange={(e) => form.setFieldValue('meetingDuration', e.target.value)}
                        />
                        <div className="text-gray-700 dark:text-white">{displayText}</div>
                    </div>
                );
            }}
        </Field>
        <ErrorMessage name="meetingDuration" component="span" className={css.error} />
    </div>
);

export default MeetingDurationSlider;
