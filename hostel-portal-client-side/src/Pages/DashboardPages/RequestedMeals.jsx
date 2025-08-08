import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth';

const RequestedMeals = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(`https://hostel-server-two.vercel.app/requests?email=${user?.email}`);
                setRequests(res.data);
            } catch (err) {
                toast.error('Failed to load requested meals', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchRequests();
        }
    }, [user?.email]);

    const handleCancel = async (id) => {
        const confirm = window.confirm('Are you sure you want to cancel this request?');
        if (!confirm) return;

        try {
            await axios.delete(`https://hostel-server-two.vercel.app/requests/${id}`);
            toast.success('Request canceled');
            setRequests(prev => prev.filter(req => req._id !== id));
        } catch {
            toast.error('Failed to cancel request');
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading requested meals...</p>;
    }

    return (
        <div className="p-4 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">My Requested Meals</h2>
            {requests.length === 0 ? (
                <p>No requested meals found.</p>
            ) : (
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-left">
                            <th>Title</th>
                            <th>Likes</th>
                            <th>Reviews</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.mealTitle}</td>
                                <td>{req.likes || 0}</td>
                                <td>{req.reviews_count || 0}</td>
                                <td>
                                    <span className={`badge ${req.status === 'pending' ? 'badge-warning' :
                                            req.status === 'approved' ? 'badge-success' :
                                                'badge-neutral'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    {req.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancel(req._id)}
                                            className="btn btn-xs btn-error"
                                        >
                                            Cancel
                                        </button>
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

export default RequestedMeals;