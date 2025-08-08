# 🏫 Hostel Management System (MERN Stack)

This project is a **Hostel Management System** developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It is designed to simplify hostel operations for universities, enabling seamless **meal management**, **student authentication**, and **food review handling** by both students and administrators.

**Live Site:** [https://hostel-portal-nirob.netlify.app/]
**Server Site:** [https://hostel-server-nirob-debnaths-projects.vercel.app/]

## 🚀 Features

- 🔐 **Student & Admin Authentication** with persistent login and protected routes
- 🍱 **Meal Management System** - categorized meals (Breakfast, Lunch, Dinner)
- ✍️ **Meal Reviews & Ratings** with edit and delete functionality
- 📦 **Premium Membership Packages** - Silver, Gold, and Platinum with Stripe payments
- 📆 **Upcoming Meals Section** for exclusive premium access and early reactions
- 📊 **Powerful Admin Dashboard** to manage users, meals, reviews, requests, and more
- 📜 **Smart Filtering** - server-side search, category, price range & infinite scroll
- ⚙️ **Role-Based Access Control** - differentiated views for users and admins
- 📁 **Image Upload Support** using ImageBB API for meal images
- 🎉 **Sweet Alerts & Toasts** for all actions (CRUD, Auth, Payment, etc.)
- 📱 **Fully Responsive Design** - seamless across mobile, tablet, and desktop

---

## 📁 Pages & Routes Overview

### 🔸 Public Pages:
- `/` Home
- `/meals` All Meals
- `/upcoming` Upcoming Meals
- `/meal/:id` Meal Details
- `/checkout/:package` Membership Purchase
- `/join` Login/Register

### 🔒 Private User Dashboard:
- `/dashboard/profile` My Profile
- `/dashboard/requested-meals` My Requested Meals
- `/dashboard/reviews` My Reviews
- `/dashboard/payments` My Payment History

### 🔐 Admin Dashboard:
- `/dashboard/admin/profile` Admin Profile
- `/dashboard/admin/users` Manage Users
- `/dashboard/admin/add-meal` Add New Meal
- `/dashboard/admin/meals` All Meals
- `/dashboard/admin/reviews` All Reviews
- `/dashboard/admin/serve` Serve Meals
- `/dashboard/admin/upcoming` Manage Upcoming Meals

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Hook Form, TanStack Query, SweetAlert2
- **Backend:** Express.js, Node.js, MongoDB (native driver)
- **Authentication:** Firebase Auth (with JWT support)
- **Payments:** Stripe Integration
- **Image Hosting:** ImageBB API
- **State Management:** Context API
- **Environment:** .env for secure credentials (both client & server)

---

## ✅ Key Functionalities

- Persistent login with token-based authentication
- Like, request, and review meals (only after login)
- Filter meals by category and price
- Add, publish, and schedule meals (admin only)
- Premium packages unlock exclusive features
- Review moderation and deletion (admin & user controlled)
- Email search for user management and meal serving