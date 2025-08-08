import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import useAuth from '../Hooks/useAuth';
import GoogleLogin from './GoogleLogin';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import useAxios from '../Axios/UseAxios';

const SignUp = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const { createUser, updateUserProfile } = useAuth();
    const axiosInstance = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const [profilePic, setProfilePic] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const password = watch('password') || '';

    const validations = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[\W_]/.test(password),
    };

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(async () => {
                const userInfo = {
                    name: data.name,
                    email: data.email,
                    photo: profilePic,
                    role: 'user',
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                };

                await axiosInstance.post('/users', userInfo);

                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                };

                updateUserProfile(userProfile)
                    .then(() => {
                        navigate(from);
                    })
                    .catch(error => {
                        console.log("Profile update error:", error);
                    });
            })
            .catch(error => {
                console.error("Signup error:", error);
            });
    };

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        const res = await axios.post(uploadUrl, formData);
        setProfilePic(res.data.data.url);
    };

    return (
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl rounded-3xl mx-auto my-6">
            <div className="card-body">
                <h1 className="text-3xl font-bold text-center">Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">

                    {/* Name */}
                    <div>
                        <label className="label">Your Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Your Name"
                        />
                        {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                    </div>

                    {/* Profile Picture (Upload only, no preview) */}
                    <div>
                        <label className="label">Profile Picture</label>
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: true,
                                    minLength: 8,
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                        message: 'Password must meet all criteria'
                                    }
                                })}
                                className="input input-bordered w-full pr-10"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-xl text-gray-500"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>
                        {errors.password?.type === 'required' && (
                            <p className="text-red-500 text-sm">Password is required</p>
                        )}
                        {errors.password?.type === 'minLength' && (
                            <p className="text-red-500 text-sm">Password must be at least 8 characters</p>
                        )}
                        {errors.password?.message && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Password Criteria */}
                    {password && (
                        <ul className="text-xs text-gray-600 ml-1 mt-1 space-y-1">
                            <li className={validations.length ? 'text-green-600' : 'text-red-500'}>
                                {validations.length ? '✅' : '❌'} At least 8 characters
                            </li>
                            <li className={validations.upper ? 'text-green-600' : 'text-red-500'}>
                                {validations.upper ? '✅' : '❌'} At least one uppercase letter
                            </li>
                            <li className={validations.lower ? 'text-green-600' : 'text-red-500'}>
                                {validations.lower ? '✅' : '❌'} At least one lowercase letter
                            </li>
                            <li className={validations.number ? 'text-green-600' : 'text-red-500'}>
                                {validations.number ? '✅' : '❌'} At least one number
                            </li>
                            <li className={validations.special ? 'text-green-600' : 'text-red-500'}>
                                {validations.special ? '✅' : '❌'} At least one special character
                            </li>
                        </ul>
                    )}

                    {/* Submit */}
                    <button className="btn btn-primary w-full mt-3">Sign Up</button>

                    {/* Login Redirect */}
                    <p className="text-sm text-center mt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
                <GoogleLogin />
            </div>
        </div>
    );
};

export default SignUp;