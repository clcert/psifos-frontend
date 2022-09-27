let backendOpIP = "APP_BACKEND_OP_HOST"
let backendInfoIp = "APP_BACKEND_INFO_HOST"
let backendHeliosIP = "APP_BACKEND_HELIOS_HOST"
let frontIP = "APP_FRONTEND_HOST"


backendOpIP = backendOpIP !== "APP_BACKEND_OP_HOST" ? backendOpIP : "http://localhost:8000"
backendInfoIp = backendInfoIp !== "APP_BACKEND_INFO_HOST" ? backendInfoIp : "http://localhost:5000"
backendHeliosIP = backendHeliosIP !== "APP_BACKEND_HELIOS_HOST" ? backendHeliosIP : "http://localhost:8000"
frontIP = frontIP !== "APP_FRONTEND_HOST" ? frontIP : "http://localhost:3000"

export { backendOpIP, backendInfoIp, backendHeliosIP, frontIP };
