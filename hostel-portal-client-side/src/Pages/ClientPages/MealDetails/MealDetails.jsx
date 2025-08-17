import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth';
import toast from 'react-hot-toast';

const MealDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [meal, setMeal] = useState(null);
    const [liked, setLiked] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const res = await axios.get(`https://hostel-server-two.vercel.app/meals/${id}`);
                setMeal(res.data);
                setLiked(res.data.likes?.includes(user?._id));
            } catch (err) {
                toast.error('Failed to load meal',err);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await axios.get(`https://hostel-server-two.vercel.app/meals/${id}/reviews`);
                setReviews(res.data);
            } catch (err) {
                toast.error('Failed to load reviews',err);
            }
        };

        if (id) {
            fetchMeal();
            fetchReviews();
        }
    }, [id, user?._id]);

    const refreshReviews = async () => {
        try {
            const res = await axios.get(`https://hostel-server-two.vercel.app/meals/${id}/reviews`);
            setReviews(res.data);
        } catch {
            toast.error('Failed to refresh reviews');
        }
    };

    const handleLike = async () => {
        if (!user) return toast.error('Login to like meals');
        setLikeLoading(true);
        try {
            const res = await axios.patch(`https://hostel-server-two.vercel.app/meals/${id}/like`, {
                userId: user._id,
            });

            setLiked(prev => !prev);
            setMeal(prev => ({
                ...prev,
                likes: res.data.likes
            }));
        } catch {
            toast.error('Failed to update like');
        } finally {
            setLikeLoading(false);
        }
    };

    const handleMealRequest = async () => {
        if (!user) return toast.error('Login to request meals');
        setRequestLoading(true);
        try {
            const res = await axios.get(`https://hostel-server-two.vercel.app/api/payment/history?email=${user.email}`);
            const history = res.data;

            if (!history || history.length === 0) {
                return toast.error('You need an active subscription to request meals');
            }

            const latestPayment = history[0];
            const packageName = latestPayment.packageName;

            const requestData = {
                userId: user._id,
                userEmail: user.email,
                userName: user.displayName,
                mealId: meal._id,
                mealTitle: meal.title,
                packageName,
                status: 'pending',
            };

            await axios.post('https://hostel-server-two.vercel.app/requests', requestData);
            toast.success('Meal request submitted');
        } catch {
            toast.error('Failed to request meal');
        } finally {
            setRequestLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Login to leave a review');
        if (!newReview.trim()) return;

        setReviewLoading(true);
        try {
            await axios.post(`https://hostel-server-two.vercel.app/meals/${id}/reviews`, {
                userId: user._id,
                userName: user.displayName,
                content: newReview,
            });
            setNewReview('');
            refreshReviews();
        } catch {
            toast.error('Failed to post review');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const confirm = window.confirm('Are you sure you want to delete this comment?');
        if (!confirm) return;

        try {
            await axios.delete(`https://hostel-server-two.vercel.app/reviews/${reviewId}`);
            toast.success('Review deleted');
            refreshReviews();
        } catch {
            toast.error('Failed to delete review');
        }
    };

    const handleEditReview = async (reviewId) => {
        if (!editingContent.trim()) return;
        try {
            await axios.put(`https://hostel-server-two.vercel.app/reviews/${reviewId}`, {
                content: editingContent,
            });
            toast.success('Review updated');
            setEditingReviewId(null);
            refreshReviews();
        } catch {
            toast.error('Failed to update review');
        }
    };

    if (loading || !meal) {
        return <p className="text-center mt-10">Loading meal details...</p>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0 py-4">
            <div className="bg-base-100 shadow-xl rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left - Image */}
                <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-56 sm:h-64 md:h-80 object-cover rounded-xl"
                />

                {/* Right - Info */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold">{meal.title}</h2>
                    <p><strong>Ingredients:</strong> {meal.ingredients}</p>
                    <p><strong>Description:</strong> {meal.description}</p>
                    <p><strong>Category:</strong> {meal.category}</p>
                    <p><strong>Price:</strong> {meal.price} Tk.</p>
                    <p><strong>Likes:</strong> {meal.likes?.length || 0}</p>
                    <p><strong>Distributor:</strong> {meal.distributorName}</p>
                    <p><strong>Posted:</strong> {new Date(meal.postTime).toLocaleString()}</p>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <button
                            onClick={handleLike}
                            disabled={likeLoading}
                            className={`btn ${liked ? 'btn-error' : 'btn-outline'}`}
                        >
                            {liked ? 'Unlike' : 'Like'}
                        </button>

                        <button
                            onClick={handleMealRequest}
                            disabled={requestLoading}
                            className="btn btn-success"
                        >
                            {requestLoading ? 'Requesting...' : 'Request Meal'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Reviews ({reviews.length})</h3>

                <form onSubmit={handleReviewSubmit} className="mb-4 space-y-2">
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Write your review..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>

                <div className="space-y-3">
                    {reviews.map((review) => (
                        <div key={review._id} className="border p-3 rounded">
                            <p className="text-sm text-gray-600">
                                {review.userName} • {new Date(review.time).toLocaleString()}
                            </p>

                            {editingReviewId === review._id ? (
                                <>
                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button className="btn btn-success btn-sm" onClick={() => handleEditReview(review._id)}>
                                            Save
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingReviewId(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{review.content}</p>
                                    {user && review.userId === user._id && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => {
                                                    setEditingReviewId(review._id);
                                                    setEditingContent(review.content);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => handleDeleteReview(review._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealDetails;