import React from "react";
import { useNavigate } from "react-router";

const MealCard = ({ meal }) => {
    const navigate = useNavigate();
    const { _id, title, image, rating, price } = meal;

    return (
        <div className="card bg-base-100 shadow-xl w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <figure>
                <img src={image} alt={title} className="h-40 sm:h-48 w-full object-cover rounded-t-xl" />
            </figure>
            <div className="card-body p-4 sm:p-6">
                <h2 className="card-title text-base sm:text-lg md:text-xl">{title}</h2>
                <p className="text-sm sm:text-base">⭐ {rating} / 5</p>
                <p className="font-semibold text-lg">৳ {price}</p>
                <div className="card-actions justify-end">
                    <button
                        onClick={() => navigate(`/mealdetails/${_id}`)}
                        className="btn btn-primary"
                    >
                       View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealCard;