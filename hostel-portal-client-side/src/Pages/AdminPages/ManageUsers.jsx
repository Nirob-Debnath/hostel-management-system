import React, { useEffect, useState } from 'react';
import useAxios from '../../Axios/UseAxios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios();

    // Fetch users with role 'user' and search query
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Server-side search on username or email
            const res = await axiosInstance.get('/users', {
                params: {
                    role: 'user',
                    search
                }
            });
            setUsers(res.data.users || res.data); // adapt depending on your backend response shape
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/users', {
                    params: { role: 'user', search }
                });
                setUsers(res.data.users || res.data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
            setLoading(false);
        };

        fetchUsers();
    }, [search, axiosInstance]);


    // Make a user an admin
    const handleMakeAdmin = async (userId) => {
        try {
            await axiosInstance.patch(`/users/${userId}/make-admin`);
            alert('User promoted to admin!');
            fetchUsers(); // refresh user list
        } catch (err) {
            console.error('Failed to promote user', err);
            alert('Failed to promote user.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

            <input
                type="text"
                placeholder="Search by username or email"
                className="input input-bordered mb-4 w-full max-w-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Subscription Status</th>
                                <th>Make Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>{user.email}</td>
                                    <td>{user.subscriptionStatus || 'None'}</td>
                                    <td>
                                        {user.role === 'admin' ? (
                                            <span className="badge badge-success">Admin</span>
                                        ) : (
                                            <button
                                                onClick={() => handleMakeAdmin(user._id)}
                                                className="btn btn-xs btn-primary"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;