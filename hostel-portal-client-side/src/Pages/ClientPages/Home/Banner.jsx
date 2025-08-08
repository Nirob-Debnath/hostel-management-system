import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
    return (
        <div className="flex justify-center items-center w-full py-4 bg-gray-100">
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-lg">
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
        </div>
    );
};

export default Banner;