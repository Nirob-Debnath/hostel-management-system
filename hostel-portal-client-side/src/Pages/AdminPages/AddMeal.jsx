import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';

const AddMeal = () => {
    const { user } = useAuth();
    const distributorName = user?.displayName || '';
    const distributorEmail = user?.email || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

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
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!imageUrl) {
            alert('Please upload an image first.');
            return;
        }

        const meal = {
            title: data.title,
            category: data.category,
            image: imageUrl,
            ingredients: data.ingredients,
            description: data.description,
            price: parseFloat(data.price),
            postTime: data.postTime,
            distributorName,
            distributorEmail,
            rating: 0,
            likes: [],
            reviews_count: 0,
            createdAt: new Date()
        };

        try {
            await axios.post('https://hostel-server-two.vercel.app/meals', meal);
            alert('✅ Meal added successfully!');
            reset();
            setImageUrl('');
        } catch (error) {
            console.error('❌ Failed to add meal:', error);
            alert('❌ Failed to add meal. Please check console for details.');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 shadow-md rounded-md bg-white">
            <h2 className="text-2xl font-bold mb-4">Add Meal</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Title */}
                <div>
                    <label className="block font-semibold">Title</label>
                    <input
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block font-semibold">Category</label>
                    <select
                        {...register('category', { required: 'Category is required' })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                    </select>
                    {errors.category && <p className="text-red-600">{errors.category.message}</p>}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block font-semibold">Meal Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered w-full"
                    />
                    {uploading && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                    {imageUrl && (
                        <img src={imageUrl} alt="Uploaded" className="mt-2 w-32 h-32 object-cover rounded" />
                    )}
                </div>

                {/* Ingredients */}
                <div>
                    <label className="block font-semibold">Ingredients</label>
                    <textarea
                        {...register('ingredients', { required: 'Ingredients are required' })}
                        className="textarea textarea-bordered w-full"
                        placeholder="e.g. rice, chicken, onion"
                    />
                    {errors.ingredients && <p className="text-red-600">{errors.ingredients.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold">Description</label>
                    <textarea
                        {...register('description', { required: 'Description is required' })}
                        className="textarea textarea-bordered w-full"
                        placeholder="Write a short description"
                    />
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block font-semibold">Price (Tk.)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price', {
                            required: 'Price is required',
                            min: { value: 0, message: 'Must be positive' }
                        })}
                        className="input input-bordered w-full"
                    />
                    {errors.price && <p className="text-red-600">{errors.price.message}</p>}
                </div>

                {/* Post Time */}
                <div>
                    <label className="block font-semibold">Post Time</label>
                    <input
                        type="datetime-local"
                        {...register('postTime', { required: 'Post time is required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.postTime && <p className="text-red-600">{errors.postTime.message}</p>}
                </div>

                {/* Distributor Info */}
                <div>
                    <label className="block font-semibold">Distributor Name</label>
                    <input
                        type="text"
                        value={distributorName}
                        readOnly
                        className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Distributor Email</label>
                    <input
                        type="email"
                        value={distributorEmail}
                        readOnly
                        className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-full mt-4" disabled={uploading}>
                    Add Meal
                </button>
            </form>
        </div>
    );
};

export default AddMeal;