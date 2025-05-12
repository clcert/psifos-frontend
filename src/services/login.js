import { backendOpIP } from "../server";
import { checkResponse } from "./utils";

async function loginFetch(username, password) {
    /**
     * async function for login admin
     */

    let url = backendOpIP + "/login";
    let encoded = Buffer.from(username + ":" + password);
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " + encoded.toString("base64"),
            "Content-Type": "application/json",
        },
        credentials: "include"
    });
    return checkResponse(resp);
}

export default loginFetch;
