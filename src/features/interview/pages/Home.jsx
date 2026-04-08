import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const featureItems = [
    "Role-Specific Questions",
    "Skill Gap Detection",
    "ATS Resume Match",
    "Preparation Roadmap",
    "Interview Strategy Plan",
];

const insightCards = [
    {
        title: "Skill Gap Analysis",
        description:
            "Compare your current profile against the target role and get a clear skill-by-skill gap breakdown.",
    },
    {
        title: "ATS-Friendly Resume Match",
        description:
            "Get resume recommendations that align your content with the job's keywords, responsibilities, and ATS patterns.",
    },
    {
        title: "Preparation Roadmap",
        description:
            "Receive a step-by-step preparation roadmap with priority topics, timelines, and practice checkpoints.",
    },
    {
        title: "Role-Based Interview Plan",
        description:
            "Generate technical and behavioral interview plans tailored to the exact role you are applying for.",
    },
];

const workflowCards = [
    {
        title: "Analyze Job Requirements",
        description:
            "Upload the job description and let InterviewAI identify required skills, tools, and role expectations.",
    },
    {
        title: "Detect Gaps and Match Resume",
        description:
            "Map your experience to the role, detect missing skills, and optimize your resume for ATS relevance.",
    },
    {
        title: "Build Your Prep Roadmap",
        description:
            "Get a personalized interview roadmap and preparation plan to practice with focus and confidence.",
    },
];

const workflowAnimationClasses = [
    "animate-fade-up-delay-1",
    "animate-fade-up-delay-2",
    "animate-fade-up-delay-3",
];

