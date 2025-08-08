import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

const AllMealsUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const res = await axios.get(`https://hostel-server-two.vercel.app/meals/${id}`);
                const fetchedMeal = res.data;

                setMeal({
                    ...fetchedMeal,
                    price: parseFloat(fetchedMeal.price),
                    postTime: new Date(fetchedMeal.postTime).toISOString().slice(0, 16),
                });
            } catch (err) {
                console.error('Failed to fetch meal:', err);
                setError('Could not load meal data.');
            } finally {
                setLoading(false);
            }
        };

        fetchMeal();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeal((prev) => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const updatedMeal = {
                ...meal,
                price: parseFloat(meal.price),
                postTime: new Date(meal.postTime),
            };

            const res = await axios.patch(`https://hostel-server-two.vercel.app/meals/${id}`, updatedMeal);

            if (res.data.success) {
                alert('Meal updated successfully!✅');
                navigate('/admin/allmeals');
            }
        } catch (error) {
            console.error('❌ Failed to update meal:', error);
            alert('Something went wrong.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!meal) return <div className="p-4 text-gray-500">Meal not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Update Meal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block font-semibold">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={meal.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Category</label>
                    <select
                        name="category"
                        value={meal.category}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Ingredients</label>
                    <textarea
                        name="ingredients"
                        value={meal.ingredients}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={meal.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Price (Tk.)</label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        value={meal.price}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Post Time</label>
                    <input
                        type="datetime-local"
                        name="postTime"
                        value={meal.postTime}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={updating}>
                    {updating ? 'Updating...' : 'Update Meal'}
                </button>

                <button
                    type="button"
                    className="btn btn-outline w-full"
                    onClick={() => navigate('/admin/allmeals')}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AllMealsUpdate;