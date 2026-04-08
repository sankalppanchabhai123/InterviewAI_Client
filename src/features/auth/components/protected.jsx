import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export const UserAuth = ({ children }) => {
    const { user, loading } = useAuth();

    // Wait for initial auth check from context provider
    if (loading) {
        return null;
    }

    // If no user after auth check from context, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};