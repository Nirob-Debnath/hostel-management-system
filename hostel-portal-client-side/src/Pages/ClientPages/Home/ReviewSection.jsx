import React from 'react';
import { FaStar } from 'react-icons/fa';

const reviews = [
    {
        name: 'Hasan Mahmud',
        text: 'Hostel ta khub porishkar. Staff ra onek helpful. Jotil experience!',
        rating: 5,
    },
    {
        name: 'Sanjib Mahmud',
        text: 'Wi-Fi ta fast and kitchen facility excellent.',
        rating: 4,
    },
    {
        name: 'Sabbir Hossain',
        text: 'Bujhte parini hostel eto comfortable hobe, kono issue hoyni.',
        rating: 5,
    },
    {
        name: 'Abu Noyon',
        text: 'Lockers, laundry, sob facility free te peyechi. Dhonnobad!',
        rating: 4,
    },
    {
        name: 'Nayeem Rahman',
        text: '24/7 reception onek helpful chhilo. Amar check-in raat 12tay hoyechilo!',
        rating: 5,
    },
];

const ReviewCard = ({ review }) => (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-100">
        <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg text-gray-800">{review.name}</h4>
            <div className="flex text-yellow-500">
                {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} size={16} />
                ))}
            </div>
        </div>
        <p className="text-gray-600 text-sm">{review.text}</p>
    </div>
);

const ReviewSection = () => {
    return (
        <section className="py-16 px-4 bg-gray-50">
            <h2 className="text-4xl font-bold text-center text-orange-500 italic mb-4">
                Student's Feedback
            </h2>
            <p className="text-center text-gray-600 mb-10 uppercase tracking-wider">
                Bangladeshi Students Sharing Their Experience
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))}
            </div>
        </section>
    );
};

export default ReviewSection;