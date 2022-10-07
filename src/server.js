let backendOpIP = "APP_BACKEND_OP_URL"
let backendInfoIp = "APP_BACKEND_INFO_URL"
let frontIP = "APP_FRONTEND_URL"


backendOpIP = backendOpIP !== "APP_BACKEND_OP_URL" ? backendOpIP : "http://localhost:8000"
backendInfoIp = backendInfoIp !== "APP_BACKEND_INFO_URL" ? backendInfoIp : "http://localhost:8001"
frontIP = frontIP !== "APP_FRONTEND_URL" ? frontIP : "http://localhost:3000/psifos"

export { backendOpIP, backendInfoIp, frontIP };
