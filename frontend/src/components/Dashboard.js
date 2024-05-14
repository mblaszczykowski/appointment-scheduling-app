import React, { Component } from 'react';
import { getUserIdFromToken, request, setAuthHeader } from '../util/axios_helper';

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
                this.setState({ data: response.data });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthHeader(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            });
    }

    render() {
        const cardsPerRow = 3;
        const rows = [];

        for (let i = 0; i < this.state.data.length; i += cardsPerRow) {
            rows.push(this.state.data.slice(i, i + cardsPerRow));
        }

        return (
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mt-4">My upcoming appointments:</h1>
                <br/>
                <div className="flex justify-end pr-4">
                    <button className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 mr-5">
                        Add new meeting
                    </button>
                </div>
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap justify-center">
                        {row.map((appointment, index) => (
                            <div
                                key={index}
                                className="max-w-xs flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:border-t-blue-500 dark:shadow-neutral-700/70 m-2 transform transition-transform hover:scale-105"
                            >
                                <div className="p-4 md:p-5">
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                                        {appointment.bookerName}
                                    </p>
                                    <p className="text-lg text-gray-800 dark:text-white">
                                        <span className="font-bold mt-2 dark:text-neutral-400">Date: </span>
                                        {new Date(appointment.startTime).toLocaleDateString()}
                                    </p>
                                    <p className="text-lg text-gray-800 dark:text-white">
                                        <span className="font-bold mt-2 dark:text-neutral-400">Start: </span>
                                        {new Date(appointment.startTime).toLocaleTimeString()}
                                    </p>
                                    <p className="text-lg text-gray-800 dark:text-white">
                                        <span className="font-bold mt-2 dark:text-neutral-400">Duration: </span>
                                        {Math.round((new Date(appointment.endTime) - new Date(appointment.startTime)) / 1000 / 60)} m
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-red-600 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-red-600 ml-2 mr-2">Delete
                                        </button>
                                        <button
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-600 ml-2 mr-2">Show
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {row.length < cardsPerRow && <div key={'empty' + rowIndex} className="max-w-xs m-2"/>}
                    </div>
                ))}
            </div>
        );
    }

}

