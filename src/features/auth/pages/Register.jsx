import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// ── Icons ──────────────────────────────────────────────────────────────────────
const Eye = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {open
            ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>)
            : (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>)
        }
    </svg>
);

// ── Success screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ onBack }) {
    return (
        <div className="min-h-screen bg-[#4472e5] flex items-center justify-center font-sans">
            <div className="text-center max-w-xs px-6">
                <div className="w-18 h-18 rounded-full bg-[#2f68ea] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(24,58,156,0.4)]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <h2 className="text-white text-2xl font-bold mb-2">Account created!</h2>
                <p className="text-[#edf4ffcf] text-sm leading-relaxed mb-7">
                    Welcome aboard! Check your inbox to verify your email before signing in.
                </p>
                <button
                    onClick={"/login"}
                    className="px-7 py-3 rounded-xl border border-[#d8e6ff] bg-[#f8fbff] text-[#0f255c] text-sm font-semibold cursor-pointer"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}

// ── Main Register component ────────────────────────────────────────────────────
export default function Register() {
    // Simple, flat state — one field per key
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const [showPw, setShowPw] = useState(false);
    const [focused, setFocused] = useState("");
    const [done, setDone] = useState(false);
    const navigate = useNavigate();

    const { handleRegister, loading } = useAuth();

    // ── Field border helper ──────────────────────────────────────────────────
    const fieldBorder = (key, override) => {
        if (override) return override;
        return focused === key
            ? "border-[#2f68ea] shadow-[0_0_0_3px_rgba(47,104,234,0.22)]"
            : "border-[#c8d9ff]";
    };

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
            setDone(true);
            navigate("/login")
        } catch (err) {
            console.error("Register error:", err);
            const apiError = err?.response?.data?.message || err?.response?.data?.massage;
            setFormError(apiError || "Could not register. Please try again.");
        }
    };

    if (done) return <SuccessScreen onBack={() => setDone(false)} />;

    return (
        <div className="min-h-screen bg-[#4472e5] flex items-center justify-center p-6 font-sans relative overflow-hidden">

            {/* Ambient blobs */}
            <div className="absolute -top-[15%] -right-[5%] w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-[10%] -left-[5%] w-105 h-105 rounded-full bg-[radial-gradient(circle,rgba(18,35,96,0.12)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative w-full max-w-110">

                {/* Card */}
                <div className="rounded-2xl   bg-[rgba(255,255,255,0.16)] px-8 py-7 shadow-[0_18px_45px_rgba(17,42,107,0.28)] backdrop-blur-sm">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-9.5 h-9.5 rounded-[10px] bg-[#2f68ea] flex items-center justify-center shadow-[0_4px_16px_rgba(24,58,156,0.4)]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="black" />
                                <path d="M2 17l10 5 10-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-[#0f255c] font-bold text-lg tracking-tight">Nucleus</span>
                    </div>

                    <h1 className="text-[#0f255c] text-[25px] font-bold mb-4 tracking-tight">Create your account</h1>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* Username */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold tracking-widest uppercase text-[#0c1b36]">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Jane Smith"
                                className={`w-full bg-[#edf4ff] rounded-xl px-4 py-2.75 text-[#0f255c] text-sm outline-none border transition-all placeholder:text-[#4b649a] autofill:shadow-[0_0_0_100px_#edf4ff_inset] autofill:text-[#0f255c] ${fieldBorder("username")}`}
                                onFocus={() => setFocused("username")}
                                onBlur={() => setFocused("")}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold tracking-widest uppercase text-[#0c1b36]">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={`w-full bg-[#edf4ff] rounded-xl px-4 py-2.75 text-[#0f255c] text-sm outline-none border transition-all placeholder:text-[#4b649a] ${fieldBorder("email")}`}
                                onFocus={() => setFocused("email")}
                                onBlur={() => setFocused("")}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold tracking-widest uppercase text-[#0c1b36]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className={`w-full bg-[#edf4ff] rounded-xl px-4 py-2.75 pr-11 text-[#0f255c] text-sm outline-none border transition-all placeholder:text-[#4b649a] ${fieldBorder("password")}`}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused("")}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#4f69a1] cursor-pointer flex hover:text-[#1d469f]">
                                    <Eye open={showPw} />
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-5 rounded-xl border border-[#1d469f]/20 text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-3 bg-[#1d469f] text-white cursor-pointer shadow-[0_4px_20px_rgba(7,12,26,0.25)] hover:bg-[#163c8d] disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                                        <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </>
                            )}
                        </button>

                        {formError ? (
                            <p className="text-[12px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {formError}
                            </p>
                        ) : null}
                    </form>

                    <p className="mt-5 text-center text-[13px] text-[#0c1b36]">
                        Already have an account?{" "}
                        <a href="/login" className="text-[#000000] no-underline font-medium hover:text-[#163c8d]">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
