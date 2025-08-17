import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Axios/useAxiosSecure';


const CheckoutForm = ({ packageDetails }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!stripe || !elements || !packageDetails?.clientSecret) {
            setError('Stripe is not ready or client secret is missing.');
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            setError('Card element not found.');
            return;
        }

        setProcessing(true);

        try {
            const { error: cardError } = await stripe.createPaymentMethod({
                type: 'card',
                card,
                billing_details: {
                    name: user?.displayName || 'Anonymous',
                    email: user?.email || 'NoEmail',
                },
            });

            if (cardError) {
                setError(cardError.message);
                setProcessing(false);
                return;
            }

            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                packageDetails.clientSecret,
                {
                    payment_method: {
                        card,
                        billing_details: {
                            name: user?.displayName || 'Anonymous',
                            email: user?.email || 'NoEmail',
                        },
                    },
                }
            );

            if (confirmError) {
                setError(confirmError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                const paymentData = {
                    email: user?.email,
                    packageName: packageDetails.name,
                    price: packageDetails.price,
                    transactionId: paymentIntent.id,
                };

                const res = await axiosSecure.post('/api/payment/save-payment', paymentData);

                if (res?.data?.success || res.status === 200) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        html: `<strong>Transaction ID:</strong> <code>${paymentIntent.id}</code>`,
                        confirmButtonText: 'Go to Dashboard',
                    });
                    navigate('/');
                } else {
                    setError('Payment succeeded, but saving failed.');
                }
            } else {
                setError('Payment failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
            >
                <CardElement className="p-2 border rounded" />
                <button
                    type="submit"
                    className={`btn btn-primary w-full ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!stripe || processing}
                >
                    {processing ? 'Processing...' : `Pay $${packageDetails.price}`}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
        </div>
    );
};

export default CheckoutForm;