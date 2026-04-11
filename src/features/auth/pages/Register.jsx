import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

// ── Icons ──────────────────────────────────────────────────────────────────────
const Eye = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {open
            ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>)
            : (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>)
        }
    </svg>
);

// ── Main Register component ────────────────────────────────────────────────────
export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const [showPw, setShowPw] = useState(false);
    const [focused, setFocused] = useState("");
    const navigate = useNavigate();
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const { handleRegister, handleGoogleLogin, loading } = useAuth();

    // ── Field border helper ──────────────────────────────────────────────────
    const inputClass = (isFocused) =>
        `w-full bg-white rounded-lg px-4 py-3 text-gray-900 text-sm outline-none border transition-all placeholder:text-gray-400
        ${isFocused
            ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            : "border-gray-200"
        }`;

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!username.trim() || !email.trim() || !password) {
            setFormError("Please fill username, email and password.");
            return;
        }

        try {
            await handleRegister({
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password,
            });
            navigate("/")
        } catch (err) {
            console.error("Register error:", err);
            const apiError = err?.response?.data?.message || err?.response?.data?.massage;
            setFormError(apiError || "Could not register. Please try again.");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setFormError("");
        try {
            await handleGoogleLogin({ credential: credentialResponse?.credential });
            navigate("/");
        } catch (err) {
            setFormError(err?.response?.data?.message || "Google signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">

            <div className="w-full max-w-md">

                {/* Card */}
                <div className="rounded-2xl bg-slate-50 px-8 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-slate-200">

                    {/* Logo */}
                    {/* <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-gray-900 font-bold text-xl">Interview Bit</span>
                    </div> */}

                    {/* Heading */}
                    <h1 className="text-gray-900 text-2xl font-bold mb-2">Create your account</h1>
                    <p className="text-gray-500 text-sm mb-6">Join us and start your journey</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wide uppercase text-slate-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setFocused("username")}
                                onBlur={() => setFocused("")}
                                placeholder="Jane Smith"
                                className={inputClass(focused === "username")}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wide uppercase text-slate-700">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocused("email")}
                                onBlur={() => setFocused("")}
                                placeholder="you@example.com"
                                className={inputClass(focused === "email")}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wide uppercase text-slate-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused("")}
                                    placeholder="Min. 8 characters"
                                    className={`${inputClass(focused === "password")} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer flex items-center p-0.5 hover:text-gray-700 transition-colors"
                                >
                                    <Eye open={showPw} />
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {formError ? (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {formError}
                            </p>
                        ) : null}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 ${loading ? "opacity-75" : "opacity-100"}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                                        <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-slate-50 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Signup Button */}
                    {googleClientId ? (
                        <div className="flex justify-center mb-6">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setFormError("Google signup was cancelled or failed.")}
                                useOneTap={false}
                                text="signup_with"
                                shape="circle"
                                theme="outline"
                                width="50"
                            />
                        </div>
                    ) : null}

                    {/* Sign in link */}
                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}