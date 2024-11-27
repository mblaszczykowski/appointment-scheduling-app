import React, { useEffect, useState } from 'react';
import { request, setAuthHeader } from '../../util/axios_helper';
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('auth_token') !== null;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchUsers();
    }, [isLoggedIn, navigate]);

    const fetchUsers = () => {
        request('GET', `/api/users/all`, {})
            .then((response) => {
                // Sort users by ID in ascending order
                const sortedUsers = response.data.sort((a, b) => a.id - b.id);
                setUsers(sortedUsers);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setAuthHeader(null);
                    navigate('/login');
                } else {
                    console.error("Error fetching users:", error);
                }
            });
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            request('DELETE', `/api/users/${id}`, {})
                .then(() => {
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                })
                .catch((error) => {
                    console.error(`Error deleting user with ID ${id}:`, error);
                });
        }
    };

    return (
        <div className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent min-h-screen">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Users</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border border-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">ID</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Firstname</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Lastname</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Email</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Available days</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Available hours</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Meeting duration</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Meeting link</th>
                                <th className="p-4 text-sm font-bold text-gray-800 border-b text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users
                                .filter((user) => !user.isAdmin)
                                .map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    >
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.id}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.firstname}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.lastname}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.email}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.availableDays}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">
                                            {`${user.availableFromHour}-${user.availableToHour}`}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.meetingDuration}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">{user.meetingLink}</td>
                                        <td className="p-4 text-sm text-gray-600 border-b text-left">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-md text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}




