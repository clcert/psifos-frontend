import { backendIP } from "../server";

async function getElection(uuid) {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/get_election/" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-tokens": token,
    },
  });

  const jsonResponse = await resp.json();
  if (jsonResponse.frozen_at === "None") {
    jsonResponse.frozen_at = null;
  }
  return jsonResponse;
}

export default getElection;
