import React from 'react';
import { NavLink, Outlet } from 'react-router';

const AdminLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                {/* Navbar (for mobile) */}
                <div className="navbar bg-base-300 w-full lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1 text-xl font-bold pl-2">Dashboard</div>
                </div>

                {/* Page content */}
                <div className="p-4">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 font-semibold space-y-2">
                    <li>
                        <NavLink to="/admin/adminprofile" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Admin Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manageusers" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Manage Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/addmeal" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Add Meal
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/allmeals" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            All Meals
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/allreviews" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            All Reviews
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/servemeals" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Serve Meals
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/upcomingmealsadmin" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Upcoming Meals
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminLayout;
