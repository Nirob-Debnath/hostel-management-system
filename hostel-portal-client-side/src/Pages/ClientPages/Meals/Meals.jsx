import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Link } from 'react-router';

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    const limit = 6;

    const fetchMeals = useCallback(
        async (pageNumber = 1, isNewSearch = false) => {
            try {
                const res = await axios.get('https://hostel-server-two.vercel.app/meals', {
                    params: {
                        search,
                        category,
                        minPrice: priceRange[0],
                        maxPrice: priceRange[1],
                        page: pageNumber,
                        limit,
                    },
                });

                const newMeals = res.data.meals || [];

                setMeals((prev) => (isNewSearch ? newMeals : [...prev, ...newMeals]));
                setHasMore(newMeals.length === limit); // if fetched less than limit, no more data
            } catch (err) {
                console.error('Error fetching meals:', err);
            }
        },
        [search, category, priceRange]
    );

    // On filters change, reset page to 1 and fetch meals anew
    useEffect(() => {
        setPage(1);
        fetchMeals(1, true);
    }, [fetchMeals]);

    // Load more meals on scroll
    const fetchMoreMeals = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMeals(nextPage);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">All Meals</h2>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full"
                />

                {/* Category */}
                <select
                    className="select select-bordered w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                </select>

                {/* Price Range */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        value={priceRange[0]}
                        onChange={(e) =>
                            setPriceRange([Math.max(0, parseFloat(e.target.value) || 0), priceRange[1]])
                        }
                        className="input input-bordered w-full"
                        placeholder="Min Price"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        min={0}
                        value={priceRange[1]}
                        onChange={(e) =>
                            setPriceRange([priceRange[0], Math.max(priceRange[0], parseFloat(e.target.value) || 0)])
                        }
                        className="input input-bordered w-full"
                        placeholder="Max Price"
                    />
                </div>
            </div>

            {/* Meals List with Infinite Scroll */}
            <InfiniteScroll
                dataLength={meals.length}
                next={fetchMoreMeals}
                hasMore={hasMore}
                loader={<p className="text-center py-4">Loading more meals...</p>}
                endMessage={
                    <p className="text-center py-4 text-gray-500">No more meals to show.</p>
                }
            >
                <div className="grid md:grid-cols-3 gap-6">
                    {meals.map((meal) => (
                        <div key={meal._id} className="card bg-base-100 shadow-md">
                            <figure>
                                <img
                                    src={meal.image}
                                    alt={meal.title}
                                    className="h-48 w-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title">{meal.title}</h3>
                                <p>{meal.description?.slice(0, 60)}...</p>
                                <p className="text-sm text-gray-600">Category: {meal.category}</p>
                                <p className="text-sm text-gray-600">Price: {meal.price} Tk.</p>
                            </div>
                            <div className="card-actions justify-end pt-0 p-4">
                                <Link to={`/mealdetails/${meal._id}`}>
                                    <button className="btn btn-primary">View Details</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Meals;