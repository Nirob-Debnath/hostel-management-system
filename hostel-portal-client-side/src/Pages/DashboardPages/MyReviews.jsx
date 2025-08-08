import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import useAuth from '../../Hooks/useAuth';

const MyReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`https://hostel-server-two.vercel.app/reviews/user/${user._id}`);
                setReviews(res.data);
            } catch (err) {
                toast.error('Failed to load your reviews', err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user._id) {
            fetchReviews();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`https://hostel-server-two.vercel.app/reviews/${id}`);
            setReviews(prev => prev.filter(r => r._id !== id));
            toast.success('Review deleted');
        } catch {
            toast.error('Failed to delete review');
        }
    };

    const handleEdit = (review) => {
        setEditingId(review._id);
        setEditedContent(review.content);
    };

    const handleSaveEdit = async () => {
        try {
            await axios.patch(`https://hostel-server-two.vercel.app/reviews/${editingId}`, {
                content: editedContent
            });
            setReviews(prev =>
                prev.map(r => r._id === editingId ? { ...r, content: editedContent } : r)
            );
            setEditingId(null);
            setEditedContent('');
            toast.success('Review updated');
        } catch {
            toast.error('Failed to update review');
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading your reviews...</p>;
    }

    return (
        <div className="p-4 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>

            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-left">
                            <th>Meal</th>
                            <th>Likes</th>
                            <th>Review</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review._id}>
                                <td>{review.mealTitle || 'Untitled'}</td>
                                <td>{review.likes || 0}</td>
                                <td>
                                    {editingId === review._id ? (
                                        <textarea
                                            className="textarea textarea-bordered w-full"
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                        />
                                    ) : (
                                        review.content
                                    )}
                                </td>
                                <td className="space-x-1">
                                    {editingId === review._id ? (
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={handleSaveEdit}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-xs btn-info"
                                            onClick={() => handleEdit(review)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDelete(review._id)}
                                    >
                                        Delete
                                    </button>
                                    <Link to={`/meals/${review.mealId}`}>
                                        <button className="btn btn-xs btn-outline">
                                            View Meal
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyReviews;