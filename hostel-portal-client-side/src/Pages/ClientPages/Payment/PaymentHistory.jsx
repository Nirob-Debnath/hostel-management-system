import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Axios/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.email) {
            setLoading(false);
            setPayments([]);
            return;
        }

        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await axiosSecure.get(`/api/payment/history?email=${user.email}`);
                setPayments(response.data || []);
                setError('');
            } catch (err) {
                console.error('Failed to fetch payment history:', err);
                setError('Failed to load payment history.');
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user?.email, axiosSecure]);

    if (loading) return <p>Loading payment history...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (payments.length === 0) return <p>No payment history found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Transaction ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Package Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(({ transactionId, packageName, price, date }) => (
                        <tr key={transactionId} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{transactionId}</td>
                            <td className="border border-gray-300 px-4 py-2">{packageName}</td>
                            <td className="border border-gray-300 px-4 py-2">${price.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2">{new Date(date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;