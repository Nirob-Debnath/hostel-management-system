import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-stretch w-full py-4 bg-gray-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0">
            {/* Left: Banner Carousel */}
            <div className="w-full md:w-2/3 max-w-4xl overflow-hidden rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-6">
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={2000}
                    stopOnHover
                >
                    <div>
                        <img
                            src="https://i.ibb.co/ymzHQv1d/Banner-01.jpg"
                            alt="Banner 1"
                            className="rounded-2xl"
                        />
                    </div>
                    <div>
                        <img
                            src="https://i.ibb.co/cKLG51wK/Banner-02.jpg"
                            alt="Banner 2"
                            className="rounded-2xl"
                        />
                    </div>
                    <div>
                        <img
                            src="https://i.ibb.co/7dtgR63F/Banner-03.jpg"
                            alt="Banner 3"
                            className="rounded-2xl"
                        />
                    </div>
                </Carousel>
            </div>
            {/* Right: Two stacked sections */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 mt-4 md:mt-0">
                <div className="bg-white rounded-2xl shadow-md p-6 flex-1 flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold mb-2 text-primary">Hostel News</h3>
                    <p className="text-gray-700 text-center">Stay updated with the latest announcements and events happening in our hostel community.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 flex-1 flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold mb-2 text-primary">Special Discount</h3>
                    <p className="text-gray-700 text-center mb-2">Get up to <span className="text-green-600 font-bold">20% OFF</span> on Platinum Membership this month!</p>
                </div>
            </div>
        </div>
    );
};

export default Banner;