# Interview AI Frontend

Frontend application for Interview AI.

This client app lets users:
- Register and login
- Submit interview details (resume, self-description, and job description)
- Generate AI-based interview reports
- View previously generated reports

## Important Repositories

- Frontend Repository: This repository
- Backend Repository: https://github.com/sankalppanchabhai123/interview_Test

If you are running this project for the first time, please set up and run the backend first, then start the frontend.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Prerequisites

Install these before starting:
- Node.js (recommended: latest LTS)
- npm
- Running backend API from this repository:
	https://github.com/sankalppanchabhai123/interview_Test

## Quick Start (New Users)

1. Clone frontend repository.
2. Open the frontend folder.
3. Install dependencies:
	 npm install
4. Create environment file:
	 - Create a file named .env in the frontend root.
	 - Add your API base URL, for example:
		 VITE_API_BASE_URL=http://localhost:3000
5. Start development server:
	 npm run dev
6. Open the local URL shown in terminal (usually http://localhost:5173).

## Build for Production

- Create production build:
	npm run build
- Preview production build locally:
	npm run preview

## Notes for Client / Reviewer

- Frontend depends on backend APIs for authentication and report generation.
- If pages load but API actions fail, check backend server status and frontend environment variables.
- Ensure CORS and API URL are configured correctly in both frontend and backend.

## Support

If you need backend setup details, please use:
https://github.com/sankalppanchabhai123/interview_Test
