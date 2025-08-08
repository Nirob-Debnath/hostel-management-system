import React from "react";

const UpcomingMealsCard = ({ upcomingmeal, onLike }) => {
    const { title, image, rating, price, likes = [] } = upcomingmeal;

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
                        onClick={onLike}
                        className="btn btn-outline btn-error"
                        title="Like this meal"
                    >
                        ❤️ {likes.length}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingMealsCard;