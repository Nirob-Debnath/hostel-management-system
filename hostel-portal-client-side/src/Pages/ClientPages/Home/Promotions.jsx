import React from 'react';

const Promotions = () => (
  <section className="py-12 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0 bg-gradient-to-r from-yellow-100 to-orange-100 w-full max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Sales Promotion</h2>
    <div className="flex flex-col items-center justify-center">
      <div className="card bg-base-100 shadow-xl p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">Get 20% Off on Platinum Membership!</h3>
        <p className="mb-4">Limited time offer for new members. Upgrade now and enjoy exclusive benefits.</p>
        <button className="btn btn-primary">Upgrade Now</button>
      </div>
    </div>
  </section>
);

export default Promotions;
