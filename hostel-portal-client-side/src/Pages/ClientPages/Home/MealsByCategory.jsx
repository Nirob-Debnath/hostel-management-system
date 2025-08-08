import React, { useEffect, useState } from "react";
import MealCard from "./MealCard";
import axios from "axios";

const MealsByCategory = () => {
    const [meals, setMeals] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(6);
    const [loading, setLoading] = useState(false);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://hostel-server-two.vercel.app/meals");
            setMeals(res.data.meals || []);
        } catch (err) {
            console.error("Failed to fetch meals:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    const filterMeals = (category) => {
        if (category === "All") return meals;
        return meals.filter((meal) => meal.category === category);
    };

    const handleSeeMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const categories = ["All", "Breakfast", "Lunch", "Dinner"];
    const mealsToDisplay = filterMeals(selectedCategory);
    const displayedMeals = mealsToDisplay.slice(0, visibleCount);
    const hasMore = visibleCount < mealsToDisplay.length;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Meals by Category</h1>

            {/* Category Tabs */}
            <div role="tablist" className="tabs tabs-boxed justify-center mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        role="tab"
                        onClick={() => {
                            setSelectedCategory(cat);
                            setVisibleCount(6); // Reset on category change
                        }}
                        className={`tab ${selectedCategory === cat ? "tab-active" : ""}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="text-center py-10">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : (
                <>
                    {/* Meals Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedMeals.map((meal) => (
                            <MealCard key={meal._id} meal={meal} />
                        ))}
                    </div>

                    {/* See More Button */}
                    {hasMore && (
                        <div className="flex justify-center mt-6">
                            <button onClick={handleSeeMore} className="btn btn-primary">
                                See More
                            </button>
                        </div>
                    )}

                    {/* No results */}
                    {!loading && displayedMeals.length === 0 && (
                        <div className="text-center text-gray-500 py-6">
                            No meals found in this category.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MealsByCategory;