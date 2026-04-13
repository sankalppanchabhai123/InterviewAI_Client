import React from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

const getErrorDetails = (error) => {
    if (!error) {
        return {
            statusCode: 404,
            title: "Page Not Found",
            message: "The page you are looking for does not exist or may have been moved.",
        };
    }

    if (isRouteErrorResponse(error)) {
        return {
            statusCode: error.status,
            title: error.statusText || "Something went wrong",
            message: typeof error.data === "string" ? error.data : "A client-side routing error occurred.",
        };
    }

    return {
        statusCode: 500,
        title: "Unexpected Error",
        message: error?.message || "An unexpected client-side error occurred.",
    };
};

const ErrorPage = ({ statusCode, title, message }) => {
    const navigate = useNavigate();
    const routeError = useRouteError();
    const details = getErrorDetails(routeError);

    const finalStatusCode = statusCode || details.statusCode;
    const finalTitle = title || details.title;
    const finalMessage = message || details.message;

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate("/");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#4e97e6] font-['Poppins',sans-serif]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_45%)]" />
            <div className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-[#6bacef] opacity-55 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[#367dd6] opacity-45 blur-2xl" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-8">
                <div className="w-full max-w-5xl text-center">
                    <div className="mx-auto flex w-full max-w-4xl items-end justify-center gap-2 sm:gap-5">
                        <span className="select-none text-[7.2rem] font-black leading-none text-[#eef7ff] [text-shadow:-18px_18px_0_#0a0d16] sm:text-[12rem] lg:text-[15rem]">
                            4
                        </span>
                        <span className="relative select-none text-[7.2rem] font-black leading-none text-white [text-shadow:-18px_18px_0_#0a0d16] sm:text-[12rem] lg:text-[15rem]">
                            0
                            <span className="absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-[#0a0d16]" />
                        </span>
                        <span className="select-none text-[7.2rem] font-black leading-none text-[#eef7ff] [text-shadow:-18px_18px_0_#0a0d16] sm:text-[12rem] lg:text-[15rem]">
                            4
                        </span>
                    </div>

                    <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.14)] px-5 py-6 text-center backdrop-blur-[2px] sm:px-8">
                        <p className="m-0 text-xs font-semibold uppercase tracking-[0.24em] text-[#ecf4ff] sm:text-sm">Error {finalStatusCode}</p>
                        <h1 className="mb-0 mt-3 text-2xl font-extrabold leading-tight text-white sm:text-4xl">{finalTitle}</h1>
                        <p className="mb-0 mt-3 text-sm leading-relaxed text-[#eef5ff] sm:text-base">{finalMessage}</p>

                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="mt-6 inline-flex items-center justify-center rounded-full border border-[#0d1830] bg-white px-6 py-2.5 text-sm font-bold text-[#183f9d] shadow-[0_9px_0_#0d1830] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eaf3ff] hover:shadow-[0_11px_0_#0d1830] active:translate-y-0 active:shadow-[0_7px_0_#0d1830] sm:text-base"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;