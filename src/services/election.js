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

async function getStatsGroup(shortName, group) {
  group = group === "Sin grupo" ? "" : group;
  const resp = await fetch(backendInfoIp + "/get-election-group-stats/" + shortName, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      group: group
    })
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

async function initElection(shortName) {
  /**
   * Init election
   */

  const token = localStorage.getItem("token");
  const url = backendOpIP + "/" + shortName + "/start-election";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 403) {
    logout();
  }
  return resp
}

async function closeElection(shortName) {
  /**
   * Init election
   */

  const token = localStorage.getItem("token");
  const url = backendOpIP + "/" + shortName + "/end-election";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 403) {
    logout();
  }
  return resp
}

async function computeTally(shortName) {
  /**
   * Compute tally election
   */

  const token = localStorage.getItem("token");
  const url = backendOpIP + "/" + shortName + "/compute-tally";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 403) {
    logout();
  }
  return resp
}

async function combineDecryptions(shortName) {
  /**
   * Combine decryptions
   */

  const token = localStorage.getItem("token");
  const url = backendOpIP + "/" + shortName + "/combine-decryptions";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 403) {
    logout();
  }
  return resp
}

export {
  getElection,
  getElectionPublic,
  getElections,
  getStats,
  getStatsGroup,
  getElectionResume,
  initElection,
  closeElection,
  computeTally,
  combineDecryptions,
};
