import React, { useEffect, useState, useCallback } from "react";
import MealCard from "./MealCard";
import axios from "axios";

const MealsByCategory = () => {
    const [meals, setMeals] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleRows, setVisibleRows] = useState(2); // 2 rows initially
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const limit = 6;

    const fetchMeals = useCallback(
        async (pageNumber = 1, isNewSearch = false) => {
            try {
                setLoading(true);
                const res = await axios.get('https://hostel-server-two.vercel.app/meals', {
                    params: {
                        category: selectedCategory,
                        page: pageNumber,
                        limit,
                    },
                });
                const newMeals = res.data.meals || [];
                setMeals((prev) => (isNewSearch ? newMeals : [...prev, ...newMeals]));
                setHasMore(newMeals.length === limit);
            } catch (err) {
                console.error('Error fetching meals:', err);
            } finally {
                setLoading(false);
            }
        },
        [selectedCategory]
    );

    useEffect(() => {
        setPage(1);
        fetchMeals(1, true);
    }, [fetchMeals]);

    const fetchMoreMeals = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMeals(nextPage);
    };

    const handleSeeMore = () => {
        fetchMoreMeals();
    };

    const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];
    const cardsPerRow = 6;
    const visibleCount = visibleRows * cardsPerRow;
    const displayedMeals = meals.slice(0, visibleCount);

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
                            setVisibleRows(2); // Reset rows on category change
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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