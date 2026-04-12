import axios from "axios";

const DEFAULT_LOCAL_API_BASE_URL = "https://interview-test-ttcc.vercel.app/api";

const resolveApiBaseUrl = () => {
    const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (!configuredBaseUrl) {
        return DEFAULT_LOCAL_API_BASE_URL;
    }

    if (/^https:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(configuredBaseUrl)) {
        return configuredBaseUrl.replace(/^https:/i, "http:");
    }

    return configuredBaseUrl;
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
    baseURL: `${API_BASE_URL}/interview`,
    withCredentials: true,
});

export async function generateInterviewReport({ jobDescription, selfDescription, resume }) {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    if (resume) {
        formData.append("resume", resume);
    }

    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function getMyInterviewReports() {
    const response = await api.get("/mine");
    return response.data;
}

export async function downloadResumePdf(interviewReportId) {
    const response = await api.post(`/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob",
    });

    return {
        blob: response.data,
        headers: response.headers,
    };
}
