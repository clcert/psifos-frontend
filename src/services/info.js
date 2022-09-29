import { backendInfoIp } from "../server";

async function getVotersInfo(uuid) {
  const url = backendInfoIp + "/election/" + uuid + "/cast-votes";
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data;
}

async function getElectionInfo(uuid) {
  const url = backendInfoIp + "/election/" + uuid;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data;
}

async function getVotesInfo(uuid, init, end, vote_hash) {
  const url = backendInfoIp + "/election/" + uuid + "/votes";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "init": init,
      "end": end,
      "vote_hash": vote_hash
    }),
  });
  const data = await resp.json();
  return data;
}

export { getVotersInfo, getElectionInfo, getVotesInfo };
