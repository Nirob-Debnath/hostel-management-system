import React from 'react';

const FeaturedMeals = () => (
  <section className="py-12 px-4 bg-white">
    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Featured Meals</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Add featured meal cards here */}
      <div className="card bg-base-100 shadow-xl">
        <figure>
          <img src="https://i.ibb.co/ymzHQv1d/Banner-01.jpg" alt="Featured Meal" className="h-48 w-full object-cover" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Special Chicken Curry</h2>
          <p>Delicious chicken curry served with rice and salad.</p>
          <button className="btn btn-primary">See More</button>
        </div>
      </div>
      {/* Repeat for more cards */}
    </div>
  </section>
);

export default FeaturedMeals;
