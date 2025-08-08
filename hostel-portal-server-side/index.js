const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const app = express();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kypcsee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //await client.connect();
        console.log("MongoDB connected ✅");

        const db = client.db("hostelDB");
        const mealCollection = db.collection("meals");
        const reviewCollection = db.collection("reviews");
        const requestCollection = db.collection("requests");
        const userCollection = db.collection("users");
        const paymentCollection = db.collection("payments");
        const upcomingMealsCollection = db.collection('upcoming');

        // Get all upcoming meals
        app.get('/upcoming', async (req, res) => {
            try {
                const meals = await upcomingMealsCollection.find().sort({ publishDate: 1 }).toArray();
                res.send(meals);
            } catch (err) {
                console.error('Failed to fetch upcoming meals:', err);
                res.status(500).send({ error: 'Failed to fetch upcoming meals' });
            }
        });

        // Add new upcoming meal
        app.post('/upcoming', async (req, res) => {
            try {
                const meal = req.body;
                const result = await upcomingMealsCollection.insertOne(meal);
                res.send({ success: true, insertedId: result.insertedId });
            } catch (err) {
                console.error('Failed to add upcoming meal:', err);
                res.status(500).send({ error: 'Failed to add upcoming meal' });
            }
        });

        // Publish upcoming meal: Move to meals collection and delete from upcoming
        app.patch('/upcoming/:id', async (req, res) => {
            try {
                const mealId = req.params.id;

                const upcomingMeal = await upcomingMealsCollection.findOne({ _id: new ObjectId(mealId) });
                if (!upcomingMeal) {
                    return res.status(404).send({ success: false, message: 'Upcoming meal not found' });
                }

                const { _id, ...mealToPublish } = upcomingMeal;

                mealToPublish.createdAt = new Date();

                await mealCollection.insertOne(mealToPublish);

                await upcomingMealsCollection.deleteOne({ _id: new ObjectId(mealId) });

                res.send({ success: true, message: 'Meal published successfully' });
            } catch (err) {
                console.error('Error publishing upcoming meal:', err);
                res.status(500).send({ success: false, message: 'Internal Server Error' });
            }
        });

        // Cancel/delete an upcoming meal
        app.delete('/upcoming/:id', async (req, res) => {
            try {
                const result = await upcomingMealsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
                if (result.deletedCount === 1) {
                    res.send({ success: true, message: 'Upcoming meal canceled' });
                } else {
                    res.status(404).send({ success: false, message: 'Meal not found' });
                }
            } catch (err) {
                console.error('Error deleting upcoming meal:', err);
                res.status(500).send({ success: false, message: 'Internal server error' });
            }
        });


        // Like/unlike an upcoming meal
        app.patch('/upcoming/:id/like', async (req, res) => {
            const { userId } = req.body;
            if (!userId) return res.status(400).send({ error: 'userId is required' });

            try {
                const mealId = req.params.id;
                const meal = await upcomingMealsCollection.findOne({ _id: new ObjectId(mealId) });
                if (!meal) return res.status(404).send({ error: 'Meal not found' });

                const update = meal.likes?.includes(userId)
                    ? { $pull: { likes: userId } }
                    : { $addToSet: { likes: userId } };

                await upcomingMealsCollection.updateOne({ _id: new ObjectId(mealId) }, update);
                const updatedMeal = await upcomingMealsCollection.findOne({ _id: new ObjectId(mealId) });
                res.send({ likes: updatedMeal.likes });
            } catch (err) {
                console.error('Error liking meal:', err);
                res.status(500).send({ error: 'Failed to update likes' });
            }
        });

        // Create user
        app.post('/users', async (req, res) => {
            const { email } = req.body;
            const existing = await userCollection.findOne({ email });
            if (existing) {
                return res.send({ message: 'User already exists', inserted: false });
            }
            const result = await userCollection.insertOne(req.body);
            res.send(result);
        });

        // Check if user is admin
        app.get('/users/admin/:email', async (req, res) => {
            const user = await userCollection.findOne({ email: req.params.email });
            res.send({ admin: user?.role === 'admin' });
        });

        // Admin profile
        app.get('/api/admins/profile', async (req, res) => {
            const email = req.query.email;
            try {
                const admin = await userCollection.findOne({ email, role: 'admin' });
                if (!admin) return res.status(404).send({ message: "Admin not found" });
                res.send(admin);
            } catch (err) {
                res.status(500).send({ message: 'Server error', err });
            }
        });

        //manage users
        app.get('/users', async (req, res) => {
            try {
                const { role, search = '' } = req.query;
                const query = {};
                if (role) query.role = role;

                // Server side search by username or email using regex (case-insensitive)
                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ];
                }

                const users = await userCollection.find(query).toArray();
                res.send(users);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch users' });
            }
        });

        app.patch('/users/:id/make-admin', async (req, res) => {
            try {
                const userId = req.params.id;
                const result = await userCollection.updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: { role: 'admin' } }
                );
                if (result.modifiedCount === 1) {
                    res.send({ message: 'User promoted to admin' });
                } else {
                    res.status(404).send({ message: 'User not found or role unchanged' });
                }
            } catch (error) {
                res.status(500).send({ error: 'Failed to update user role' });
            }
        });

        // Count meals added by admin
        app.get('/api/meals/count', async (req, res) => {
            const email = req.query.email;
            try {
                const count = await mealCollection.countDocuments({ distributorEmail: email });
                res.send({ count });
            } catch (err) {
                res.status(500).send({ message: 'Error fetching meal count', error: err });
            }
        });

        //admin update meal
        app.patch('/meals/:id', async (req, res) => {
            try {
                const mealId = req.params.id;
                const updatedMeal = req.body;

                // Remove fields you don't want overwritten if necessary (e.g., _id)
                delete updatedMeal._id;

                const result = await mealCollection.updateOne(
                    { _id: new ObjectId(mealId) },
                    { $set: updatedMeal }
                );

                if (result.modifiedCount === 1) {
                    res.send({ success: true, message: 'Meal updated successfully' });
                } else {
                    res.status(404).send({ success: false, message: 'Meal not found or not modified' });
                }
            } catch (error) {
                console.error('Error updating meal:', error);
                res.status(500).send({ success: false, message: 'Internal Server Error' });
            }
        });



        //meals
        app.post('/meals', async (req, res) => {
            try {
                const meal = req.body;
                const result = await mealCollection.insertOne(meal);
                res.send({ success: true, insertedId: result.insertedId });
            } catch (error) {
                console.error('Failed to add meal:', error);
                res.status(500).send({ success: false, message: 'Internal Server Error' });
            }
        });

        // GET all meals with optional server-side sorting
        app.get('/admin/meals', async (req, res) => {
            try {
                const sortBy = req.query.sortBy || null;
                const order = req.query.order === 'asc' ? 1 : -1;

                const pipeline = [];

                // Add likesCount field
                pipeline.push({
                    $addFields: {
                        likesCount: { $size: { $ifNull: ["$likes", []] } }
                    }
                });

                // Conditionally add sorting
                if (sortBy === 'likes') {
                    pipeline.push({ $sort: { likesCount: order } });
                } else if (sortBy === 'reviews_count') {
                    pipeline.push({ $sort: { reviews_count: order } });
                } else {
                    pipeline.push({ $sort: { createdAt: -1 } }); // default sort
                }

                const meals = await mealCollection.aggregate(pipeline).toArray();
                res.send(meals);
            } catch (error) {
                console.error('Error fetching meals:', error);
                res.status(500).send({ success: false, message: 'Internal Server Error' });
            }
        });

        //delete
        app.delete('/meals/:id', async (req, res) => {
            try {
                const result = await mealCollection.deleteOne({ _id: new ObjectId(req.params.id) });
                if (result.deletedCount === 1) {
                    res.send({ success: true, message: 'Meal deleted' });
                } else {
                    res.status(404).send({ success: false, message: 'Meal not found' });
                }
            } catch (error) {
                console.error('Error deleting meal:', error);
                res.status(500).send({ success: false, message: 'Error deleting meal' });
            }
        });

        // Get all meals with filters
        app.get('/meals', async (req, res) => {
            try {
                const {
                    search = '', category, minPrice = 0, maxPrice = 1000, page = 1, limit = 6
                } = req.query;

                const skip = (parseInt(page) - 1) * parseInt(limit);
                const query = {
                    title: { $regex: search, $options: 'i' },
                    price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }
                };
                if (category && category !== 'All') query.category = category;

                const meals = await mealCollection.find(query).skip(skip).limit(parseInt(limit)).toArray();
                const total = await mealCollection.countDocuments(query);

                res.send({ meals, total });
            } catch (err) {
                res.status(500).send({ error: 'Failed to fetch meals' });
            }
        });

        ///meals/:id/publish
        app.patch('/meals/:id/publish', async (req, res) => {
            try {
                const id = req.params.id;

                const result = await mealCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: { createdAt: new Date() },
                        $unset: { publishDate: "" }
                    }
                );

                if (result.modifiedCount === 1) {
                    res.send({ success: true, message: 'Meal published' });
                } else {
                    res.status(404).send({ success: false, message: 'Meal not found or already published' });
                }
            } catch (err) {
                console.error('Error publishing meal:', err);
                res.status(500).send({ success: false, message: 'Internal server error' });
            }
        });

        // PUT: Update a review by ID
        app.put('/reviews/:id', async (req, res) => {
            const reviewId = req.params.id;
            const { content, userId } = req.body;

            if (!content || !content.trim()) {
                return res.status(400).json({ error: 'Review content is required.' });
            }

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized: userId required' });
            }

            try {
                // Check if this user owns the review
                const review = await reviewCollection.findOne({ _id: new ObjectId(reviewId) });

                if (!review) {
                    return res.status(404).json({ error: 'Review not found' });
                }

                if (review.userId !== userId) {
                    return res.status(403).json({ error: 'Forbidden: You can only edit your own review' });
                }

                const result = await reviewCollection.updateOne(
                    { _id: new ObjectId(reviewId) },
                    { $set: { content } }
                );

                res.status(200).json({ message: 'Review updated successfully' });
            } catch (err) {
                console.error('Error updating review:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });


        // Get single meal by ID
        app.get('/meals/:id', async (req, res) => {
            const meal = await mealCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(meal);
        });

        // Like a meal
        app.patch('/meals/:id/like', async (req, res) => {
            const { userId } = req.body;
            const mealId = req.params.id;
            if (!userId) return res.status(400).send({ error: 'userId is required' });

            const meal = await mealCollection.findOne({ _id: new ObjectId(mealId) });
            if (!meal) return res.status(404).send({ error: 'Meal not found' });

            const update = meal.likes?.includes(userId) ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };
            await mealCollection.updateOne({ _id: new ObjectId(mealId) }, update);
            const updated = await mealCollection.findOne({ _id: new ObjectId(mealId) });
            res.send({ likes: updated.likes });
        });

        // Create a request
        app.post("/requests", async (req, res) => {
            const request = { ...req.body, createdAt: new Date() };
            const result = await requestCollection.insertOne(request);
            res.send(result);
        });

        // Cancel a request (change status to "cancelled")
        app.patch('/requests/:id/cancel', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await requestCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status: 'cancelled' } }
                );

                if (result.modifiedCount === 1) {
                    res.send({ success: true, message: 'Request cancelled' });
                } else {
                    res.status(404).send({ success: false, message: 'Request not found or already cancelled' });
                }
            } catch (err) {
                console.error('Error cancelling request:', err);
                res.status(500).send({ success: false, message: 'Internal server error' });
            }
        });

        // ✅ User Dashboard - Get their own requested meals
        app.get('/requests', async (req, res) => {
            try {
                const userEmail = req.query.email;
                if (!userEmail) {
                    return res.status(400).send({ error: 'Email query param is required' });
                }

                const query = { userEmail: userEmail };
                const requests = await requestCollection.find(query).sort({ createdAt: -1 }).toArray();
                res.send(requests);
            } catch (err) {
                console.error('Failed to fetch user requests:', err);
                res.status(500).send({ error: 'Failed to fetch requests' });
            }
        });

        // Get requests for a user
        app.get("/requests/:userId", async (req, res) => {
            const result = await requestCollection.find({ userId: req.params.userId }).sort({ createdAt: -1 }).toArray();
            res.send(result);
        });

        // Delete a request
        app.delete("/requests/:id", async (req, res) => {
            const result = await requestCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        });

        // Get all reviews for a meal
        app.get("/meals/:id/reviews", async (req, res) => {
            const reviews = await reviewCollection.find({ mealId: req.params.id }).sort({ time: -1 }).toArray();
            res.send(reviews);
        });

        // Post a new review
        app.post("/meals/:id/reviews", async (req, res) => {
            const review = { ...req.body, mealId: req.params.id, time: new Date() };
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        // get all reviews by a specific user
        app.get('/reviews/user/:userId', async (req, res) => {
            try {
                const userId = req.params.userId;
                const reviews = await reviewCollection.find({ userId }).sort({ time: -1 }).toArray();
                res.send(reviews);
            } catch (err) {
                console.error('Failed to fetch user reviews:', err);
                res.status(500).send({ error: 'Failed to fetch user reviews' });
            }
        });


        // Get all reviews (used in AllReviews.jsx)
        app.get('/reviews/all', async (req, res) => {
            try {
                const reviews = await reviewCollection.find().sort({ time: -1 }).toArray();
                res.send(reviews);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
                res.status(500).send({ error: 'Failed to fetch reviews' });
            }
        });

        // Delete a review by ID
        app.delete('/reviews/:id', async (req, res) => {
            try {
                const result = await reviewCollection.deleteOne({ _id: new ObjectId(req.params.id) });
                if (result.deletedCount === 1) {
                    res.send({ success: true, message: 'Review deleted' });
                } else {
                    res.status(404).send({ success: false, message: 'Review not found' });
                }
            } catch (err) {
                console.error('Error deleting review:', err);
                res.status(500).send({ success: false, message: 'Internal server error' });
            }
        });

        // Update status of a meal request
        app.patch("/requests/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const { status } = req.body;

                if (!status) return res.status(400).send({ message: 'Status is required' });

                const result = await requestCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status } }
                );

                res.send(result);
            } catch (err) {
                console.error("Failed to update request status:", err);
                res.status(500).send({ error: 'Internal server error' });
            }
        });

        // Serve (mark as delivered) a requested meal
        app.patch("/requests/:id/serve", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await requestCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status: "delivered" } }
                );
                if (result.modifiedCount === 1) {
                    res.send({ success: true, message: "Meal marked as delivered" });
                } else {
                    res.status(404).send({ success: false, message: "Request not found" });
                }
            } catch (err) {
                console.error('Error updating request status:', err);
                res.status(500).send({ error: 'Failed to update request status' });
            }
        });

        // Create payment intent
        app.post('/api/payment/create-payment-intent', async (req, res) => {
            try {
                const { packageName } = req.body;
                console.log(packageName);
                const prices = {
                    silver: 10,
                    gold: 20,
                    platinum: 30
                };
                const amount = prices[packageName.toLowerCase()] * 100;
                const paymentIntent = await stripe.paymentIntents.create({
                    amount,
                    currency: 'usd',
                    payment_method_types: ['card'],
                });
                console.log(paymentIntent);
                res.send({
                    clientSecret: paymentIntent.client_secret,
                    package: { name: packageName, price: amount / 100 }
                });
            } catch (err) {
                console.error('Payment Intent Error:', err);
                res.status(500).send({ error: 'Failed to create payment intent' });
            }
        });

        //POST /api/payment/save-payment
        app.post('/api/payment/save-payment', async (req, res) => {
            try {
                const { email, packageName, price, transactionId } = req.body;

                // Save payment
                await paymentCollection.insertOne({
                    email,
                    packageName,
                    price,
                    transactionId,
                    date: new Date(),
                    badge: packageName
                });

                // Assign badge to user
                await userCollection.updateOne(
                    { email },
                    { $set: { badge: packageName } }
                );

                res.send({ success: true });
            } catch (err) {
                console.error('Save payment error:', err);
                res.status(500).send({ error: 'Failed to save payment' });
            }
        });

        // GET /api/payment/history
        app.get('/api/payment/history', async (req, res) => {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).send({ error: 'Email required' });

                const payments = await paymentCollection.find({ email }).sort({ date: -1 }).toArray();
                res.send(payments);
            } catch (err) {
                console.error('Get payment history error:', err);
                res.status(500).send({ error: 'Failed to get payment history' });
            }
        });


    } finally {
        // don't close the connection
    }

}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
    res.send('Hostel Management Server is running ✅');
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});