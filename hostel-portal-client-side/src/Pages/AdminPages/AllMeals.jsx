import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const AllMeals = () => {
    const [meals, setMeals] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);

    const fetchMeals = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://hostel-server-two.vercel.app/admin/meals', {
                params: {
                    sortBy: sortField,
                    order: sortOrder,
                },
            });
            setMeals(res.data || []);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
        setLoading(false);
    }, [sortField, sortOrder]);

    useEffect(() => {
        fetchMeals();
    }, [fetchMeals]);

    // Delete meal handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meal?')) return;
        try {
            await axios.delete(`https://hostel-server-two.vercel.app/meals/${id}`);
            setMeals((prev) => prev.filter((meal) => meal._id !== id));
        } catch (error) {
            console.error('Failed to delete meal:', error);
        }
    };

    // Toggle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            // toggle order
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">All Meals</h2>

            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th
                            className="cursor-pointer"
                            onClick={() => handleSort('likes')}
                        >
                            Likes {sortField === 'likes' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th
                            className="cursor-pointer"
                            onClick={() => handleSort('reviews_count')}
                        >
                            Reviews {sortField === 'reviews_count' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th>Rating</th>
                        <th>Distributor Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                    ) : meals.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-4">No meals found.</td></tr>
                    ) : (
                        meals.map((meal) => (
                            <tr key={meal._id}>
                                <td>{meal.title}</td>
                                <td>{meal.likes ? meal.likes.length : 0}</td>
                                <td>{meal.reviews_count || 0}</td>
                                <td>{meal.rating || 0}</td>
                                <td>{meal.distributorName || 'N/A'}</td>
                                <td className="flex gap-2">
                                    <Link to={`/admin/mealdetails/${meal._id}`}>
                                        <button className="btn btn-primary btn-xs">View</button>
                                    </Link>
                                    <Link to={`/admin/updatemeal/${meal._id}`}>
                                        <button className="btn btn-warning btn-xs">Update</button>
                                    </Link>
                                    <button
                                        className="btn btn-error btn-xs"
                                        onClick={() => handleDelete(meal._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllMeals;