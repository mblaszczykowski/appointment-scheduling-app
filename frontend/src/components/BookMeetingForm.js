import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookMeetingForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hourRange, setHourRange] = useState([]);
    const [selectedHour, setSelectedHour] = useState('');

    useEffect(() => {
        // Replace with your actual API endpoint
        /*
        axios.get('/api/hourRange')
            .then(response => {
                setHourRange(response.data);
            })
            .catch(error => {
                console.error('Error fetching hour range', error);
            });

         */
        const exampleHourRanges = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];
        setHourRange(exampleHourRanges);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        console.log(name, email, selectedHour);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
                Hour:
                <select value={selectedHour} onChange={e => setSelectedHour(e.target.value)} required>
                    {hourRange.map((hour, index) => (
                        <option key={index} value={hour}>{hour}</option>
                    ))}
                </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}