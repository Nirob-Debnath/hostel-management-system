import React from "react";
import { useNavigate } from "react-router";

const MealCard = ({ meal }) => {
    const navigate = useNavigate();
    const { _id, title, image, rating, price } = meal;

    return (
        <div className="card bg-base-100 shadow-xl">
            <figure>
                <img src={image} alt={title} className="h-48 w-full object-cover" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>⭐ {rating} / 5</p>
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