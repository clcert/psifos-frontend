import { backendOpIP } from "../server";

async function getUserRole() {
  /**
   * async function to get the user role
  */
   const token = localStorage.getItem("token");
  const resp = await fetch(backendOpIP + "/get-role", {
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

export { getUserRole };
