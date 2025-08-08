import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth';

const ServeMeal = () => {
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchRequests();

        const intervalId = setInterval(() => {
            fetchRequests();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [search, user?.email]);

    const fetchRequests = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const res = await axios.get(`https://hostel-server-two.vercel.app/requests?email=${user.email}`);
            let filtered = res.data;

            if (search) {
                const lower = search.toLowerCase();
                filtered = filtered.filter(req =>
                    req.userName?.toLowerCase().includes(lower) ||
                    req.userEmail?.toLowerCase().includes(lower)
                );
            }

            setRequests(filtered);
        } catch (err) {
            toast.error('Failed to load requests', err);
        } finally {
            setLoading(false);
        }
    };

    const handleServe = async (id) => {
        try {
            await axios.patch(`https://hostel-server-two.vercel.app/requests/${id}/serve`);
            toast.success('Meal marked as delivered');
            fetchRequests();
        } catch {
            toast.error('Failed to mark as delivered');
        }
    };

    const handleCancel = async (id) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this request?');
        if (!confirmCancel) return;

        try {
            // Patch request status to "cancelled"
            await axios.patch(`https://hostel-server-two.vercel.app/requests/${id}`, { status: 'cancelled' });
            toast.success('Request cancelled');
            fetchRequests();
        } catch {
            toast.error('Failed to cancel request');
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading meal requests...</p>;
    }

    return (
        <div className="p-4 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Serve Requested Meals</h2>

            <input
                type="text"
                placeholder="Search by name or email"
                className="input input-bordered mb-4 w-full md:w-1/3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-left">
                            <th>Title</th>
                            <th>User Email</th>
                            <th>User Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.mealTitle}</td>
                                <td>{req.userEmail}</td>
                                <td>{req.userName}</td>
                                <td>
                                    <span className={`badge ${req.status === 'delivered' ? 'badge-success' :
                                            req.status === 'cancelled' ? 'badge-error' : 'badge-warning'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    {req.status !== 'delivered' && req.status !== 'cancelled' && (
                                        <>
                                            <button
                                                onClick={() => handleServe(req._id)}
                                                className="btn btn-xs btn-primary mr-2"
                                            >
                                                Serve
                                            </button>
                                            <button
                                                onClick={() => handleCancel(req._id)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ServeMeal;