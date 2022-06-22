import { backendIP } from "../server";

async function get_eg_params(uuid) {
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

export { get_eg_params }    