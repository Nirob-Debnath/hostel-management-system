import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';

const UpcomingMealsButton = ({ onSuccess }) => {
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const { user } = useAuth();

    const distributorName = user?.displayName || '';
    const distributorEmail = user?.email || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        if (!imageFile) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const apiKey = import.meta.env.VITE_image_upload_key;
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
            setImageUrl(res.data.data.url);
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!imageUrl) {
            alert('Please upload an image.');
            return;
        }

        const meal = {
            title: data.title,
            category: data.category,
            image: imageUrl,
            ingredients: data.ingredients,
            description: data.description,
            price: parseFloat(data.price),
            publishDate: new Date(data.publishDate),
            distributorName,
            distributorEmail,
            rating: 0,
            likes: [],
            reviews_count: 0
        };

        try {
            await axios.post('https://hostel-server-two.vercel.app/upcoming', meal);
            alert('✅ Upcoming meal added!');
            reset();
            setImageUrl('');
            setShowModal(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Failed to add meal:', err);
            alert('❌ Failed to add meal.');
        }
    };

    return (
        <>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Add Upcoming Meal
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-2 btn btn-sm btn-circle"
                            onClick={() => setShowModal(false)}
                        >✕</button>

                        <h2 className="text-xl font-bold mb-4">Add Upcoming Meal</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Title */}
                            <input
                                type="text"
                                {...register('title', { required: 'Title is required' })}
                                className="input input-bordered w-full"
                                placeholder="Title"
                            />
                            {errors.title && <p className="text-red-600">{errors.title.message}</p>}

                            {/* Image Upload */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input file-input-bordered w-full"
                            />
                            {uploading && <p className="text-blue-600">Uploading image...</p>}
                            {imageUrl && (
                                <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />
                            )}

                            {/* Category */}
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Category</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                            {errors.category && <p className="text-red-600">{errors.category.message}</p>}

                            {/* Ingredients */}
                            <textarea
                                {...register('ingredients', { required: 'Ingredients are required' })}
                                className="textarea textarea-bordered w-full"
                                placeholder="Ingredients"
                            />
                            {errors.ingredients && <p className="text-red-600">{errors.ingredients.message}</p>}

                            {/* Description */}
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                className="textarea textarea-bordered w-full"
                                placeholder="Description"
                            />
                            {errors.description && <p className="text-red-600">{errors.description.message}</p>}

                            {/* Price */}
                            <input
                                type="number"
                                step="0.01"
                                {...register('price', { required: 'Price is required' })}
                                className="input input-bordered w-full"
                                placeholder="Price (Tk)"
                            />
                            {errors.price && <p className="text-red-600">{errors.price.message}</p>}

                            {/* Publish Date */}
                            <input
                                type="datetime-local"
                                {...register('publishDate', { required: 'Publish date is required' })}
                                className="input input-bordered w-full"
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            {errors.publishDate && <p className="text-red-600">{errors.publishDate.message}</p>}

                            {/* Distributor Name */}
                            <input
                                type="text"
                                value={distributorName}
                                readOnly
                                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                            />

                            {/* Distributor Email */}
                            <input
                                type="email"
                                value={distributorEmail}
                                readOnly
                                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={uploading}
                            >
                                Add Upcoming Meal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpcomingMealsButton;