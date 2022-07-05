const backendIP = process.env.APP_BACKEND_HOST || "http://localhost:5000";
const backendHeliosIP = process.env.APP_BACKEND_HELIOS_HOST || "http://localhost:8000";
const frontIP = process.env.APP_FRONTEND_HOST || "http://localhost:3000";
export { backendIP, backendHeliosIP, frontIP };
