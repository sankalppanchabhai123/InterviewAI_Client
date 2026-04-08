import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom"

// ── Icons ──────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {open ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

// ── Component ──────────────────────────────────────────────────────────────────
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passFocused, setPassFocused] = useState(false);

    const navigate = useNavigate()
    const { handleLogin, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const inputClass = (focused) =>
        `w-full bg-[#edf4ff] rounded-xl px-4 py-3 text-[#0f255c] text-sm outline-none border transition-all placeholder:text-[#4b649a]
        ${focused
            ? "border-[#2f68ea] shadow-[0_0_0_3px_rgba(47,104,234,0.22)]"
            : "border-[#c8d9ff]"
        }`;

    return (
        <div className="min-h-screen bg-[#4472e5] flex items-center justify-center p-6 font-sans relative overflow-hidden">

            {/* Ambient glows - subtle white glow */}
            <div className="absolute -top-[10%] -left-[5%] w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-[10%] -right-[5%] w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(18,35,96,0.14)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative w-full max-w-105">

                {/* Card */}
                <div className="rounded-2xl  bg-[rgba(255,255,255,0.16)] backdrop-blur-sm px-8 py-7 shadow-[0_18px_45px_rgba(17,42,107,0.28)]">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-7">
                        <div className="w-9.5 h-9.5 rounded-[10px] bg-[#2f68ea] flex items-center justify-center shadow-[0_4px_16px_rgba(24,58,156,0.4)]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="black" />
                                <path d="M2 17l10 5 10-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-[#0f255c] font-bold text-lg tracking-tight">Interview Bit</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-[#0f255c] text-[26px] font-bold mb-4 tracking-tight">Welcome back</h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-[#0c1b36]">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                placeholder="you@example.com"
                                className={inputClass(emailFocused)}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-[#0c1b36]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setPassFocused(true)}
                                    onBlur={() => setPassFocused(false)}
                                    placeholder="••••••••"
                                    className={`${inputClass(passFocused)} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#0c1b36] cursor-pointer flex items-center p-0.5 hover:text-[#1d469f] transition-colors"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 px-5 rounded-xl bg-[#0b2c75] text-white text-sm font-semibold cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all hover:bg-[#163c8d] ${loading ? "opacity-80" : "opacity-100"}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                                        <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 mb-0 text-center text-[13px] font-bold text-[#0c1b36]">
                        New here?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-[#000000] underline underline-offset-3 hover:text-[#f0f1f3]"
                        >
                            Create new one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}