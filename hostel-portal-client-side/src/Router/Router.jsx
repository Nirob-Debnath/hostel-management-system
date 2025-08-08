import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/Rootlayout";
import Home from "../Pages/ClientPages/Home/Home";
import SignUp from "../Access/SignUp";
import Login from "../Access/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import AdminLayout from "../Layouts/AdminLayout";
import AdminRoute from "../Admin/AdminRoute"
import Meals from "../Pages/ClientPages/Meals/Meals";
import UpcomingMeals from "../Pages/ClientPages/UpcomingMeals/UpcomingMeals";
import MealDetails from "../Pages/ClientPages/MealDetails/MealDetails";
import AdminProfile from "../Pages/AdminPages/AdminProfile";
import ManageUsers from "../Pages/AdminPages/ManageUsers";
import AddMeal from "../Pages/AdminPages/AddMeal";
import AllMeals from "../Pages/AdminPages/AllMeals";
import AllReviews from "../Pages/AdminPages/AllReviews";
import ServeMeals from "../Pages/AdminPages/ServeMeals";
import UpcomingMealsAdmin from "../Pages/AdminPages/UpcomingMealsAdmin";
import AllMealsView from "../Pages/AdminPages/AllMealsView";
import AllMealsUpdate from "../Pages/AdminPages/AllMealsUpdate";
import RequestedMeals from "../Pages/DashboardPages/RequestedMeals";
import MyReviews from "../Pages/DashboardPages/MyReviews";
import Checkout from "../Pages/ClientPages/Payment/Checkout";
import PaymentHistory from "../Pages/ClientPages/Payment/PaymentHistory";
import Forbidden from "../Forbidden/Forbidden";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "/checkout/:packageName",
                element: <PrivateRoute>
                    <Checkout></Checkout>
                </PrivateRoute>
            },
            {
                path: "meals",
                Component: Meals
            },
            {
                path: "upcomingmeals",
                Component: UpcomingMeals
            },
            {
                path: "mealdetails/:id",
                Component: MealDetails
            },
            {
                path: "signup",
                Component: SignUp
            },
            {
                path: "login",
                Component: Login
            },
            {
                path: "forbidden",
                Component: Forbidden
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                path: "requestedmeals",
                Component: RequestedMeals
            },
            {
                path: "myreviews",
                Component: MyReviews
            },
            {
                path: "paymenthistory",
                Component: PaymentHistory
            }
        ]
    },
    {
        path: "admin",
        element: <AdminRoute>
            <AdminLayout></AdminLayout>
        </AdminRoute>,
        children: [
            {
                path: "adminprofile",
                Component: AdminProfile
            },
            {
                path: "manageusers",
                Component: ManageUsers
            },
            {
                path: "addmeal",
                Component: AddMeal
            },
            {
                path: "allmeals",
                Component: AllMeals
            },
            {
                path: "/admin/mealdetails/:id",
                Component: AllMealsView
            },
            {
                path: "/admin/updatemeal/:id",
                Component: AllMealsUpdate
            },
            {
                path: "allreviews",
                Component: AllReviews
            },
            {
                path: "servemeals",
                Component: ServeMeals
            },
            {
                path: "upcomingmealsadmin",
                Component: UpcomingMealsAdmin
            }
        ]
    }
]);