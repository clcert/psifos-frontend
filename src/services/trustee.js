import { backendOpIP } from "../server";

async function getTrustee(uuidTrustee) {
  /**
   * async function to get the trustee
   * set the trustee in the state (params)
   * @returns {object} trustee
   */
  const resp = await fetch(backendOpIP + "/" + uuidTrustee + "/get-trustee", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

async function getTrustees(shortName) {
  /**
   * async function to get the trustees
   * set the trustees list
   */
  const token = localStorage.getItem("token");
  const resp = await fetch(backendOpIP + "/" + shortName + "/get-trustees", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

async function getTrusteePanel() {
  const url = backendOpIP + "/trustee/panel";
  const resp = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

async function getTrusteeCrypto(shortName) {
  const url = backendOpIP + "/" + shortName + "/trustee/crypto";
  const resp = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

export { getTrustee, getTrustees, getTrusteePanel, getTrusteeCrypto };
