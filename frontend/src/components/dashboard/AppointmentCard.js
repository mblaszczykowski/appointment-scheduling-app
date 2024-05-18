import React from 'react';
import dayjs from 'dayjs';

const AppointmentCard = ({ appointment }) => (
    <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
        <div className="p-4 md:p-6">
            <span className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
                {dayjs(appointment.startTime).format('MMMM D, YYYY')}
            </span>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                {appointment.bookerName}
            </h3>
            <h5 className="mt-3 text-base font-medium text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                Meeting note:
            </h5>

            <p className="text-gray-500 dark:text-neutral-500">
                {appointment.meetingNote}
            </p>
        </div>
        <div
            className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
            <div
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                Start time: {dayjs(appointment.startTime).format('h:mm A')}
            </div>
            <div className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                Duration: {dayjs(appointment.endTime).diff(dayjs(appointment.startTime), 'minute')} min
            </div>
        </div>
    </div>
);

export default AppointmentCard;
