import { createContext, useEffect, useState } from "react";
import { getUser } from "./services/auth.api";


export const AuthContext = createContext();

export const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkauth = async () => {
            try {
                setLoading(true);
                const res = await getUser();
                setUser(res?.user ?? null);
            } catch (err) {
                // User not authenticated on initial load - this is expected
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkauth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

