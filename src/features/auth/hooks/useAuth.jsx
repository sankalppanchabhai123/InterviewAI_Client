import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getUser } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an Authprovider");
    }

    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data?.user ?? null)
            return data
        } finally {
            setLoading(false)
        }
    }
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data?.user ?? null)
            return data
        } finally {
            setLoading(false)
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }
    const getuser = async () => {
        setLoading(true)
        try {
            const { user } = await getUser()
            setUser(user ?? null);
        } catch (err) {
            console.log(err);
            setUser(null);
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        getuser,
        setUser,
        setLoading,
    }
}