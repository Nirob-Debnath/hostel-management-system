import React from 'react';

const RecentMeals = () => (
  <section className="py-12 px-4 bg-gray-50">
    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Recent Meals</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Add recent meal cards here */}
      <div className="card bg-base-100 shadow-xl">
        <figure>
          <img src="https://i.ibb.co/cKLG51wK/Banner-02.jpg" alt="Recent Meal" className="h-48 w-full object-cover" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Vegetable Biryani</h2>
          <p>Fresh vegetable biryani with raita and salad.</p>
          <button className="btn btn-primary">See More</button>
        </div>
      </div>
      {/* Repeat for more cards */}
    </div>
  </section>
);

export default RecentMeals;
