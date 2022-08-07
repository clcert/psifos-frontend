import { backendIP } from "../server";
import { logout } from "../utils/utils";

async function getElection(uuid) {
  /**
   * async function to get the election data
   */

  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/get-election/" + uuid, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
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

async function getElections() {
  /**
   * Get all elections for the current admin
   */

  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/get-elections", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    return { resp: resp, jsonResponse: jsonResponse };
  } else if (resp.status === 401) {
    //logout();
  }
}

async function getStats(uuid) {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/get-election-stats/" + uuid, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
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

export { getElection, getElections, getStats };
