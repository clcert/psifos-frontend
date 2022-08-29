import { backendIP } from "../server";

async function getEgParams(uuid) {
    /**
     * async function to get the eg params
     * @returns {object} data response
     */
    const url = backendIP + "/" + uuid + "/get-eg-params";

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  async function getCheckSk(uuid, uuidTrustee) {
    const url = backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/check-sk";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }

export { getEgParams, getCheckSk }  


