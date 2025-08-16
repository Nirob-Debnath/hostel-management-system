import React from 'react';
import Banner from './Banner';
import Membership from './Membership';
import MealsByCategory from './MealsByCategory';
import Facilities from './Facilities';
import ReviewSection from './ReviewSection';

const Home = () => {
    return (
        <div>
            <Banner />
            <MealsByCategory />
            <Facilities />
            <Membership />
            <ReviewSection />
        </div>
    );
};

export default Home;