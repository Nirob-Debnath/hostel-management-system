import React from 'react';
import Banner from './Banner';
import Membership from './Membership';
import MealsByCategory from './MealsByCategory';
import Facilities from './Facilities';
import ReviewSection from './ReviewSection';
import FeaturedMeals from './FeaturedMeals';
import RecentMeals from './RecentMeals';
import Promotions from './Promotions';
import Newsletter from './Newsletter';
import AboutUs from './AboutUs';
import Contact from './Contact';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div>
            <Banner />
            <FeaturedMeals />
            <RecentMeals />
            <MealsByCategory />
            <Facilities />
            <Membership />
            <Promotions />
            <ReviewSection />
            <AboutUs />
            <Contact />
            <FAQ />
            <Newsletter />
        </div>
    );
};

export default Home;