
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MealCard from './MealCard';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FeaturedMeals = () => {
  const [meals, setMeals] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // 2 rows initially
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://hostel-server-two.vercel.app/meals', {
          params: {
            sort: 'price', // assuming API supports sorting by price
            order: 'asc',
            limit: 30,
          },
        });
        setMeals(res.data.meals?.slice(0, 30) || []);
      } catch (err) {
        console.error('Failed to fetch featured meals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedMeals();
  }, []);

  // Filter meals by selected category
  const filteredMeals = selectedCategory === 'All'
    ? meals
    : meals.filter(meal => meal.category === selectedCategory);

  const cardsPerRow = 6;
  const visibleCount = visibleRows * cardsPerRow;

  const handleSeeMore = () => {
    setVisibleRows(prev => prev + 1);
  };

  return (
  <section className="py-12 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0 bg-white w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Featured Meals</h2>
      {/* Category Tabs */}
      <div role="tablist" className="tabs tabs-boxed justify-center mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            onClick={() => {
              setSelectedCategory(cat);
              setVisibleRows(2); // Reset rows on category change
            }}
            className={`tab ${selectedCategory === cat ? 'tab-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredMeals.slice(0, visibleCount).map(meal => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
          {visibleCount < filteredMeals.length && (
            <div className="flex justify-center mt-6">
              <button onClick={handleSeeMore} className="btn btn-primary">
                See More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FeaturedMeals;
