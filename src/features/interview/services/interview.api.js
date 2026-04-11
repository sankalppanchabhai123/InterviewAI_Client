import axios from "axios";

const API_BASE_URL = "https://interview-test-ttcc.vercel.app/api";

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