export default function Home() {
    const navigate = useNavigate();
    const { user, handleLogout } = useAuth();

    const onLogout = async () => {
        try {
            await handleLogout();
        } finally {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-[#3f73e8] font-['Poppins',sans-serif] text-white p-[clamp(14px,2vw,22px)_clamp(12px,2vw,20px)_28px] relative overflow-hidden">
            <div className="max-w-265 mx-auto relative pt-20 sm:pt-22">
                <div className="absolute -top-[14%] -left-[8%] w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none animate-float-soft" />
                <div className="absolute -bottom-[16%] -right-[7%] w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(18,35,96,0.08)_0%,transparent_70%)] pointer-events-none animate-float-soft" />
                {/* Navigation Pill */}
                <header className="fixed top-5 left-1/2 z-50 w-[min(1100px,calc(100%-1.5rem))] -translate-x-1/2 min-h-12.5 rounded-full bg-[rgba(164,189,255,0.42)] backdrop-blur-[6px] shadow-[0_10px_30px_rgba(6,25,78,0.18),inset_0_1px_0_rgba(255,255,255,0.32)] border border-[rgba(221,233,255,0.32)] flex items-center justify-between p-[5px_clamp(16px,2.2vw,26px)] gap-1 animate-fade-up">
                    <div className="flex items-center gap-1.5 font-bold text-[clamp(17px,2vw,24px)] tracking-[0.2px] text-[#f7fbff] animate-fade-up-delay-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f2f6ff] shadow-[0_0_0_4px_rgba(255,255,255,0.06)] animate-glow-pulse" />
                        <span>InterviewAI</span>
                    </div>

                    <nav className="flex items-center gap-1.5 text-[clamp(13px,1.25vw,17px)] font-semibold animate-fade-up-delay-2">
                        {user ? (
                            <button
                                type="button"
                                onClick={onLogout}
                                className="border-none text-white bg-[#2f68ea] rounded-full p-[clamp(6px,0.9vw,8px)_clamp(18px,2.1vw,24px)] text-[clamp(13px,1.2vw,16px)] font-semibold shadow-[0_3px_10px_rgba(12,39,108,0.3)] cursor-pointer hover-zoom"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="text-[#0f172a] no-underline p-[clamp(4px,0.6vw,7px)_clamp(8px,0.9vw,10px)] rounded-full hover:bg-[rgba(255,255,255,0.16)] transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="no-underline text-white bg-[#2f68ea] rounded-full p-[clamp(2px,0.8vw,5px)_clamp(20px,2.2vw,24px)] shadow-[0_3px_10px_rgba(12,39,108,0.3)] hover-lift animate-shimmer"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col items-center text-center pt-[clamp(12px,1.3vw,18px)] px-2.5">
                    <h1 className="m-0 max-w-225 tracking-[-1.2px] font-bold text-[#f6f9ff] animate-fade-up leading-none">
                        <span className="block text-[clamp(34px,3.6vw,48px)] animate-fade-up">Crack Interviews With</span>
                        <br />
                        <span className="block mt-[-0.08em] text-[clamp(48px,5.4vw,72px)] text-[#071426] animate-fade-up-delay-1">AI-Powered Preparation</span>
                    </h1>

                    <p className="mt-[clamp(15px,2.2vw,26px)] mb-0 max-w-190 text-[clamp(16px,1.55vw,23px)] leading-tight font-normal text-[#071426] animate-fade-up-delay-2">
                        Paste your job description, share your background, and upload your resume
                        <br />
                        to generate a personalized interview report and preparation roadmap.
                    </p>

                    <div className="mt-[clamp(18px,3vw,40px)] flex gap-[clamp(10px,2.5vw,24px)] flex-wrap justify-center animate-fade-up-delay-3">
                        <Link to="/report">
                            <button
                                type="button"

                                className="border-none rounded-full bg-black text-white p-[clamp(10px,1.25vw,14px)_clamp(24px,3.1vw,38px)] text-[clamp(14px,1.25vw,20px)] font-bold tracking-[0.1px] cursor-pointer hover-zoom"
                            >
                                Generate My Interview Plan
                            </button>
                        </Link>
                        <button
                            type="button"
                            className="border border-[#141414] rounded-full bg-[#f3f3f1] text-[#0f1216] p-[clamp(9px,1.1vw,13px)_clamp(22px,2.8vw,34px)] text-[clamp(14px,1.18vw,19px)] font-bold cursor-pointer hover-zoom"
                        >
                            View Sample Report
                        </button>
                    </div>

                    <div className="mt-[clamp(34px,5.2vw,70px)] flex justify-center gap-[clamp(10px,2vw,22px)] flex-wrap animate-fade-up-delay-4">
                        {featureItems.map((item) => (
                            <div key={item} className="flex items-center gap-2.5 text-[#f6f9ff] text-[clamp(13px,1.35vw,18px)] font-medium tracking-[0.1px] hover-lift">
                                <span className="w-6 h-6 rounded-full bg-[#dce6fb] shadow-[inset_0_0_0_1px_rgba(26,42,73,0.14)] relative shrink-0 animate-glow-pulse">
                                    <span className="w-1.75 h-1.75 rounded-full bg-[#0b1327] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-[clamp(72px,10vw,142px)] grid gap-12 sm:gap-14 animate-fade-up-delay-4">
                    <div className="text-center max-w-3xl mx-auto px-2.5">
                        <h2 className="m-0 text-[#f6f9ff] text-[clamp(26px,3vw,40px)] font-bold leading-tight animate-fade-up">
                            Built for Every Interview Stage
                        </h2>
                        <p className="mt-3 text-[clamp(14px,1.45vw,18px)] leading-tight text-[#0f172a] animate-fade-up-delay-1">
                            InterviewAI helps you identify skill gaps, build a role-specific preparation roadmap,
                            and produce ATS-friendly resume improvements for better interview outcomes.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {insightCards.map((card, index) => (
                            <article
                                key={card.title}
                                className={`rounded-[26px] border border-[#1a1a1a] bg-[#f7f9ff] text-[#09111f] shadow-[0_16px_35px_rgba(17,42,107,0.2)] p-6 hover-zoom`}
                            >
                                <div className="w-11 h-11 rounded-full bg-[#dce6fb] flex items-center justify-center mb-4 shadow-[inset_0_0_0_1px_rgba(26,42,73,0.14)]">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f68ea] animate-glow-pulse" />
                                </div>
                                <h3 className="m-0 text-[18px] font-bold leading-snug">
                                    {card.title}
                                </h3>
                                <p className="mt-3 text-[14px] leading-6 text-[#334155]">
                                    {card.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className="text-center max-w-3xl mx-auto px-2.5 pt-5 sm:pt-7">
                        <h2 className="m-0 text-[#f6f9ff] text-[clamp(24px,2.8vw,36px)] font-bold leading-tight animate-fade-up">
                            Simple Steps, Clear Output
                        </h2>
                        <p className="mt-3 text-[clamp(14px,1.35vw,17px)] leading-relaxed text-[#0f172a] animate-fade-up-delay-1">
                            Follow a short workflow to analyze role fit, detect skill gaps, and generate a practical interview preparation plan.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {workflowCards.map((card, index) => (
                            <article
                                key={card.title}
                                className={`rounded-[22px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.16)] backdrop-blur-sm p-5 text-left hover-zoom `}
                            >
                                <div className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#dbe7ff]">
                                    Step {index + 1}
                                </div>
                                <h3 className="mt-3 mb-2 text-[18px] font-bold text-white">
                                    {card.title}
                                </h3>
                                <p className="text-[14px] leading-6 text-[#0f172a]">
                                    {card.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <section className="rounded-[28px] border border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.14)] backdrop-blur-sm px-4 sm:px-6 py-9 sm:py-11 shadow-[0_16px_35px_rgba(17,42,107,0.18)] mt-3 sm:mt-5 animate-fade-up-delay-4">
                        <div className="text-center max-w-4xl mx-auto px-2.5">
                            <h2 className="m-0 text-[#f6f9ff] text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.04] animate-fade-up">
                                Store All Your Interview Prep,
                                <br />
                                In One Place
                            </h2>
                            <p className="mt-4 mx-auto max-w-3xl text-[clamp(14px,1.4vw,18px)] leading-relaxed text-[#0f172a] animate-fade-up-delay-1">
                                Keep job requirements, skill gap reports, ATS resume suggestions, and interview preparation roadmaps in one focused workspace.
                            </p>

                            <div className="mt-7 flex justify-center animate-fade-up-delay-2">
                                <Link to="/report">
                                    <button type="button" className="border-none rounded-full bg-black text-white px-7 py-3.5 text-[15px] font-bold cursor-pointer hover-zoom">
                                        Start Preparing Free
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-11 border-t border-[rgba(255,255,255,0.22)] pt-9 sm:pt-11 grid gap-9 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] text-left">
                            <div className="animate-fade-up-delay-1">
                                <div className="flex items-center gap-2.5 font-bold text-[clamp(20px,2.1vw,26px)] text-white">
                                    <span className="w-2 h-2 rounded-full bg-white" />
                                    <span>InterviewAI</span>
                                </div>
                                <p className="mt-4 max-w-sm text-[clamp(13px,1.1vw,13px)]  leading-7 text-[#0f172a]">
                                    All your skill-gap insights, ATS resume improvements and role-based preparation plans in one place.
                                </p>
                            </div>

                            <div className="animate-fade-up-delay-2">
                                <div className="text-white text-[clamp(15px,1.15vw,17px)] font-bold mb-4">Product</div>
                                <div className="grid gap-3 text-[clamp(14px,1.05vw,15px)] font-normal text-[#171d2c]">
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Skill Gap Analysis</span>
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">ATS Resume Match</span>
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Preparation Roadmap</span>
                                </div>
                            </div>

                            <div className="animate-fade-up-delay-3">
                                <div className="text-white text-[clamp(15px,1.15vw,17px)] font-bold mb-4">Company</div>
                                <div className="grid gap-3 text-[clamp(14px,1.05vw,15px)] font-normal text-[#171d2c]">
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Role Intelligence</span>
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Candidate Insights</span>
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Interview Outcomes</span>
                                </div>
                            </div>

                            <div className="animate-fade-up-delay-4">
                                <div className="text-white text-[clamp(15px,1.15vw,17px)] font-bold mb-4">Resources</div>
                                <div className="grid gap-3 text-[clamp(14px,1.05vw,15px)] font-normal text-[#171d2c]">
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Roadmap Templates</span>
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Resume Optimization Tips</span>
                                    <span className="inline-block w-fit cursor-pointer transition-colors duration-200 hover:text-white">Mock Interview Practice</span>
                                </div>
                            </div>
                        </div>

                    </section>

                    <footer className="mt-7 pb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[14px] text-[#dbe7ff] animate-fade-up-delay-4">
                        <p className="m-0 text-white">© 2026 InterviewAI. All rights reserved.</p>

                        <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 sm:gap-4 text-[#0f172a]">
                            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-80 transition-opacity">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-4.5 1.5-4.5-2-6-2m12 4v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-6 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.75c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="hover:opacity-80 transition-opacity">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4l7.7 9.3M20 4l-7.7 9.3M6 20l6-6 6 6" />
                                </svg>
                            </a>
                            <span className="ml-3 flex items-center gap-1 font-bold text-[#0f172a]">
                                Build with <span className="text-red-500">♥</span> by Sankalp
                            </span>
                        </div>
                    </footer>
                </section>
            </div>
        </div>
    );
}