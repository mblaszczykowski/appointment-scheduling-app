import React from 'react';
import AppointmentCard from './AppointmentCard';
import SearchBar from './SearchBar';

const CanceledMeetings = ({ searchQuery, handleSearchChange, appointments }) => {
    const totalAppointments = Object.values(appointments).flat().length;
    const noMeetingsMessage = searchQuery
        ? "No cancelled meetings match your search."
        : "No cancelled meetings.";

    return (
        <div>
            <h1 className="mt-4 mb-3 ml-2 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                Upcoming meetings
            </h1>
            <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />

            {totalAppointments === 0 ? (
                <p className="text-gray-400 ml-2">{noMeetingsMessage}</p>
            ) : (
                <>
                    {appointments.today.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2">
                                Today
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.today.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}

                    {appointments.thisWeek.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                This Week
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.thisWeek.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}

                    {appointments.thisMonth.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                This Month
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.thisMonth.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}

                    {appointments.nextMonth.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                Next Month
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.nextMonth.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}

                    {appointments.later.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                Later
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.later.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CanceledMeetings;
