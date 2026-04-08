import axios from "axios";


const api = axios.create({
    baseURL: "https://interview-test-eosin-three.vercel.app/api/auth",
    // baseURL: "http://localhost:3000/api/auth",
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
        const res = await api.get("/log-date",
            { withCredentials: true }
        );
        return res.data;
    } catch (err) {
        console.log("error while fetching data")
        throw err;
    }
}
