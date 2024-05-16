import React, {Component} from 'react';
import {getUserIdFromToken, request, setAuthHeader} from '../util/axios_helper';
import dayjs from 'dayjs';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        request('GET', `/api/appointments/user/${getUserIdFromToken()}`, {})
            .then((response) => {
                console.log("DATA: ");
                console.log(response.data);
                this.setState({data: response.data});
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthHeader(null);
                } else {
                    this.setState({data: error.response.code});
                }
            });
    }

    render() {
        return (
            <div
                className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
                {/* Hero */}
                <div className="relative overflow-hidden">
                    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-center block text-3xl font-bold text-gray-800 sm:text-4xl md:text-3xl dark:text-white">
                                Welcome to your {" "}<br/>
                                <span className="text-blue-600">dashboard</span>

                            </h1>
                            <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400 text-center mb-12">Here you
                                can find all your scheduled meetings</p>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {this.state.data.map((appointment) => (
                                    <div key={appointment.id}
                                         className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                        <div className="p-4 md:p-6">
                                            <span
                                                className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
                                                {dayjs(appointment.startTime).format('MMMM D, YYYY')}
                                            </span>
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                                                {appointment.bookerName}
                                            </h3>
                                            <p className="mt-3 text-gray-500 dark:text-neutral-500">
                                                Meeting note? To add - booker should have option to add it
                                            </p>
                                        </div>
                                        <div
                                            className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                                            <div
                                                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                                                Start time: {dayjs(appointment.startTime).format('h:mm A')}
                                            </div>
                                            <div
                                                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                                                Duration: {dayjs(appointment.endTime).diff(dayjs(appointment.startTime), 'minute')} mins
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
