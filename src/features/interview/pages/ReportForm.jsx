import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { generateInterviewReport, getMyInterviewReports } from "../services/interview.api";
import InterviewReport from "./Result";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const reportHighlights = [
    {
        title: "Role Match Score",
        description: "See how closely your profile aligns with the target role and where you stand today.",
    },
    {
        title: "Interview Questions",
        description: "Get technical and behavioral questions that are likely to appear in your interview.",
    },
    {
        title: "Prep Roadmap",
        description: "Receive a practical roadmap with skill-priority focus and next preparation actions.",
    },
];

const normalizeReportData = (report) => {
    const technicalQuestions = Array.isArray(report?.interviewQuestion)
        ? report.interviewQuestion
            .map((item) => {
                if (typeof item === "string") {
                    return { question: item, intention: "", answer: "" };
                }

                return {
                    question: item?.question ?? "",
                    intention: item?.intention ?? "",
                    answer: item?.answer ?? "",
                };
            })
            .filter((item) => item.question)
        : [];

    const behavioralQuestions = Array.isArray(report?.behavioralQuestions)
        ? report.behavioralQuestions
            .map((item) => {
                if (typeof item === "string") {
                    return { question: item, intention: "", answer: "" };
                }

                return {
                    question: item?.question ?? "",
                    intention: item?.intention ?? "",
                    answer: item?.answer ?? "",
                };
            })
            .filter((item) => item.question)
        : [];

    const skillGaps = Array.isArray(report?.skillGaps)
        ? report.skillGaps
            .map((item) => {
                if (typeof item === "string") {
                    return { skill: item, severity: "medium" };
                }
                if (!item?.skill) {
                    return null;
                }
                return {
                    skill: item.skill,
                    severity: item?.severity || "medium",
                };
            })
            .filter(Boolean)
        : [];

    const roadmap = Array.isArray(report?.preparationPlan)
        ? report.preparationPlan
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }
                const day = Number.isFinite(Number(item?.day)) ? `Day ${item.day}: ` : "";
                const focus = item?.focus ?? "";
                const tasks = Array.isArray(item?.tasks) && item.tasks.length > 0
                    ? ` - ${item.tasks.join(", ")}`
                    : "";
                const value = `${day}${focus}${tasks}`.trim();
                return value || null;
            })
            .filter(Boolean)
        : [];

    return {
        matchScore: Number(report?.matchScore) || 0,
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        roadmap,
    };
};

