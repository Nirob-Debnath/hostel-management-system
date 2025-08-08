import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const AdminProfile = () => {
    const { user } = useAuth();
    const [mealCount, setMealCount] = useState(0);

    useEffect(() => {
        if (user?.email) {
            axios
                .get(`https://hostel-server-two.vercel.app/api/meals/count?email=${user.email}`)
                .then((res) => {
                    setMealCount(res.data.count);
                })
                .catch((err) => {
                    console.error("Failed to fetch meal count", err);
                });
        }
    }, [user]);

    if (!user) {
        return <div className="text-center mt-10 text-lg font-medium">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Admin Profile</h2>

            <div className="flex flex-col items-center">
                <img
                    src={user.photoURL || "https://i.ibb.co/2d8XxV4/avatar.png"}
                    alt="Admin"
                    className="w-32 h-32 rounded-full mb-4 border-4 border-primary"
                />

                <div className="text-center space-y-2">
                    <p className="text-lg">
                        <span className="font-semibold">Name:</span> {user.displayName || "N/A"}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Meals Added:</span> {mealCount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;