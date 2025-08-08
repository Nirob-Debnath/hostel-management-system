import React from 'react';
import Banner from './Banner';
import Membership from './Membership';
import MealsByCategory from './MealsByCategory';
import Facilities from './Facilities';
import ReviewSection from './ReviewSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <MealsByCategory></MealsByCategory>
            <Facilities></Facilities>
            <Membership></Membership>
            <ReviewSection></ReviewSection>
        </div>
    );
};

export default Home;