import { backendInfoIp, backendOpIP } from "../server";
import { logout } from "../utils/utils";

async function getElection(uuid) {
  /**
   * async function to get the election data
   */

  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendOpIP + "/get-election/" + uuid, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    return { resp: resp, jsonResponse: jsonResponse };
  } else if (resp.status === 403) {
    logout();
  }
}
async function getElectionPublic(uuid) {
  /**
   * async function to get the election data
   */

  const resp = await fetch(backendInfoIp + "/election/" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    return { resp: resp, jsonResponse: jsonResponse };
  }
}

async function getElections() {
  /**
   * Get all elections for the current admin
   */

  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendOpIP + "/get-elections", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    return { resp: resp, jsonResponse: jsonResponse };
  } else if (resp.status === 403) {
    logout();
  }
}

async function getStats(uuid) {
  const resp = await fetch(backendInfoIp + "/get-election-stats/" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    return { resp: resp, jsonResponse: jsonResponse };
  }
}

export { getElection, getElectionPublic, getElections, getStats };
