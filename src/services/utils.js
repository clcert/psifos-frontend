import { logout } from "../utils/utils";

export function checkResponse(resp) {
    /**
     * Check the response of the fetch request
     * @param {Response} resp - The response object from the fetch request
     * @returns {Promise<{resp: Response, jsonResponse: any}>} - The response object and the json response
     */
    if (resp.status === 200) {
      return resp.json().then((jsonResponse) => {
        return { resp: resp, jsonResponse: jsonResponse };
      });
    } else if (resp.status === 403) {
      logout();
    } else {
      throw new Error("Error: " + resp.status);
    }
  }