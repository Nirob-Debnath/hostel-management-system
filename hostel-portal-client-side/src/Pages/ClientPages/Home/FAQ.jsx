import React from 'react';

const FAQ = () => (
  <section className="py-12 px-4 bg-gray-50">
    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Frequently Asked Questions</h2>
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <h3 className="font-semibold">How do I become a member?</h3>
        <p>Simply sign up and choose your preferred membership package.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Are meals included in the membership?</h3>
        <p>Yes, depending on your package, you get access to daily meals and special offers.</p>
      </div>
      {/* Add more FAQs as needed */}
    </div>
  </section>
);

export default FAQ;
