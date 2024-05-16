// Dashboard.js
import React, { Component } from 'react';
import { getUserIdFromToken, request, setAuthHeader } from '../../util/axios_helper';
import dayjs from 'dayjs';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Dashboard.css'; // Make sure to import the CSS file for animations
import { HomeIcon, CalendarIcon, UserIcon } from '../Icons';
import UpcomingMeetings from './UpcomingMeetings';
import PastMeetings from './PastMeetings';
import SettingsForm from "./SettingsForm";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedTab: 'upcoming', // Default tab
            searchQuery: '' // New state for search query
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

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    }

    filterAppointments = () => {
        const { data } = this.state;
        const now = dayjs();

        const filteredData = data.filter(appointment =>
            appointment.bookerName.toLowerCase().includes(this.state.searchQuery.toLowerCase())
        );

        const groupAppointments = (filterFn) => filteredData.filter(filterFn);

        return {
            upcoming: {
                today: groupAppointments(appointment => dayjs(appointment.startTime).isSame(now, 'day') && dayjs(appointment.endTime).isAfter(now)),
                thisWeek: groupAppointments(appointment => dayjs(appointment.startTime).isAfter(now, 'day') && dayjs(appointment.startTime).isBefore(now.endOf('week'))),
                thisMonth: groupAppointments(appointment => dayjs(appointment.startTime).isAfter(now.endOf('week')) && dayjs(appointment.startTime).isBefore(now.endOf('month'))),
                nextMonth: groupAppointments(appointment => dayjs(appointment.startTime).isAfter(now.endOf('month')) && dayjs(appointment.startTime).isBefore(now.add(1, 'month').endOf('month'))),
                later: groupAppointments(appointment => dayjs(appointment.startTime).isAfter(now.add(1, 'month').endOf('month')))
            },
            past: {
                today: groupAppointments(appointment => dayjs(appointment.endTime).isSame(now, 'day') && dayjs(appointment.endTime).isBefore(now)),
                lastWeek: groupAppointments(appointment => dayjs(appointment.endTime).isAfter(now.subtract(1, 'week').startOf('day')) && dayjs(appointment.endTime).isBefore(now.startOf('day'))),
                lastMonth: groupAppointments(appointment => dayjs(appointment.endTime).isAfter(now.subtract(1, 'month').startOf('day')) && dayjs(appointment.endTime).isBefore(now.subtract(1, 'week').endOf('day'))),
                earlier: groupAppointments(appointment => dayjs(appointment.endTime).isBefore(now.subtract(1, 'month').startOf('day')))
            }
        };
    }

    renderContent = () => {
        const { selectedTab, searchQuery } = this.state;
        const appointments = this.filterAppointments();

        switch (selectedTab) {
            case 'upcoming':
                return <UpcomingMeetings searchQuery={searchQuery} handleSearchChange={this.handleSearchChange} appointments={appointments.upcoming} />;
            case 'past':
                return <PastMeetings searchQuery={searchQuery} handleSearchChange={this.handleSearchChange} appointments={appointments.past} />;
            case 'settings':
                return (
                    <div>
                        <h1 className="mt-4 mb-5 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                            Update your account
                        </h1>
                        <SettingsForm />
                    </div>
                );
            default:
                return null;
        }
    }

    render() {
        const { selectedTab } = this.state;
        const currentDate = dayjs().format('dddd, D MMMM');

        return (
            <div className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent min-h-screen">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="mb-2 ml-4 block text-3xl font-bold text-gray-800 sm:text-4xl md:text-3xl dark:text-white">
                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">user</span>
                        </h1>
                        <h1 className="ml-4 mb-8 block text-xl font-bold text-gray-800 sm:text-4xl md:text-xl dark:text-white">
                            Today is {currentDate}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-start">
                            <div className="w-full md:w-1/4 flex-shrink-0 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-lg rounded-3xl p-6 mb-6 md:mb-0">
                                <h1 className="ml-2 mt-3 mb-6 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">Dashboard</span>
                                </h1>

                                <button
                                    onClick={() => this.setSelectedTab('upcoming')}
                                    className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-md rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'upcoming' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                                >
                                    <HomeIcon />
                                    Upcoming meetings
                                </button>
                                <button
                                    onClick={() => this.setSelectedTab('past')}
                                    className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-md rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'past' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                                >
                                    <CalendarIcon />
                                    Past meetings
                                </button>
                                <button
                                    onClick={() => this.setSelectedTab('settings')}
                                    className={`w-full flex items-center gap-x-3.5 py-2 mt-1 md-1 px-2.5 text-md rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'settings' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                                >
                                    <UserIcon />
                                    Profile settings
                                </button>
                                <div className="mb-5"></div>
                            </div>

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
