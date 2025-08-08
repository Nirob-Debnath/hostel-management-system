import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Axios/useAxiosSecure';

const MyProfile = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [latestPackage, setLatestPackage] = useState(null);
    const [paymentsLoading, setPaymentsLoading] = useState(true);
    const [paymentsError, setPaymentsError] = useState('');

    useEffect(() => {
        if (!user?.email) {
            setPaymentsLoading(false);
            return;
        }

        const fetchPayments = async () => {
            try {
                setPaymentsLoading(true);
                const res = await axiosSecure.get(`/api/payment/history?email=${user.email}`);
                if (res.data.length > 0) {
                    setLatestPackage(res.data[0].packageName);
                } else {
                    setLatestPackage(null);
                }
                setPaymentsError('');
            } catch (err) {
                console.error('Failed to fetch payment history:', err);
                setPaymentsError('Could not load membership info');
                setLatestPackage(null);
            } finally {
                setPaymentsLoading(false);
            }
        };

        fetchPayments();
    }, [user?.email, axiosSecure]);

    if (loading || paymentsLoading) {
        return <div className="text-center mt-10">Loading profile...</div>;
    }

    if (!user) {
        return (
            <div className="text-center">
                <div className="mt-4 text-red-600 font-semibold">Please Login First</div>
                <div className="mt-2">
                    <Link to="/login" className="text-blue-600 underline m-4">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const badgeColors = {
        Bronze: 'badge badge-warning text-white',
        Silver: 'badge badge-info text-white',
        Gold: 'badge badge-accent text-white',
        Platinum: 'badge badge-primary text-white',
    };

    // If no payments, fallback to 'Bronze' or 'No membership'
    const badgeName = latestPackage || 'Bronze';
    const badgeClass = badgeColors[badgeName] || 'badge badge-secondary text-white';

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-10 text-center">
            <img
                src={user?.photoURL || 'https://i.ibb.co/ZK3ChX2/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full shadow mb-4"
            />
            <h2 className="text-xl font-semibold">{user?.displayName}</h2>
            <p className="text-gray-500 mb-4">{user?.email}</p>

            {paymentsError && <p className="text-red-600 mb-2">{paymentsError}</p>}

            <div className="mt-4">
                <span className={badgeClass} style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }}>
                    {badgeName}
                </span>
            </div>
        </div>
    );
};

export default MyProfile;