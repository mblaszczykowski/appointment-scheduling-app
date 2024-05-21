import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import { generateDate, months } from '../../util/calendar';
import cn from '../../util/cn';
import BookMeetingForm from './BookMeetingForm';
import {UserIcon, ArrowRightIcon, ArrowLeftIcon, ArrowRightCircleIcon} from '../Icons';

const CalendarHeader = ({ today, setToday, currentDate }) => (
    <div className="flex justify-between items-center">
        <h1 className="select-none font-semibold">
            {months[today.month()]}, {today.year()}
        </h1>
        <div className="flex gap-10 items-center">
            <ArrowLeftIcon onClick={() => setToday(today.month(today.month() - 1))} />
            <h1
                className="cursor-pointer hover:scale-105 transition-all"
                onClick={() => setToday(currentDate)}
            >
                Today
            </h1>
            <ArrowRightIcon onClick={() => setToday(today.month(today.month() + 1))} />
        </div>
    </div>
);

const CalendarDays = ({ days }) => (
    <div className="grid grid-cols-7">
        {days.map((day, index) => (
            <h1
                key={index}
                className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
            >
                {day}
            </h1>
        ))}
    </div>
);

const CalendarGrid = ({ dates, selectDate, setSelectDate, resetBookingForm }) => (
    <div className="grid grid-cols-7">
        {dates.map(({ date, currentMonth, today }, index) => (
            <div key={index} className="p-2 text-center h-14 grid place-content-center text-sm border-t">
                <h1
                    className={cn(
                        currentMonth ? "" : "text-gray-400",
                        today ? "bg-red-600 text-white" : "",
                        selectDate.toDate().toDateString() === date.toDate().toDateString() ? "bg-black text-white" : "",
                        "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                    )}
                    onClick={() => {
                        setSelectDate(date);
                        resetBookingForm();
                    }}
                >
                    {date.date()}
                </h1>
            </div>
        ))}
    </div>
);

const Schedule = ({
                      selectDate,
                      isPastDate,
                      showBookingForm,
                      availableHours,
                      handleTimeSlotClick,
                      handleFormSubmit,
                      handleCancel,
                      selectedTimeSlot,
                      userData,
                      currentTime,
                      bookingLoading
                  }) => {
    const availableDays = userData.availableDays.split(',').map(day => day.trim());
    const isDateAvailable = availableDays.includes(selectDate.format('dddd'));

    const filteredHours = selectDate.isSame(dayjs(), 'day')
        ? availableHours.filter(hour => hour >= currentTime.hour())
        : availableHours;

    return (
        <div className="h-96 w-full sm:px-5 flex-1">
            <h1 className="font-semibold mb-2">Schedule for {selectDate.toDate().toDateString()}</h1>
            {isPastDate ? (
                <p className="text-gray-400">Can't book a date in the past.</p>
            ) : showBookingForm ? (
                <div>
                    {bookingLoading ? (
                        <div className="flex justify-center items-center">
                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <span className="ml-2">Booking appointment...</span>
                        </div>
                    ) : (
                        <>
                            <p className="font-medium mb-3 text-sm">
                                Selected time: {selectedTimeSlot}:00 - {selectedTimeSlot + 1}:00
                            </p>
                            <BookMeetingForm
                                onSubmit={handleFormSubmit}
                                onCancel={handleCancel}
                                selectedTimeSlot={selectedTimeSlot}
                            />
                        </>
                    )}
                </div>
            ) : isDateAvailable ? (
                filteredHours.length > 0 ? (
                    <div className="h-full overflow-y-auto">
                        {filteredHours.map((hour, index) => (
                            <div key={index} className="p-2 mt-1 border rounded cursor-pointer"
                                 onClick={() => handleTimeSlotClick(hour)}>
                                {hour}:00 - {hour + 1}:00
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No more meetings available for today.</p>
                )
            ) : (
                <p className="text-gray-400">No available meetings for that day.</p>
            )}
        </div>
    );
}

const Calendar = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [selectDate, setSelectDate] = useState(currentDate);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const { calendarUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/calendar/${calendarUrl}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                navigate('/error'); // Redirect to error page if user does not exist
            }
        };
        fetchUserData();
    }, [calendarUrl, navigate]);

    useEffect(() => {
        if (userData) {
            const fetchBookedSlots = async () => {
                try {
                    const response = await axios.get(`/api/appointments/user/${userData.id}?date=${selectDate.format('YYYY-MM-DD')}`);
                    const bookedSlots = response.data.map(appointment => new Date(appointment.startTime).getHours());

                    const allHours = [];
                    for (let hour = userData.availableFromHour; hour < userData.availableToHour; hour++) {
                        allHours.push(hour);
                    }

                    const available = allHours.filter(hour => !bookedSlots.includes(hour));
                    setAvailableHours(available);
                } catch (error) {
                    console.error('Error fetching booked slots', error);
                }
            };

            fetchBookedSlots();
        }
    }, [userData, selectDate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No calendar data found.</div>;
    }

    const handleCancel = () => {
        setShowBookingForm(false);
        setSelectedTimeSlot(null);
    };

    const handleTimeSlotClick = (hour) => {
        setSelectedTimeSlot(hour);
        setShowBookingForm(true);
    };

    const handleFormSubmit = async (name, email, notes) => {
        setBookingLoading(true);
        const formatTime = (time) => time.toString().padStart(2, '0');

        const startTime = `${selectDate.format('YYYY-MM-DD')}T${formatTime(selectedTimeSlot)}:00:00`;
        const endTime = `${selectDate.format('YYYY-MM-DD')}T${formatTime(selectedTimeSlot + 1)}:00:00`;

        try {
            await axios.post('/api/appointments', {
                calendarUrl: calendarUrl,
                startTime: startTime,
                endTime: endTime,
                bookerName: name,
                bookerEmail: email,
                meetingNote: notes,
                isActual: true,
            });
            navigate('/booking-success');
        } catch (error) {
            console.error('Error booking appointment', error);
        } finally {
            setBookingLoading(false);
        }
    };

    const resetBookingForm = () => {
        setShowBookingForm(false);
        setSelectedTimeSlot(null);
    };

    return (
        <div className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
            <div className="relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6">
                    <div className="max-w-2xl text-center mx-auto">
                        <h1 className="block text-2xl font-bold text-gray-800 sm:text-4xl md:text-3xl dark:text-white">
                            Choose a date that suits you <br />
                            <span className="text-blue-600">and book the meeting</span>
                        </h1>
                        <div className="mt-6 lg:mt-6 sm:mt-10 flex items-center justify-center">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full mr-4 shadow-lg flex items-center justify-center bg-gray-100">
                                <UserIcon />
                            </div>
                            <div className="ms-3 sm:ms-4">
                                <p className="sm:mb-1 font-semibold text-gray-800 dark:text-neutral-200 text-center">
                                    {userData.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-neutral-500 text-center">
                                    60 mins meetings available
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg shadow-lg p-6 bg-white pb-14 mt-10 flex sm:divide-x justify-center sm:w-2/3 mx-auto items-center sm:flex-row flex-col">
                        <div className="flex gap-10 sm:divide-x justify-center w-full sm:w-full mx-auto items-center sm:flex-row flex-col">
                            <div className="w-full h-96 flex-1">
                                <CalendarHeader today={today} setToday={setToday} currentDate={currentDate} />
                                <CalendarDays days={days}/>
                                <CalendarGrid dates={generateDate(today.month(), today.year())} selectDate={selectDate}
                                              setSelectDate={setSelectDate} resetBookingForm={resetBookingForm}/>
                            </div>
                            <Schedule
                                selectDate={selectDate}
                                isPastDate={selectDate.isBefore(dayjs(), 'day')}
                                showBookingForm={showBookingForm}
                                availableHours={availableHours}
                                handleTimeSlotClick={handleTimeSlotClick}
                                handleFormSubmit={handleFormSubmit}
                                handleCancel={handleCancel}
                                selectedTimeSlot={selectedTimeSlot}
                                userData={userData}
                                currentTime={dayjs()}
                                bookingLoading={bookingLoading}
                            />
                        </div>
                    </div>
                    <a
                        className="cursor-pointer group block bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-all duration-300 dark:bg-white/10 dark:hover:bg-white/10 fixed bottom-4 left-0 right-0 mx-4"
                        onClick={() => navigate('/register')}
                        style={{ zIndex: 1000 }}
                    >
                        <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
              <span className="ml-5 decoration-2 inline-flex justify-center items-center gap-x-2 font-semibold text-blue-600 text-sm dark:text-blue-500">
                Create your own calendar
                <ArrowRightCircleIcon />
              </span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
