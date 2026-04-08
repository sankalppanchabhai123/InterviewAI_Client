import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { UserAuth } from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home";
import Result from "./features/interview/pages/Result";
import ReportForm from "./features/interview/pages/ReportForm";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/result",
        element: <Result />
    },
    {
        path: "/report",
        element: (
            <UserAuth>
                <ReportForm />
            </UserAuth>
        )
    },
])