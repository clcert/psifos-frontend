import { backendIP } from "../server";
import logout from "./utils";

async function getElection(uuid) {
  const token = sessionStorage.getItem("token");
  const resp = await fetch(backendIP + "/get-election/" + uuid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-tokens": token,
    },
  });

  if (resp.status === 200) {
    const jsonResponse = await resp.json();
    if (jsonResponse.frozen_at === "None") {
      jsonResponse.frozen_at = null;
    }
    return jsonResponse;
  } else if (resp.status === 401) {
    logout();
  }
}

export default getElection;