const formatReportDate = (value) => {
    if (!value) {
        return "Recently saved";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Recently saved";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getReportTitle = (report) => {
    const jobDescription = report?.jobDescription?.trim();

    if (!jobDescription) {
        return "Untitled report";
    }

    return jobDescription.length > 72 ? `${jobDescription.slice(0, 72).trim()}...` : jobDescription;
};

const ReportForm = () => {
    const fileRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const reportPreviewRef = useRef(null);

    const [jobDesc, setJobDesc] = useState("");
    const [selfDesc, setSelfDesc] = useState("");
    const [resume, setResume] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [reportData, setReportData] = useState(null);
    const [historyReports, setHistoryReports] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [activeReportId, setActiveReportId] = useState(null);

    const filledCount = [jobDesc.trim(), selfDesc.trim(), Boolean(resume)].filter(Boolean).length;
    const canSubmit = filledCount === 3 && !loading;

    useEffect(() => {
        let isMounted = true;

        const loadReports = async () => {
            setHistoryLoading(true);
            setHistoryError("");

            try {
                const response = await getMyInterviewReports();
                if (!isMounted) {
                    return;
                }

                setHistoryReports(Array.isArray(response?.reports) ? response.reports : []);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setHistoryError(err?.response?.data?.message || "Unable to load previous reports.");
            } finally {
                if (isMounted) {
                    setHistoryLoading(false);
                }
            }
        };

        loadReports();

        return () => {
            isMounted = false;
        };
    }, []);

    const visibleHistoryReports = useMemo(() => historyReports.slice(0, 6), [historyReports]);

    const handleFile = (file) => {
        if (!file) {
            return;
        }

        const isValidType = file.type === "application/pdf";
        if (!isValidType) {
            setError("Please upload a PDF file.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("File size should be under 3MB.");
            return;
        }

        setError("");
        setResume(file);
    };

    const onDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        handleFile(file);
    };

    const onLogout = async () => {
        try {
            await handleLogout();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit) {
            return;
        }

        setLoading(true);
        setSubmitted(false);
        setError("");

        try {
            const response = await generateInterviewReport({
                jobDescription: jobDesc.trim(),
                selfDescription: selfDesc.trim(),
                resume,
            });

            const savedReport = response?.interviewReport ?? {};
            const reportData = normalizeReportData(savedReport);
            setSubmitted(true);
            setReportData(reportData);
            setActiveReportId(savedReport?._id ?? null);
            setHistoryReports((prev) => {
                const nextReports = [savedReport, ...prev.filter((item) => item?._id !== savedReport?._id)];
                return nextReports.filter(Boolean);
            });
            window.requestAnimationFrame(() => {
                reportPreviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        } catch (err) {
            const message = err?.response?.data?.message || "Unable to generate report. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateNewReport = () => {
        setReportData(null);
        setSubmitted(false);
        setActiveReportId(null);
        window.requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const openSavedReport = (report) => {
        if (!report) {
            return;
        }

        setReportData(normalizeReportData(report));
        setSubmitted(true);
        setError("");
        setActiveReportId(report?._id ?? null);
    };

    return (
        <div className="min-h-screen bg-[#3f73e8] font-['Poppins',sans-serif] text-white p-[clamp(14px,2vw,22px)_clamp(12px,2vw,20px)_28px] relative overflow-hidden">
            <div className="max-w-265 mx-auto relative pt-20 sm:pt-22">
                <div className="absolute -top-[14%] -left-[8%] w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none animate-float-soft" />
                <div className="absolute -bottom-[16%] -right-[7%] w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(18,35,96,0.08)_0%,transparent_70%)] pointer-events-none animate-float-soft" />

                <header className="fixed top-5 left-1/2 z-50 w-[min(1100px,calc(100%-1.5rem))] -translate-x-1/2 min-h-12.5 rounded-full bg-[rgba(164,189,255,0.42)] backdrop-blur-[6px] shadow-[0_10px_30px_rgba(6,25,78,0.18),inset_0_1px_0_rgba(255,255,255,0.32)] border border-[rgba(221,233,255,0.32)] flex items-center justify-between p-[5px_clamp(16px,2.2vw,26px)] gap-1 animate-fade-up">
                    <div className="flex items-center gap-1.5 font-bold text-[clamp(17px,2vw,24px)] tracking-[0.2px] text-[#f7fbff] animate-fade-up-delay-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f2f6ff] shadow-[0_0_0_4px_rgba(255,255,255,0.06)] animate-glow-pulse" />
                        <span>InterviewAI</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-[#0f172a] font-extrabold no-underline p-[clamp(4px,0.6vw,7px)_clamp(8px,0.9vw,10px)] rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.16)] transition-colors"
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="border-none text-white bg-[#2f68ea] rounded-full p-[clamp(6px,0.9vw,8px)_clamp(18px,2.1vw,24px)] text-[clamp(13px,1.2vw,16px)] font-semibold shadow-[0_3px_10px_rgba(12,39,108,0.3)] cursor-pointer hover-zoom"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <section className="mt-[clamp(28px,2vw,70px)] max-w-4xl mx-auto text-center px-2.5 animate-fade-up">
                    <h1 className="m-0 text-[#f6f9ff] text-[clamp(30px,4vw,52px)] font-bold leading-tight">
                        Build Your Interview Input <span className="font-black text-black">Packet</span>
                    </h1>
                    <p className="mt-3 mb-0 text-[clamp(14px,1.5vw,19px)] leading-relaxed text-[#0f172a] max-w-3xl mx-auto">
                        Share your job description, resume, and profile summary to generate a personalized interview report
                        with match score, likely questions, skill gaps, and a preparation roadmap.
                    </p>
                </section>

                <section ref={formRef} className="mt-8 sm:mt-10 mx-auto w-[min(760px,100%)] rounded-[28px] border border-[rgba(255,255,255,0.34)] bg-[rgba(208,225,255,0.2)] backdrop-blur-sm shadow-[0_16px_35px_rgba(17,42,107,0.2),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[6px] p-[clamp(16px,3vw,30px)] animate-fade-up-delay-1">
                    <h2 className="m-0 text-[#f6f9ff] text-[clamp(20px,2.1vw,28px)] font-bold animate-fade-up">
                        <span className="font-black text-[#071230]">Interview Input Form</span>
                    </h2>
                    <p className="mt-2 mb-0 text-[rgba(245,241,241,0.92)] text-[clamp(12px,1.4vw,16px)] animate-fade-up-delay-1">
                        Complete all inputs carefully. Better context produces better interview suggestions.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                        <div className="animate-fade-up-delay-1">
                            <label className="block mb-1.5 text-[16px] font-semibold text-[#0e192e]">
                                Job Description
                            </label>
                            <textarea
                                rows={6}
                                value={jobDesc}
                                onChange={(event) => setJobDesc(event.target.value)}
                                placeholder="Paste role responsibilities, requirements, and company context"
                                className="w-full rounded-[14px] border border-[rgba(205,224,255,0.42)] bg-[rgba(39,77,175,0.52)] text-[#f8fbff] p-[11px_12px] text-[14px] outline-none box-border placeholder:text-[rgba(248,251,255,0.6)]"
                            />
                        </div>

                        <div className="animate-fade-up-delay-2">
                            <label className="block mb-1.5 text-[16px] font-semibold text-[#0e192e]">
                                Resume / CV
                            </label>
                            {resume ? (
                                <div className="rounded-[14px] border border-dashed border-[rgba(205,224,255,0.7)] bg-[rgba(39,77,175,0.35)] p-3.5 cursor-pointer text-left">
                                    <div className="text-[14px] font-semibold">{resume.name}</div>
                                    <div className="mt-1 text-[12px] opacity-85">
                                        {(resume.size / 1024).toFixed(1)} KB
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setResume(null)}
                                        className="mt-2 border-none  bg-transparent text-[#000000] cursor-pointer underline p-0 text-[12px]"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`rounded-[14px] border border-dashed p-3.5 cursor-pointer text-left transition-all ${dragging
                                        ? "border-white bg-[rgba(39,77,175,0.62)]"
                                        : "border-[rgba(205,224,255,0.7)] bg-[rgba(39,77,175,0.35)]"
                                        }`}
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragging(true);
                                    }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={onDrop}
                                >
                                    <div className="text-[14px] font-semibold">Drop resume here or click to upload</div>
                                    <div className="mt-1 text-[12px] opacity-85">
                                        Supported format: PDF (max 3MB)
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={(event) => handleFile(event.target.files?.[0])}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="animate-fade-up-delay-3">
                            <label className="block mb-1.5 text-[16px] font-semibold text-[#0e192e]">
                                Self Description
                            </label>
                            <textarea
                                rows={4}
                                value={selfDesc}
                                onChange={(event) => setSelfDesc(event.target.value)}
                                placeholder="Summarize your experience, strengths, and target role"
                                className="w-full rounded-[14px] border border-[rgba(205,224,255,0.42)] bg-[rgba(39,77,175,0.52)] text-[#f8fbff] p-[11px_12px] text-[14px] outline-none box-border placeholder:text-[rgba(248,251,255,0.6)]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-up-delay-4">
                            <span className="text-[12px] text-[#e8f0ff]">
                                Profile completion: {filledCount}/3
                            </span>
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className={`border-none rounded-full bg-black text-white text-[15px] font-bold px-5 py-3 cursor-pointer hover-lift ${!canSubmit ? "opacity-56 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Analyzing your profile..." : "Generate Interview Report"}
                            </button>
                        </div>
                    </form>

                    {error ? (
                        <div className="mt-4 rounded-[14px] p-3 bg-[rgba(184,36,36,0.2)] border border-[rgba(255,140,140,0.5)] text-[#ffe8e8] text-[13px] animate-fade-up">
                            {error}
                        </div>
                    ) : null}

                    {submitted ? (
                        <div className="mt-4 rounded-[14px] p-3 bg-[rgba(36,170,84,0.2)] border border-[rgba(95,213,137,0.5)] text-[#e8ffef] text-[13px] animate-fade-up">
                            Interview packet submitted successfully. Preparing your personalized report.
                        </div>
                    ) : null}
                </section>

                {reportData ? (
                    <section ref={reportPreviewRef} className="mt-8 sm:mt-10 rounded-[28px] border border-[rgba(205,224,255,0.4)] bg-[rgba(208,225,255,0.22)] backdrop-blur-sm p-[clamp(16px,3vw,30px)] shadow-[0_18px_40px_rgba(17,42,107,0.18)] animate-fade-up">
                        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                            <div>
                                <h2 className="m-0 text-[clamp(22px,2.6vw,34px)] font-bold text-[#f6f9ff] leading-tight">
                                    Your Generated Report
                                </h2>
                                <p className="mt-2 mb-0 text-[clamp(13px,1.3vw,16px)] text-[#dbe7ff] leading-relaxed">
                                    The report appears right below the form so you can review and edit the details without leaving the page.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleGenerateNewReport}
                                className="border-none rounded-full bg-[#2f68ea] text-white px-4 py-2 text-sm font-semibold shadow-[0_10px_25px_rgba(15,23,42,0.24)] hover:opacity-90"
                            >
                                Back to Form
                            </button>
                        </div>

                        <div className="animate-fade-up-delay-1">
                            <InterviewReport reportData={reportData} inline />
                        </div>
                    </section>
                ) : null}

                <section className="mt-8 sm:mt-10 mx-auto w-[min(1100px,100%)] rounded-[28px] border border-[#5a86e8] bg-[#5a86e8] shadow-[0_14px_28px_rgba(17,42,107,0.18)] p-[clamp(16px,2.6vw,26px)]">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                        <div>
                            <h2 className="m-0 text-[clamp(20px,2vw,28px)] font-bold text-[#0f255c]">
                                Previous Reports
                            </h2>
                            <p className="mt-2 mb-0 text-[13px] sm:text-[15px] text-[#dbe7ff] leading-relaxed">
                                Open any saved report for the current account. The latest six reports are shown here.
                            </p>
                        </div>
                        <div className="rounded-full border border-[rgba(205,224,255,0.38)] bg-[rgba(47,104,234,0.18)] px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-white">
                            {visibleHistoryReports.length} saved
                        </div>
                    </div>

                    {historyError ? (
                        <div className="mb-4 rounded-2xl border border-[rgba(205,224,255,0.4)] bg-[rgba(47,104,234,0.14)] px-4 py-3 text-sm text-[#e8f0ff]">
                            {historyError}
                        </div>
                    ) : null}

                    {historyLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-36 rounded-[20px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.1)] animate-pulse"
                                />
                            ))}
                        </div>
                    ) : visibleHistoryReports.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                            {visibleHistoryReports.map((report) => {
                                const isActive = activeReportId === report?._id;
                                const technicalCount = Array.isArray(report?.interviewQuestion) ? report.interviewQuestion.length : 0;
                                const behavioralCount = Array.isArray(report?.behavioralQuestions) ? report.behavioralQuestions.length : 0;
                                const skillCount = Array.isArray(report?.skillGaps) ? report.skillGaps.length : 0;

                                return (
                                    <button
                                        key={report?._id}
                                        type="button"
                                        onClick={() => openSavedReport(report)}
                                        className={`group flex h-full flex-col text-left rounded-[20px] border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(17,42,107,0.22)] ${isActive
                                            ? "border-[rgba(255,255,255,0.42)] bg-[rgba(47,104,234,0.26)] shadow-[0_14px_28px_rgba(255,255,255,0.12)]"
                                            : "border-[rgba(205,224,255,0.28)] bg-[rgba(47,104,234,0.16)]"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="m-0 text-[12px] font-bold tracking-[0.16em] uppercase text-[#dbe7ff]">
                                                    {formatReportDate(report?.createdAt)}
                                                </p>
                                                <h3 className="mt-2 mb-0 text-[18px] font-bold text-[#f6f9ff] leading-snug group-hover:text-white">
                                                    {getReportTitle(report)}
                                                </h3>
                                            </div>
                                            <div className="rounded-full border border-[rgba(205,224,255,0.34)] bg-[rgba(255,255,255,0.14)] px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(8,18,48,0.12)]">
                                                {Number(report?.matchScore) || 0}%
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-2 items-stretch">
                                            <div className="min-h-18 rounded-[14px] border border-[rgba(205,224,255,0.32)] bg-[rgba(255,255,255,0.14)] px-3 py-2 flex flex-col items-start justify-between text-left">
                                                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#e8f0ff]">Tech</div>
                                                <div className="mt-1 text-sm font-semibold text-white">{technicalCount}</div>
                                            </div>
                                            <div className="min-h-18 rounded-[14px] border border-[rgba(205,224,255,0.32)] bg-[rgba(255,255,255,0.14)] px-3 py-2 flex flex-col items-start justify-between text-left">
                                                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#e8f0ff]">Behavior</div>
                                                <div className="mt-1 text-sm font-semibold text-white">{behavioralCount}</div>
                                            </div>
                                            <div className="min-h-18 rounded-[14px] border border-[rgba(205,224,255,0.32)] bg-[rgba(255,255,255,0.14)] px-3 py-2 flex flex-col items-start justify-between text-left">
                                                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#e8f0ff]">Gaps</div>
                                                <div className="mt-1 text-sm font-semibold text-white">{skillCount}</div>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm text-[#dbe7ff]">
                                            <span>{isActive ? "Currently open" : "Click to open report"}</span>
                                            <span className="transition-transform duration-300 group-hover:translate-x-1">View</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-[20px] border border-[rgba(205,224,255,0.3)] bg-[rgba(47,104,234,0.16)] p-5 text-left text-[#e8f0ff]">
                            <h3 className="m-0 text-[18px] font-bold text-white">No previous reports yet</h3>
                            <p className="mt-2 mb-0 text-[14px] leading-relaxed text-[#dbe7ff]">
                                Once you generate a report, it will appear here for quick access later.
                            </p>
                        </div>
                    )}
                </section>

                <section className="mt-8 sm:mt-10 rounded-[26px] border border-[rgba(205,224,255,0.36)] bg-[rgba(208,225,255,0.2)] backdrop-blur-sm p-[clamp(16px,2.8vw,28px)] shadow-[0_16px_35px_rgba(17,42,107,0.18)] animate-fade-up-delay-3">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="m-0 text-[clamp(22px,2.6vw,34px)] font-bold text-[#f6f9ff]">
                            What You Will Get In Your <span className="text-[#0f172a]">Report</span>
                        </h2>
                        <p className="mt-2 mb-0 text-[clamp(13px,1.3vw,16px)] text-[#dbe7ff] leading-relaxed">
                            Once you submit the form, InterviewAI analyzes your inputs and generates a focused report you can use immediately.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {reportHighlights.map((item) => (
                            <article
                                key={item.title}
                                className="rounded-[18px] border border-[rgba(205,224,255,0.34)] bg-[rgba(255,255,255,0.14)] p-4.5 text-left hover-lift"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#dce6fb] shadow-[inset_0_0_0_1px_rgba(26,42,73,0.14)] flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-[#2f68ea]" />
                                </div>
                                <h3 className="mt-3 mb-2 text-[17px] font-bold text-[#0e192e] leading-snug">{item.title}</h3>
                                <p className="m-0 text-[14px] leading-6 text-[#dbe7ff]">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <footer className="mt-8 sm:mt-10 pb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[14px] text-[#dbe7ff] animate-fade-up-delay-4">
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
            </div>

            {loading ? (
                <div className="fixed inset-0 z-90 bg-[rgba(8,18,48,0.56)] backdrop-blur-xs flex items-center justify-center px-4">
                    <div className="w-[min(560px,100%)] rounded-3xl border border-[rgba(255,255,255,0.28)] bg-[rgba(73,114,223,0.32)] p-7 sm:p-8 text-center shadow-[0_24px_70px_rgba(3,10,34,0.45)]">
                        <div className="mx-auto w-13 h-13 rounded-full border-3 border-[rgba(255,255,255,0.26)] border-t-white animate-spin" />
                        <h3 className="mt-5 mb-2 text-[clamp(21px,2.4vw,28px)] font-bold text-white">
                            Generating Your Interview Report
                        </h3>
                        <p className="m-0 text-[clamp(13px,1.2vw,15px)] leading-relaxed text-[#dbe7ff]">
                            Analyzing your job requirements, resume, and profile to create role-specific insights.
                        </p>
                        <div className="mt-4 h-2 rounded-full bg-[rgba(255,255,255,0.22)] overflow-hidden">
                            <div className="h-full w-2/3 bg-white/90 animate-pulse" />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ReportForm;
