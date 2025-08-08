import React from 'react';
import { NavLink, Outlet, Link } from 'react-router';
import MyProfile from '../Pages/DashboardPages/MyProfile';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                <div className="navbar bg-base-300 w-full">
                    <div className="flex-none">
                        <Link to="/" className="btn btn-square btn-ghost mr-2" title="Back to Home">
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
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>

                        <label
                            htmlFor="my-drawer-2"
                            className="btn btn-square btn-ghost lg:hidden"
                            title="Open Menu"
                        >
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

                <div className="flex justify-center mt-4">
                    <MyProfile />
                </div>

                <div className="p-4">
                    <Outlet />
                </div>
            </div>

            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 font-semibold space-y-2">
                    <li>
                        <NavLink to="/dashboard/requestedmeals" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Requested Meals
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/myreviews" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            My Reviews
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/paymenthistory" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                            Payment History
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;