import React from 'react';

const Newsletter = () => (
  <section className="py-12 px-4 bg-white">
    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Newsletter</h2>
    <div className="flex flex-col items-center justify-center">
      <form className="w-full max-w-md">
        <input type="email" placeholder="Enter your email" className="input input-bordered w-full mb-4" />
        <button className="btn btn-primary w-full">Subscribe</button>
      </form>
    </div>
  </section>
);

export default Newsletter;
