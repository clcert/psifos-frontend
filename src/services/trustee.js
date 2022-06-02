import { backendIP } from "../server";

async function getTrustee(uuidTrustee) {
  /**
   * async function to get the trustee
   * set the trustee in the state (params)
   * @returns {object} trustee
   */
  const resp = await fetch(backendIP + "/" + uuidTrustee + "/get-trustee", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

async function getTrustees(uuid) {
  /**
   * async function to get the trustees
   * set the trustees list
   */
  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/" + uuid + "/get-trustees", {
    method: "GET",
    headers: {
      "x-access-tokens": token,
      "Content-Type": "application/json",
    },
  });

  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

async function getTrusteeHome(uuid, uuidTrustee) {
  console.log("uwu")
  const url = backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/home";
  const resp = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const jsonResponse = await resp.json();
  return { resp: resp, jsonResponse: jsonResponse };
}

export { getTrustee, getTrustees, getTrusteeHome };
