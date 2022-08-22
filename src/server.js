let backendIP = "APP_BACKEND_HOST"
let backendHeliosIP = "APP_BACKEND_HELIOS_HOST"
let frontIP = "APP_FRONTEND_HOST"

backendIP = backendIP !== "APP_BACKEND_HOST" ? backendIP : "http://localhost:8000"
backendHeliosIP = backendHeliosIP !== "APP_BACKEND_HELIOS_HOST" ? backendHeliosIP : "http://localhost:8000"
frontIP = frontIP !== "APP_FRONTEND_HOST" ? frontIP : "http://localhost:3000"

export { backendIP, backendHeliosIP, frontIP };
