import { backendInfoIp, backendOpIP } from "../server";
import { logout } from "../utils/utils";

async function getElection(shortName) {
  /**
   * async function to get the election data
   */

  const token = localStorage.getItem("token");
  const resp = await fetch(backendOpIP + "/get-election/" + shortName, {
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
async function getElectionPublic(shortName) {
  /**
   * async function to get the election data
   */

  const resp = await fetch(backendInfoIp + "/election/" + shortName, {
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

  const token = localStorage.getItem("token");
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

async function getStats(shortName) {
  const resp = await fetch(backendInfoIp + "/get-election-stats/" + shortName, {
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

async function getElectionResume(shortName) {
  /**
   * async function to get the election data
   */

  const resp = await fetch(backendInfoIp + "/" + shortName + "/resume", {
    method: "GET",
    headers: {
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

export { getElection, getElectionPublic, getElections, getStats, getElectionResume };
