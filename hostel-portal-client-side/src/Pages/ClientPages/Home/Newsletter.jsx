import React from 'react';

const Newsletter = () => (
  <section className="py-12 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0 bg-white w-full max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Newsletter</h2>
    <div className="flex flex-col items-center justify-center">
      <form className="w-full max-w-md px-2">
        <input type="email" placeholder="Enter your email" className="input input-bordered w-full mb-4" />
        <button className="btn btn-primary w-full">Subscribe</button>
      </form>
    </div>
  </section>
);

export default Newsletter;
