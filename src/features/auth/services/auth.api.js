import axios from "axios";

const DEFAULT_LOCAL_API_BASE_URL = "https://interview-test-ttcc.vercel.app/api";

const resolveApiBaseUrl = () => {
    const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (!configuredBaseUrl) {
        return DEFAULT_LOCAL_API_BASE_URL;
    }

    // Most local dev servers are HTTP only. Avoid SSL errors from accidental https localhost values.
    if (/^https:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(configuredBaseUrl)) {
        return configuredBaseUrl.replace(/^https:/i, "http:");
    }

    return configuredBaseUrl;
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    withCredentials: true,
});

export async function register({ username, email, password }) {
    try {
        const res = await api.post("/register", { username, email, password },
            { withCredentials: true });
        return res.data
    } catch (err) {
        console.log("error while sending register request", err);
        throw err;
    }
}
export async function login({ email, password }) {
    try {
        const res = await api.post("/login", { email, password },
            { withCredentials: true }
        );
        return res.data;
    } catch (err) {
        console.log("error while sending login request", err);
        throw err;
    }
}

export async function googleAuth({ credential }) {
    try {
        const res = await api.post("/google", { credential },
            { withCredentials: true }
        );
        return res.data;
    } catch (err) {
        console.log("error while sending google auth request", err);
        throw err;
    }
}

export async function logout() {
    try {
        const res = await api.post("/logout", {},
            { withCredentials: true }
        );
        return res.data;
    } catch (err) {
        console.log("error in the code")
        throw err;
    }
}
export async function getUser() {
    try {
        const res = await api.get("/me",
            { withCredentials: true }
        );
        return res.data;
    } catch (err) {
        console.log("error while fetching data")
        throw err;
    }
}
