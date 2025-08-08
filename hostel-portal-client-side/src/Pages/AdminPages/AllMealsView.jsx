import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';

const AllMealsView = () => {
    const { id } = useParams();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const res = await axios.get(`https://hostel-server-two.vercel.app/meals/${id}`);
                setMeal(res.data);
            } catch (err) {
                console.error('Failed to fetch meal:', err);
                setError('Failed to fetch meal details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMeal();
    }, [id]);

    if (loading) {
        return <div className="p-4 text-center text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600 text-center">{error}</div>;
    }

    if (!meal) {
        return <div className="p-4 text-center text-gray-600">No meal found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{meal.title}</h2>
            <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-64 object-cover rounded mb-4"
            />
            <p><strong>Category:</strong> {meal.category}</p>
            <p><strong>Ingredients:</strong> {meal.ingredients}</p>
            <p><strong>Description:</strong> {meal.description}</p>
            <p><strong>Price:</strong> ৳{meal.price}</p>
            <p><strong>Posted At:</strong> {new Date(meal.postTime).toLocaleString()}</p>
            <p><strong>Distributor:</strong> {meal.distributorName} ({meal.distributorEmail})</p>
            <p><strong>Likes:</strong> {meal.likes?.length || 0}</p>
            <p><strong>Rating:</strong> {meal.rating || 0}</p>
            <p><strong>Reviews:</strong> {meal.reviews_count || 0}</p>

            <div className="mt-6">
                <Link to="/admin/allmeals">
                    <button className="btn btn-secondary">⬅ Back to Meals</button>
                </Link>
            </div>
        </div>
    );
};

export default AllMealsView;