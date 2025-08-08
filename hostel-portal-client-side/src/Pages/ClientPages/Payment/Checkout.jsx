import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import useAxiosSecure from '../../../Axios/useAxiosSecure';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

const Checkout = () => {
    const { packageName } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const [packageDetails, setPackageDetails] = useState({});
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const res = await axiosSecure.post('/api/payment/create-payment-intent', { packageName });
                setClientSecret(res.data.clientSecret);
                setPackageDetails(res.data.package);
            } catch (error) {
                console.error('Error creating payment intent:', error);
            }
        };

        if (packageName) {
            fetchPaymentIntent();
        }
    }, [packageName, axiosSecure]);

    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Checkout - {packageDetails.name || packageName}</h2>
            {clientSecret && (
                <Elements stripe={stripePromise}>
                    <CheckoutForm packageDetails={{ ...packageDetails, clientSecret }} />
                </Elements>
            )}
        </div>
    );
};

export default Checkout;