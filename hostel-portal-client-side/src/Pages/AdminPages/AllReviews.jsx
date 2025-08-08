import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviewsWithMealData = async () => {
            setLoading(true);
            try {
                const reviewRes = await axios.get('https://hostel-server-two.vercel.app/reviews/all');
                const reviewData = reviewRes.data;

                // Fetch related meals
                const mealIds = [...new Set(reviewData.map(r => r.mealId))];
                const mealRes = await Promise.all(mealIds.map(id =>
                    axios.get(`https://hostel-server-two.vercel.app/meals/${id}`)
                ));
                const mealsMap = {};
                mealRes.forEach(res => {
                    if (res.data?._id) {
                        mealsMap[res.data._id] = res.data;
                    }
                });

                // Merge reviews with meal data
                const enrichedReviews = reviewData.map(review => {
                    const meal = mealsMap[review.mealId] || {};
                    return {
                        ...review,
                        mealTitle: meal.title || 'Unknown',
                        likes: meal.likes?.length || 0,
                        reviewsCount: meal.reviews_count || 0,
                        mealId: meal._id || review.mealId,
                    };
                });

                setReviews(enrichedReviews);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
            setLoading(false);
        };

        fetchReviewsWithMealData();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this review?');
        if (!confirm) return;

        try {
            await axios.delete(`https://hostel-server-two.vercel.app/reviews/${id}`);
            setReviews(prev => prev.filter(review => review._id !== id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Meal Title</th>
                            <th>Comment</th>
                            <th>Likes</th>
                            <th>Reviews Count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        ) : reviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">No reviews found.</td>
                            </tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review._id}>
                                    <td>{review.mealTitle}</td>
                                    <td className="max-w-xs truncate">{review.content}</td>
                                    <td>{review.likes}</td>
                                    <td>{review.reviewsCount}</td>
                                    <td className="flex gap-2">
                                        <Link to={`/admin/mealdetails/${review.mealId}`}>
                                            <button className="btn btn-primary btn-xs">View Meal</button>
                                        </Link>
                                        <button
                                            className="btn btn-error btn-xs"
                                            onClick={() => handleDelete(review._id)}
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
        </div>
    );
};

export default AllReviews;