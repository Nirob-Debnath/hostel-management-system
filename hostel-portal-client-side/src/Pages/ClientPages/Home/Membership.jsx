import React from 'react';
import { useNavigate } from 'react-router';

const packages = [
    {
        name: 'Silver',
        price: 10,
        benefits: [
            'Basic Badge',
            'Access to Upcoming Meals',
            '1 Monthly Meal Vote',
            'Limited Support',
            'Email Notifications',
            'Profile Highlight',
        ],
        color: 'border-gray-300',
        bg: 'bg-slate-50'
    },
    {
        name: 'Gold',
        price: 20,
        benefits: [
            'Gold Badge',
            'Priority Meals',
            '3 Monthly Meal Votes',
            'Faster Support',
            'Exclusive Recipes',
            'Meal Feedback Privilege',
            'Early Access to Features',
        ],
        color: 'border-yellow-400',
        bg: 'bg-yellow-50'
    },
    {
        name: 'Platinum',
        price: 30,
        benefits: [
            'Platinum Badge',
            'All Perks',
            'Unlimited Meal Votes',
            '24/7 Premium Support',
            'Custom Meal Request',
            'Beta Feature Access',
            'VIP Profile Badge',
        ],
        color: 'border-purple-500',
        bg: 'bg-purple-50'
    },
];

const Membership = () => {
    const navigate = useNavigate();

    return (
        <div className="py-12 px-4 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-slate-100 to-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-800">Membership</h1>

            <div className="flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
                {packages.map(pkg => (
                    <div
                        key={pkg.name}
                        className={`card w-full sm:w-[360px] md:w-[400px] lg:w-[390px] h-[520px] p-6 rounded-2xl shadow-md border-t-4 ${pkg.color} ${pkg.bg} hover:shadow-xl transition duration-300 flex flex-col justify-between`}
                    >
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800">{pkg.name}</h2>
                            <p className="text-xl md:text-2xl text-center text-green-600 mt-2">${pkg.price}/mo</p>
                            <ul className="mt-4 text-sm md:text-base text-gray-700 list-disc list-inside space-y-1">
                                {pkg.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => navigate(`/checkout/${pkg.name.toLowerCase()}`)}
                            className="btn btn-primary mt-6 w-full py-2 rounded-md font-semibold"
                        >
                            Upgrade to {pkg.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Membership;