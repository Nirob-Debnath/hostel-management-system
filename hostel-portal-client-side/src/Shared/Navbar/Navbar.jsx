import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Auth/AuthContext';

const Navbar = () => {
    const { user, signOutUser } = useContext(AuthContext);

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                console.log('User signed out');
            })
            .catch(error => {
                console.error(error);
            });
    };

    const links = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/meals">Meals</NavLink></li>
            <li><NavLink to="/upcomingmeals">Upcoming Meals</NavLink></li>
            {
                user && <>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                </>
            }
        </>
    );

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const photoURL = user?.photoURL || 'https://i.ibb.co/r3G3YbJ/default-avatar.png';

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52">
                        {links}
                    </ul>
                </div>
                <NavLink to="/" className="flex items-center gap-2">
                    <img className="w-12 h-12 rounded-4xl" src="https://i.ibb.co/bM95vJnr/Hostel-Portal-Logo.jpg" alt="Logo" />
                    <button className="text-xl font-semibold">Hostel Portal</button>
                </NavLink>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">{links}</ul>
            </div>

            <div className="navbar-end gap-x-6">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>

                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={photoURL} alt="Profile" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-20 p-4 shadow bg-base-100 rounded-box w-64">
                            <div className="flex flex-col items-center gap-2">
                                <img className="w-16 h-16 rounded-full border" src={photoURL} alt="User" />
                                <h3 className="font-bold">{displayName}</h3>
                                <p className="text-sm text-gray-500 text-center">{user.email}</p>
                                <button onClick={handleSignOut} className="btn btn-sm btn-error mt-2 w-full">Log Out</button>
                            </div>
                        </ul>
                    </div>
                ) : (
                    <NavLink to="/signup" className="btn btn-primary">Join Us</NavLink>
                )}
            </div>
        </div>
    );
};

export default Navbar;