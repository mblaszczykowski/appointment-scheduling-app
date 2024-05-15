import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {generateDate, months} from "../util/calendar";
import cn from "../util/cn";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import BookMeetingForm from './BookMeetingForm';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

export default function Calendar() {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [selectDate, setSelectDate] = useState(currentDate);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const {calendarUrl} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/calendar/${calendarUrl}`);
                console.log(response.data);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                navigate('/error'); // Redirect to error page if user does not exist
            }
        };
        (async () => {
            await fetchUserData();
        })();
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

            (async () => {
                await fetchBookedSlots();
            })();
        }
    }, [userData, selectDate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No calendar data found.</div>;
    }

    const availableDays = userData.availableDays.split(',').map(day => day.trim());
    const isDateAvailable = availableDays.includes(selectDate.format('dddd'));
    const isPastDate = selectDate.isBefore(dayjs(), 'day');
    const handleCancel = () => {
        setShowBookingForm(false);
        setSelectedTimeSlot(null);
    };
    const handleTimeSlotClick = (hour) => {
        setSelectedTimeSlot(hour);
        setShowBookingForm(true);
    };
    const handleFormSubmit = async (name, email) => {
        const formatTime = (time) => time.toString().padStart(2, '0');

        const startTime = `${selectDate.format('YYYY-MM-DD')}T${formatTime(selectedTimeSlot)}:00:00`;
        const endTime = `${selectDate.format('YYYY-MM-DD')}T${formatTime(selectedTimeSlot + 1)}:00:00`;

        try {
            await axios.post('/api/appointments', {
                calendarUrl: calendarUrl,
                startTime: startTime,
                endTime: endTime,
                bookerName: name,
                bookerEmail: email
            });
            navigate('/booking-success');
        } catch (error) {
            console.error('Error booking appointment', error);
        }
    };


    return (
        <div
            className="flex gap-10 sm:divide-x justify-center sm:w-1/2 mx-auto  h-screen items-center sm:flex-row flex-col">
            <div className="w-96 h-96 ">
                <div className="flex justify-between items-center">
                    <h1 className="select-none font-semibold">
                        {months[today.month()]}, {today.year()}
                    </h1>
                    <div className="flex gap-10 items-center ">
                        <GrFormPrevious
                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                            onClick={() => {
                                setToday(today.month(today.month() - 1));
                            }}
                        />
                        <h1
                            className=" cursor-pointer hover:scale-105 transition-all"
                            onClick={() => {
                                setToday(currentDate);
                            }}
                        >
                            Today
                        </h1>
                        <GrFormNext
                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                            onClick={() => {
                                setToday(today.month(today.month() + 1));
                            }}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-7 ">
                    {days.map((day, index) => {
                        return (
                            <h1
                                key={index}
                                className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                            >
                                {day}
                            </h1>
                        );
                    })}
                </div>

                <div className=" grid grid-cols-7 ">
                    {generateDate(today.month(), today.year()).map(
                        ({date, currentMonth, today}, index) => {
                            return (
                                <div
                                    key={index}
                                    className="p-2 text-center h-14 grid place-content-center text-sm border-t"
                                >
                                    <h1
                                        className={cn(
                                            currentMonth ? "" : "text-gray-400",
                                            today
                                                ? "bg-red-600 text-white"
                                                : "",
                                            selectDate
                                                .toDate()
                                                .toDateString() ===
                                            date.toDate().toDateString()
                                                ? "bg-black text-white"
                                                : "",
                                            "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                                        )}
                                        onClick={() => {
                                            setSelectDate(date);
                                        }}
                                    >
                                        {date.date()}
                                    </h1>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
            <div className="h-96 w-96 sm:px-5">
                <h1 className=" font-semibold mb-3">
                    Schedule for {selectDate.toDate().toDateString()}
                </h1>
                {isPastDate ? (
                        <p className="text-gray-400">No meetings for that day</p>
                    ) :
                    showBookingForm ? (
                        <BookMeetingForm onSubmit={handleFormSubmit} onCancel={handleCancel}
                                         selectedTimeSlot={selectedTimeSlot}/>
                    ) : isDateAvailable ? (
                        <div className="grid gap-2"
                             style={{gridTemplateRows: `repeat(${availableHours.length}, minmax(0, 1fr))`}}>
                            {availableHours.map((hour, index) => (
                                <div key={index} className="p-2 border rounded cursor-pointer"
                                     onClick={() => handleTimeSlotClick(hour)}>
                                    {hour}:00 - {hour + 1}:00
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No meetings for that day.</p>
                    )}
            </div>

        </div>
    );
}
