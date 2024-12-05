import React, { useState } from 'react';

export default function BookMeetingForm({ onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(name, email, notes);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                <div className="mt-1">
                    <input type="text" name="first-name" id="first-name" autoComplete="given-name"
                           className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           value={name} onChange={e => setName(e.target.value)} required/>
                </div>
            </div>
            <div className="sm:col-span-4 mt-2">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email
                    address</label>
                <div className="mt-1">
                    <input id="email" name="email" type="email" autoComplete="email"
                           className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
            </div>
            <div className="sm:col-span-4 mt-2">
                <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">Meeting notes</label>
                <div className="mt-1">
                    <textarea id="notes" name="notes" rows="4"
                              className="px-2 block resize-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
            </div>
            <button type="submit" value="Submit"
                    className="mt-4 mr-8 cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-blue-500 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-blue-500"
            >Submit
            </button>
            <button type="button" onClick={onCancel} className="text-sm font-semibold leading-6 text-gray-900">Cancel
            </button>
        </form>
    );
}
