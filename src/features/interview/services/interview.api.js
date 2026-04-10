import axios from "axios";

const api = axios.create({
    baseURL: "https://interview-test-eosin-three.vercel.app/api/interview",
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