// Dashboard.js
import React, {useEffect, useState} from 'react';
import {getUserIdFromToken, request, setAuthHeader} from '../../util/axios_helper';
import dayjs from 'dayjs';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './Dashboard.css'; // Make sure to import the CSS file for animations
import {CalendarIcon, CancelIcon, HomeIcon, UserIconDashboard} from '../Icons';
import UpcomingMeetings from './UpcomingMeetings';
import PastMeetings from './PastMeetings';
import SettingsForm from "./SettingsForm";
import {useNavigate} from "react-router-dom";
import CanceledMeetings from "./CanceledMeetings";

export default function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [username, setUsername] = useState('');
    const [selectedTab, setSelectedTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('auth_token') !== null;

    useEffect(() => {
        if (!isLoggedIn) {
            return navigate('/login');
        }
        request('GET', `/api/appointments/user/${getUserIdFromToken()}`, {})
            .then((response) => {
                setAppointments(response.data.appointments);
                setUsername(response.data.username);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setAuthHeader(null);
                } else {
                    setAppointments(error.response ? error.response.code : 'Unknown error')
                }
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const filterAppointments = () => {
        const now = dayjs();

        const filteredDataActual = appointments.filter(appointment =>
            appointment.bookerName.toLowerCase().includes(searchQuery.toLowerCase()) && appointment.isActual
        );
        const filteredDataCanceled = appointments.filter(appointment =>
            appointment.bookerName.toLowerCase().includes(searchQuery.toLowerCase()) && !appointment.isActual
        );

        const groupAppointments = (filterFn) => filteredDataActual.filter(filterFn);
        const groupAppointmentsCanceled = (filterFn) => filteredDataCanceled.filter(filterFn);

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
            },
            canceled: {
                today: groupAppointmentsCanceled(appointment => dayjs(appointment.startTime).isSame(now, 'day') && dayjs(appointment.endTime).isAfter(now)),
                thisWeek: groupAppointmentsCanceled(appointment => dayjs(appointment.startTime).isAfter(now, 'day') && dayjs(appointment.startTime).isBefore(now.endOf('week'))),
                thisMonth: groupAppointmentsCanceled(appointment => dayjs(appointment.startTime).isAfter(now.endOf('week')) && dayjs(appointment.startTime).isBefore(now.endOf('month'))),
                nextMonth: groupAppointmentsCanceled(appointment => dayjs(appointment.startTime).isAfter(now.endOf('month')) && dayjs(appointment.startTime).isBefore(now.add(1, 'month').endOf('month'))),
                later: groupAppointmentsCanceled(appointment => dayjs(appointment.startTime).isAfter(now.add(1, 'month').endOf('month')))
            }
        };
    }

    const renderContent = () => {
        const appointments = filterAppointments();

        switch (selectedTab) {
            case 'upcoming':
                return <UpcomingMeetings searchQuery={searchQuery} handleSearchChange={handleSearchChange}
                                         appointments={appointments.upcoming}/>;
            case 'past':
                return <PastMeetings searchQuery={searchQuery} handleSearchChange={handleSearchChange}
                                     appointments={appointments.past}/>;
            case 'canceled':
                return <CanceledMeetings searchQuery={searchQuery} handleSearchChange={handleSearchChange}
                                         appointments={appointments.canceled}/>;
            case 'settings':
                return (
                    <div>
                        <h1 className="mt-4 mb-5 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                            Update your account
                        </h1><br/>
                        <SettingsForm/>
                    </div>

                );
            default:
                return null;
        }
    }

    const currentDate = dayjs().format('dddd, D MMMM');


    return (
        <div
            className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent min-h-screen">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="mb-1 ml-4 block text-3xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                        Hello, <span
                        className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">{username}</span>
                    </h1>
                    <h1 className="ml-4 mb-8 block text-sm text-gray-800 sm:text-4xl  md:text-base dark:text-white">
                        Today is {currentDate}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-start">
                        <div
                            className="w-full md:w-1/4 flex-shrink-0 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-lg rounded-3xl p-6 mb-6 md:mb-0">
                            <h1 className="ml-2 mt-2 mb-4 block text-xl font-bold text-gray-800 sm:text-4xl md:text-xl dark:text-white">
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-blue-500">Dashboard</span>
                            </h1>

                            <button
                                onClick={() => setSelectedTab('upcoming')}
                                className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'upcoming' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                            >
                                <HomeIcon/>
                                Upcoming meetings
                            </button>
                            <button
                                onClick={() => setSelectedTab('past')}
                                className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'past' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                            >
                                <CalendarIcon/>
                                Past meetings
                            </button>
                            <button
                                onClick={() => setSelectedTab('canceled')}
                                className={`w-full mt-1 mb-2 flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'canceled' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                            >
                                <CancelIcon/>
                                Cancelled meetings
                            </button>
                            <button
                                onClick={() => setSelectedTab('settings')}
                                className={`w-full flex items-center gap-x-3.5 py-2 mt-1 md-1 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${selectedTab === 'settings' ? 'bg-gray-100 dark:bg-neutral-700' : 'text-neutral-700 dark:text-white'}`}
                            >
                                <UserIconDashboard/>
                                Profile settings
                            </button>
                            <div className="mb-2"></div>
                        </div>

                        <div className="w-full md:w-3/4 pl-0 md:pl-8">
                            <TransitionGroup>
                                <CSSTransition
                                    key={selectedTab}
                                    timeout={300}
                                    classNames="fade"
                                >
                                    {renderContent()}
                                </CSSTransition>
                            </TransitionGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
