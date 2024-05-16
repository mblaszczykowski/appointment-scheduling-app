// PastMeetings.js
import React from 'react';
import AppointmentCard from './AppointmentCard';
import SearchBar from './SearchBar';

const PastMeetings = ({ searchQuery, handleSearchChange, appointments }) => {
    const totalAppointments = Object.values(appointments).flat().length;
    const noMeetingsMessage = searchQuery
        ? "No past meetings match your search."
        : "No past meetings.";

    return (
        <div>
            <h1 className="mt-4 mb-3 ml-2 block text-xl font-bold text-gray-800 sm:text-4xl md:text-2xl dark:text-white">
                Past meetings
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

                    {appointments.lastWeek.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                Last Week
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.lastWeek.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}

                    {appointments.lastMonth.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                Last Month
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.lastMonth.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </>
                    )}

                    {appointments.earlier.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white ml-3 mb-2 mt-4">
                                Earlier
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.earlier.map(appointment => (
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

export default PastMeetings;
