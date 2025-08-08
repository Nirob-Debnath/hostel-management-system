import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router';
import GoogleLogin from './GoogleLogin';
import toast from 'react-hot-toast';
import useAuth from '../Hooks/useAuth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { signInUser } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const password = watch('password') || '';
    const email = watch('email') || '';

    const validations = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[\W_]/.test(password),
    };

    const onSubmit = async (data) => {
        try {
            const result = await signInUser(data.email, data.password);
            toast.success(`Welcome, ${result.user.displayName || 'User'}!`);
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Login failed');
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error('Please enter your email first');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent');
        } catch (error) {
            toast.error(error.message || 'Failed to send reset email');
        }
    };

    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl rounded-3xl mx-auto my-4">
            <div className="card-body">
                <h2 className="text-4xl text-center font-bold mb-4">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">Email is required</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                        message:
                                            'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
                                    },
                                })}
                                className="input input-bordered w-full pr-10"
                                placeholder="Password"
                            />
                            {password.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-xl text-gray-500"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </button>
                            )}
                        </div>

                        {password && (
                            <ul className="text-sm mt-2 space-y-1">
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

                        {errors.password && (
                            <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <button
                            type="button"
                            className="text-sm text-blue-500 hover:underline"
                            onClick={handleForgotPassword}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary w-full mt-2">
                        Login
                    </button>

                    {/* Sign Up Link */}
                    <p className="mt-2 text-sm text-center">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>

                <div className="mt-4">
                    <GoogleLogin />
                </div>
            </div>
        </div>
    );
};

export default Login;