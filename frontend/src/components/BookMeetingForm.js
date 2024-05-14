import React, {useState} from 'react';

export default function BookMeetingForm({onSubmit, onCancel}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(name, email);
        // Handle form submission here
        console.log(name, email);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                <div className="mt-2">
                    <input type="text" name="first-name" id="first-name" autoComplete="given-name"
                           className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           value={name} onChange={e => setName(e.target.value)} required/>
                </div>
            </div>
            <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email
                    address</label>
                <div className="mt-2">
                    <input id="email" name="email" type="email" autoComplete="email"
                           className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
            </div>
            <button type="submit" value="Submit"
                    className="mt-4 mr-8 cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit
            </button>
            <button type="button" onClick={onCancel} className="text-sm font-semibold leading-6 text-gray-900">Cancel
            </button>
        </form>
    );
}