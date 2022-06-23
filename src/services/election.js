import { backendIP } from "../server";

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
  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

export { getElection }