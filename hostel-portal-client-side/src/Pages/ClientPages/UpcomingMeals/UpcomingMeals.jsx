import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth';
import UpcomingMealsCard from './UpcomingMealsCard';

const UpcomingMeals = () => {
    const [upcomingmeals, setUpcomingMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUpcomingMeals = async () => {
            try {
                const res = await axios.get('https://hostel-server-two.vercel.app/upcoming');
                setUpcomingMeals(res.data || []);
            } catch (error) {
                console.error('Failed to fetch upcoming meals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingMeals();
    }, []);

    const handleLike = async (upcomingmealId) => {
        if (!user?.email) {
            alert("Please log in to like meals.");
            return;
        }

        try {
            const res = await axios.patch(`https://hostel-server-two.vercel.app/upcoming/${upcomingmealId}/like`, {
                userId: user.email,
            });

            setUpcomingMeals(prev =>
                prev.map(upcomingmeal =>
                    upcomingmeal._id === upcomingmealId
                        ? { ...upcomingmeal, likes: res.data.likes }
                        : upcomingmeal
                )
            );
        } catch (error) {
            console.error('Error liking meal:', error);
        }
    };

    if (loading) return <p className="text-center py-10">Loading upcoming meals...</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Meals</h1>

            {upcomingmeals.length === 0 ? (
                <p className="text-center text-gray-500">No upcoming meals found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingmeals.map(upcomingmeal => (
                        <div key={upcomingmeal._id} className="relative">
                            <UpcomingMealsCard
                                upcomingmeal={upcomingmeal}
                                onLike={() => handleLike(upcomingmeal._id)}
                            />

                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => handleLike(upcomingmeal._id)}
                                    className="bg-white rounded-full p-2 shadow hover:scale-110 transition"
                                    title="Like this meal"
                                >
                                    ❤️ {upcomingmeal.likes?.length || 0}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingMeals;