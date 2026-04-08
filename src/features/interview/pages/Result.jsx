import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const SparkleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M19 16l.75 2.25L22 19l-2.25.75L19 22l-.75-2.25L16 19l2.25-.75L19 16z" />
        <path d="M5 16l.75 2.25L8 19l-2.25.75L5 22l-.75-2.25L2 19l2.25-.75L5 16z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-blue-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M5 13l4 4L19 7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const LightbulbIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 14c.2-1 .7-1.7 1-2.5a6 6 0 1 0-8 0c.3.8.8 1.5 1 2.5" />
        <path d="M9 18h6" />
        <path d="M10 21h4" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const BoltIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const reportSections = [
    { id: "technical", label: "Technical questions" },
    { id: "behavioral", label: "Behavioral questions" },
    { id: "roadmap", label: "Road Map" },
];

const normalizeQuestionItem = (item) => {
    if (typeof item === "string") {
        return { question: item, intention: "", answer: "" };
    }

    return {
        question: item?.question || "",
        intention: item?.intention || "",
        answer: item?.answer || "",
    };
};

const normalizeSkillGap = (item) => {
    if (typeof item === "string") {
        return { skill: item, severity: "medium" };
    }

    return {
        skill: item?.skill || "",
        severity: (item?.severity || "medium").toLowerCase(),
    };
};

const ReportBody = ({ data }) => {
    const [activeSection, setActiveSection] = useState("technical");
    const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

    const sectionContent = {
        technical: {
            title: "Technical Questions",
            items: data.technicalQuestions,
            description: "Click through the section list to review the questions most relevant to your role and stack.",
        },
        behavioral: {
            title: "Behavioral Questions",
            items: data.behavioralQuestions,
            description: "Review the behavioral prompts that help you prepare structured stories and strong answers.",
        },
        roadmap: {
            title: "Road Map",
            items: data.roadmap,
            description: "Follow this preparation path to focus on the highest-impact areas first.",
        },
    };

    const activeContent = sectionContent[activeSection];
    const normalizedQuestions = activeSection === "roadmap"
        ? []
        : activeContent.items.map(normalizeQuestionItem);
    const normalizedSkillGaps = data.skillGaps.map(normalizeSkillGap).filter((item) => item.skill);


    return (
        <>
            {/* Header Section */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 border border-[rgba(205,224,255,0.45)] bg-[rgba(255,255,255,0.18)] rounded-full px-4 py-1.5 mb-5 text-[#eaf2ff] text-xs font-semibold tracking-wide shadow-[0_8px_20px_rgba(7,12,26,0.12)]">
                    <SparkleIcon />
                    AI Interview Insights
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f6f9ff] mb-3 tracking-tight leading-tight">
                    Interview Assessment Report
                </h1>
                <p className="text-[15px] text-[#dbe7ff] max-w-2xl mx-auto leading-relaxed">
                    Your personalized interview preparation guide
                </p>
            </div>

            {/* Score Card */}
            <div className="mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-7 max-w-md mx-auto text-center">
                    <div className="relative inline-block">
                        <svg className="w-36 h-36">
                            <circle
                                cx="72"
                                cy="72"
                                r="64"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="72"
                                cy="72"
                                r="64"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="8"
                                strokeDasharray={`${(Math.max(0, Math.min(100, Number(data.matchScore) || 0)) / 100) * 402} 402`}
                                strokeLinecap="round"
                                transform="rotate(-90 72 72)"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-4xl font-semibold text-white">{data.matchScore}</span>
                            <span className="text-white/50 text-xs block mt-1 uppercase tracking-wider">match</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sectioned Report */}
            <div className="grid grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)_260px] gap-5 mb-10">
                <aside className="bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(212,228,255,0.16)_100%)] border border-[rgba(205,224,255,0.32)] rounded-[20px] p-4 shadow-[0_12px_28px_rgba(4,10,35,0.15)]">
                    <div className=" font-bold tracking-[0.22em] uppercase text-[#000000] mb-3">
                        Sections
                    </div>
                    <div className="grid gap-2">
                        {reportSections.map((section) => {
                            const isActive = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`text-left rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                                        ? "bg-white text-[#101114] border-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]"
                                        : "bg-[rgba(255,255,255,0.04)] text-white border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.1)]"
                                        }`}
                                >
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main className="bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(212,228,255,0.16)_100%)] border border-[rgba(205,224,255,0.32)] rounded-[20px] overflow-hidden shadow-[0_12px_28px_rgba(4,10,35,0.15)]">
                    <div className="px-6 py-5 border-b border-[rgba(205,224,255,0.32)] bg-[rgba(255,255,255,0.12)] backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <h2 className="m-0 text-[22px] font-bold text-[#0f255c] tracking-tight">{activeContent.title}</h2>
                            <span className="inline-flex items-center rounded-full border border-[#bcd2ff] bg-[#eaf2ff] px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#234894] uppercase">
                                {activeSection === "roadmap" ? `${activeContent.items.length} Steps` : `${normalizedQuestions.length} Questions`}
                            </span>
                        </div>
                        <p className="mt-2 mb-0 text-[13px] text-[#456a97] leading-relaxed">{activeContent.description}</p>
                    </div>

                    <div className="p-5 sm:p-6 min-h-90 bg-transparent">
                        {activeSection === "roadmap" ? (
                            <div className="space-y-3.5">
                                {activeContent.items.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3.5 group rounded-xl border-2 border-[#d1e1ff] bg-linear-to-br from-white via-[#f5f9ff] to-[#e6f0ff] p-4 shadow-[0_10px_18px_rgba(29,70,159,0.08)] hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(29,70,159,0.20)] transition-all duration-300">
                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#1d469f] to-[#2f68ea] text-white flex items-center justify-center shrink-0 mt-0.5 border border-[#12367f] font-bold text-sm shadow-[0_4px_10px_rgba(29,70,159,0.25)]">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5 text-[#1d469f] text-[11px] font-semibold tracking-widest uppercase bg-[#eaf2ff] rounded-full w-max px-2.5 py-1">
                                                <CheckIcon />
                                                Week {index + 1}
                                            </div>
                                            <p className="m-0 mt-2 text-[#0f255c] text-[15px] font-semibold leading-relaxed">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {normalizedQuestions.map((item, index) => (
                                    <article
                                        key={`${item.question}-${index}`}
                                        className="rounded-xl border-2 border-[#d1e1ff] bg-linear-to-br from-white via-[#f5f9ff] to-[#e6f0ff] overflow-hidden shadow-[0_10px_20px_rgba(29,70,159,0.08)] hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(29,70,159,0.20)] transition-all duration-300 group"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenQuestionIndex((prev) => (prev === index ? null : index))}
                                            className="w-full flex items-start gap-3.5 p-4 text-left bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] border-none cursor-pointer hover:bg-[linear-gradient(180deg,#f5f9ff_0%,#eaf2ff_100%)]"
                                        >
                                            <div className="p-2 rounded-lg mt-0.5 bg-[#eaf2ff] text-[#1d469f] shrink-0">
                                                <LightbulbIcon />
                                            </div>
                                            <div className="flex-1">
                                                <p className="m-0 text-[#0f255c] text-[15px] font-bold leading-relaxed">{item.question}</p>
                                                <span className="inline-block mt-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5875ad] bg-[#e6eef8] rounded-full px-2.5 py-1">
                                                    {openQuestionIndex === index ? '✕ Hide Details' : '➜ More Details'}
                                                </span>
                                            </div>
                                            <span className={`mt-1 text-[#1d469f] transition-transform duration-300 shrink-0 ${openQuestionIndex === index ? "rotate-90" : ""}`}>
                                                <ChevronRightIcon />
                                            </span>
                                        </button>

                                        {openQuestionIndex === index ? (
                                            <div className="px-4 pb-4 pt-3 border-t-2 border-[#d7e5ff] bg-[linear-gradient(135deg,#eef5ff_0%,#f7fbff_100%)] animate-fade-up">
                                                <div className="rounded-xl border-2 border-[#d9e6ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(231,241,255,0.92)_100%)] p-4 shadow-[0_8px_16px_rgba(35,72,148,0.08)] mb-3 hover:shadow-[0_12px_22px_rgba(35,72,148,0.12)] transition-all">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="p-1.5 rounded-lg bg-[#eaf2ff] text-[#1d469f]">
                                                            <LightbulbIcon />
                                                        </span>
                                                        <p className="m-0 text-[11px] font-bold tracking-[0.12em] uppercase text-[#1d469f]">What they're testing</p>
                                                    </div>
                                                    <p className="mt-2 mb-0 text-[13px] text-[#0f255c] leading-relaxed font-medium">
                                                        {item.intention || "Intention details are not available for this question."}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border-2 border-[#d9e6ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(231,241,255,0.92)_100%)] p-4 shadow-[0_8px_16px_rgba(35,72,148,0.08)] hover:shadow-[0_12px_22px_rgba(35,72,148,0.12)] transition-all">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="p-1.5 rounded-lg bg-[#eaf2ff] text-[#1d469f]">
                                                            <TrendingUpIcon />
                                                        </span>
                                                        <p className="m-0 text-[11px] font-bold tracking-[0.12em] uppercase text-[#1d469f]">Suggested approach</p>
                                                    </div>
                                                    <p className="mt-2 mb-0 text-[13px] text-[#0f255c] leading-relaxed font-medium">
                                                        {item.answer || "Answer guidance is not available for this question yet."}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : null}
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <aside className="bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(212,228,255,0.16)_100%)] border border-[rgba(205,224,255,0.32)] rounded-[20px] p-5 shadow-[0_12px_28px_rgba(4,10,35,0.15)]">
                    <div className="text-xs font-semibold tracking-[0.22em] uppercase text-[#1d469f] mb-4 flex items-center gap-2">
                        <BoltIcon />
                        Skill Gaps
                    </div>
                    <div className="grid gap-3">
                        {normalizedSkillGaps.map((item, index) => {
                            const severityBadgeClass = item.severity === "high"
                                ? "bg-[#dbeafe] text-[#1d4ed8] border-[#93c5fd]"
                                : item.severity === "low"
                                    ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                                    : "bg-[#e0f2fe] text-[#0284c7] border-[#7dd3fc]";

                            return (
                                <div
                                    key={`${item.skill}-${index}`}
                                    className="rounded-lg border border-[#c7dcff] bg-[rgba(255,255,255,0.62)] p-3.5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="m-0 text-sm font-semibold leading-tight text-[#1e3a8a]">
                                            {item.skill}
                                        </p>
                                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${severityBadgeClass}`}>
                                            {item.severity}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>
            </div>

            {/* Road Map Section */}
            <div className="mb-10">
                <div className="bg-white border border-black/20 rounded-xl overflow-hidden hover:border-black/40 transition-all duration-300">
                    <div className="px-6 py-4 bg-white border-b border-black/15">
                        <h2 className="text-xl font-semibold text-[#101114]">Report Summary</h2>
                    </div>
                    <div className="p-5 text-sm text-[#7f8792] leading-relaxed">
                        Click a section on the left to load its content in the main panel. Your skill gaps remain visible on the right for quick reference.
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 text-center border-t border-black/15">
                <p className="text-sm text-[#7f8792]">
                    This assessment is designed to guide your preparation and highlight areas for continued growth
                </p>
            </div>
        </>
    );
};

const InterviewReport = ({ reportData, inline = false }) => {
    const location = useLocation();
    const data = reportData || location?.state?.reportData || {
        matchScore: 85,
        technicalQuestions: [
            {
                question: "Explain how Redis works and its common use cases in modern applications.",
                intention: "Checks your understanding of caching, persistence models, and practical usage patterns.",
                answer: "Redis is an in-memory data store used for caching, pub/sub, sessions, and queues. It supports persistence via RDB/AOF and offers structures like strings, hashes, and sets.",
            },
            {
                question: "What are message queues and how would you implement one using RabbitMQ or Kafka?",
                intention: "Evaluates async architecture thinking and reliability in distributed systems.",
                answer: "Message queues decouple producers and consumers. With RabbitMQ, I use exchanges/queues with ACK and retries; with Kafka, I design partition strategy and consumer groups for scale.",
            },
        ],
        behavioralQuestions: [
            {
                question: "Tell me about a time when you had to collaborate with a cross-functional team.",
                intention: "Measures communication and alignment across multiple stakeholders.",
                answer: "I align on goals first, define ownership, communicate tradeoffs early, and track progress via short feedback loops until delivery.",
            },
            {
                question: "Describe a conflict you encountered with a teammate or stakeholder.",
                intention: "Tests conflict resolution maturity and accountability.",
                answer: "I focused on facts and shared objectives, clarified assumptions, proposed options, and agreed on a measurable path forward.",
            },
        ],
        skillGaps: [
            { skill: "Redis", severity: "high" },
            { skill: "Message Queue", severity: "medium" },
            { skill: "Event Loop", severity: "low" },
        ],
        roadmap: [
            "Week 1: Master Redis fundamentals and caching patterns",
            "Week 2: Implement message queue systems and understand pub/sub",
            "Week 3: Deep dive into event loop and async programming",
            "Week 4: Build a complete project integrating all concepts"
        ]
    };

    if (inline) {
        return <ReportBody data={data} />;
    }

    return (
        <div className="min-h-screen bg-[#4472e5] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['Poppins',sans-serif]">
            {/* Ambient glows */}
            <div className="pointer-events-none absolute -top-20 -left-20 w-lg h-128 rounded-full bg-[radial-gradient(circle,rgba(47,104,234,0.25)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 w-md h-112 rounded-full bg-[radial-gradient(circle,rgba(68,114,229,0.2)_0%,transparent_70%)]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <ReportBody data={data} />
            </div>
        </div>
    );
};

export default InterviewReport;