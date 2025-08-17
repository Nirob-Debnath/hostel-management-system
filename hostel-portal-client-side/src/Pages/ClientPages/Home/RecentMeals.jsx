
import React, { useEffect, useState } from 'react';
import MealCard from './MealCard';
import axios from 'axios';

const RecentMeals = () => {
  const [meals, setMeals] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://hostel-server-two.vercel.app/meals', {
          params: {
            sort: 'recent', // assuming API supports sorting
            limit: 30,
          },
        });
        setMeals(res.data.meals?.slice(0, 30) || []);
      } catch (err) {
        console.error('Failed to fetch recent meals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentMeals();
  }, []);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Recent Meals</h2>
      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {meals.slice(0, visibleCount).map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
          {visibleCount < meals.length && (
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

export default RecentMeals;
