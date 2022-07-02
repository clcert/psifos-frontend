import { backendIP } from "../server";
import logout from "../utils/utils";

async function getElection(uuid) {
  /**
   * async function to get the election data
   */

  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/get-election/" + uuid, {
    method: "GET",
    headers: {
      "x-access-tokens": token,
      "Content-Type": "application/json",
    },
  });
  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    return { resp: resp, jsonResponse: jsonResponse };
  } else if (resp.status === 401) {
    logout();
  }
}

export { getElection };
