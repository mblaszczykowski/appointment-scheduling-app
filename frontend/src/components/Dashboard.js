import React, { Component } from 'react';
import { getUserIdFromToken, request, setAuthHeader } from '../util/axios_helper';
import dayjs from 'dayjs';
import SettingsForm from "./SettingsForm";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Dashboard.css'; // Make sure to import the CSS file for animations

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedTab: 'upcoming', // Default tab
        };
    }

    componentDidMount() {
        request('GET', `/api/appointments/user/${getUserIdFromToken()}`, {})
            .then((response) => {
                console.log('DATA: ');
                console.log(response.data);
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

    setSelectedTab = (tab) => {
        this.setState({ selectedTab: tab });
    }

    renderContent() {
        const { selectedTab, data } = this.state;

        if (selectedTab === 'upcoming') {
            return (
                <div>
                    <div className="mb-4">
                        <label htmlFor="icon" className="sr-only">
                            Search
                        </label>
                        <div className="relative min-w-72 md:min-w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-3">
                                <svg
                                    className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-neutral-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx={11} cy={11} r={8} />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="icon"
                                name="icon"
                                className="py-2 pl-10 pr-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Search"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2">
                        Today
                    </h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
                            >
                                <div className="p-4 md:p-6">
                  <span className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
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
                                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                                        Start time: {dayjs(appointment.startTime).format('h:mm A')}
                                    </div>
                                    <div
                                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                                        Duration: {dayjs(appointment.endTime).diff(dayjs(appointment.startTime), 'minute')} mins
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (selectedTab === 'past') {
            return (
                <div>
                    <h1 className="mt-4 mb-5 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                        Past meetings
                    </h1>
                    <p className="text-gray-800 dark:text-neutral-400">Past meetings goes here...</p>
                </div>
            );
        } else if (selectedTab === 'settings') {
            return (
                <div>
                    <h1 className="mt-4 mb-5 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                        Update your account
                    </h1>
                    <SettingsForm/>
                </div>
            );
        }
    }

    render() {
        const { selectedTab } = this.state;

        return (
            <div
                className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent min-h-screen">
                {/* Main Container */}
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="mb-2 ml-4 block text-3xl font-bold text-gray-800 sm:text-4xl md:text-3xl dark:text-white">
                            Hello, <span
                            className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">user</span>
                        </h1>
                        <h1 className="ml-4 mb-8 block text-xl font-bold text-gray-800 sm:text-4xl md:text-xl dark:text-white">
                            Today is friday, 12 June

                        </h1>

                        {/* Sidebar and Main Content */}
                        <div className="flex flex-col md:flex-row md:items-start">
                            <div
                                className="w-full md:w-1/4 flex-shrink-0 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-lg rounded-3xl p-6 mb-6 md:mb-0">

                                <h1 className="ml-2 mt-4 mb-6 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">Dashboard</span>
                                </h1>

                                <button
                                    onClick={() => this.setSelectedTab('upcoming')}
                                    className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-md rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'upcoming' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                                >
                                    <svg
                                        className="flex-shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9 22 9 12 15 12 15 22"/>
                                    </svg>
                                    Upcoming meetings
                                </button>
                                <button
                                    onClick={() => this.setSelectedTab('past')}
                                    className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-md rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'past' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                                >
                                    <svg
                                        className="flex-shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect width={18} height={18} x={3} y={4} rx={2} ry={2}/>
                                        <line x1={16} x2={16} y1={2} y2={6}/>
                                        <line x1={8} x2={8} y1={2} y2={6}/>
                                        <line x1={3} x2={21} y1={10} y2={10}/>
                                        <path d="M8 14h.01"/>
                                        <path d="M12 14h.01"/>
                                        <path d="M16 14h.01"/>
                                        <path d="M8 18h.01"/>
                                        <path d="M12 18h.01"/>
                                        <path d="M16 18h.01"/>
                                    </svg>
                                    Past meetings
                                </button>
                                <button
                                    onClick={() => this.setSelectedTab('settings')}
                                    className={`w-full flex items-center gap-x-3.5 py-2 mt-1 md-1 px-2.5 text-md rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'settings' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                                >
                                    <svg
                                        className="flex-shrink-0 mt-0.5 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx={18} cy={15} r={3}/>
                                        <circle cx={9} cy={7} r={4}/>
                                        <path d="M10 15H6a4 4 0 0 0-4 4v2"/>
                                        <path d="m21.7 16.4-.9-.3"/>
                                        <path d="m15.2 13.9-.9-.3"/>
                                        <path d="m16.6 18.7.3-.9"/>
                                        <path d="m19.1 12.2.3-.9"/>
                                        <path d="m19.6 18.7-.4-1"/>
                                        <path d="m16.8 12.3-.4-1"/>
                                        <path d="m14.3 16.6 1-.4"/>
                                        <path d="m20.7 13.8 1-.4"/>
                                    </svg>
                                    Profile settings
                                </button>
                                <div className="mb-8"></div>
                            </div>

                            {/* Main Content */}
                            <div className="w-full md:w-3/4 pl-0 md:pl-8">
                                <TransitionGroup>
                                    <CSSTransition
                                        key={selectedTab}
                                        timeout={300}
                                        classNames="fade"
                                    >
                                        {this.renderContent()}
                                    </CSSTransition>
                                </TransitionGroup>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
