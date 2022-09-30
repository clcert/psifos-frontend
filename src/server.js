let backendOpIP = "APP_BACKEND_OP_HOST"
let backendInfoIp = "APP_BACKEND_INFO_HOST"
let frontIP = "APP_FRONTEND_HOST"


backendOpIP = backendOpIP !== "APP_BACKEND_OP_HOST" ? backendOpIP : "http://localhost:8000/psifos/api/app"
backendInfoIp = backendInfoIp !== "APP_BACKEND_INFO_HOST" ? backendInfoIp : "http://localhost:8001/psifos/api/public"
frontIP = frontIP !== "APP_FRONTEND_HOST" ? frontIP : "http://localhost:3000/psifos"

export { backendOpIP, backendInfoIp, frontIP };
