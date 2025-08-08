import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpcomingMealsButton from './UpcomingMealsButton';

const UpcomingMealsAdmin = () => {
    const [upcomingmeals, setUpcomingMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const fetchUpcoming = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://hostel-server-two.vercel.app/upcoming');
            setUpcomingMeals(res.data || []);
        } catch (err) {
            console.error('Error fetching upcoming meals:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUpcoming();
    }, [refresh]);

    // Auto-publish meals that get 10 or more likes
    useEffect(() => {
        upcomingmeals.forEach(async (meal) => {
            const likeCount = meal.likes?.length || 0;
            if (likeCount >= 10 && !meal.published) {
                try {
                    const res = await axios.patch(`https://hostel-server-two.vercel.app/upcoming/${meal._id}`);
                    if (res.data.success) {
                        console.log(`Auto-published: ${meal.title}`);
                        setRefresh(prev => !prev); // Refetch updated meals
                    }
                } catch (err) {
                    console.error(`Error auto-publishing meal: ${meal.title}`, err);
                }
            }
        });
    }, [upcomingmeals]);

    // Manual Publish
    const handlePublish = async (id) => {
        const isConfirmed = window.confirm("Publish this meal now?");
        if (!isConfirmed) return;

        try {
            const res = await axios.patch(`https://hostel-server-two.vercel.app/upcoming/${id}`);
            if (res.data.success) {
                fetchUpcoming();
            }
        } catch (err) {
            console.error('Error publishing meal:', err);
        }
    };

    const handleCancel = async (id) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this upcoming meal?");
        if (!confirmCancel) return;

        try {
            const res = await axios.delete(`https://hostel-server-two.vercel.app/upcoming/${id}`);
            if (res.data.success) {
                fetchUpcoming();
            }
        } catch (err) {
            console.error('Error cancelling meal:', err);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Upcoming Meals</h2>
                <UpcomingMealsButton onSuccess={() => setRefresh(prev => !prev)} />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Publish Date</th>
                            <th>Likes</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingmeals.map(upcomingmeal => (
                            <tr key={upcomingmeal._id}>
                                <td>{upcomingmeal.title}</td>
                                <td>{upcomingmeal.category}</td>
                                <td>৳{upcomingmeal.price.toFixed(2)}</td>
                                <td>{new Date(upcomingmeal.publishDate).toLocaleString()}</td>
                                <td>{upcomingmeal.likes?.length || 0}</td>
                                <td>
                                    {upcomingmeal.published ? (
                                        <span className="text-green-600 font-semibold">Published</span>
                                    ) : (
                                        <span className="text-yellow-600">Pending</span>
                                    )}
                                </td>
                                <td className="space-x-2">
                                    <button
                                        className="btn btn-success btn-xs"
                                        onClick={() => handlePublish(upcomingmeal._id)}
                                    >
                                        Publish
                                    </button>
                                    <button
                                        className="btn btn-error btn-xs"
                                        onClick={() => handleCancel(upcomingmeal._id)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UpcomingMealsAdmin;