import { backendIP } from "../server";

async function getElection(uuid) {
  const resp = await fetch(backendIP + "/elections/" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const jsonResponse = await resp.json();
  if (jsonResponse.frozen_at === "None") {
    jsonResponse.frozen_at = null;
  }
  return jsonResponse;
}

export default getElection;
