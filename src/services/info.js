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

async function getVotesInfo(uuid, page, pageSize, {voteHash, voterName, onlyValidVotes = false} = {}) {
  const url = backendInfoIp + "/election/" + uuid + "/votes";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "page": page,
      "page_size": pageSize,
      "vote_hash": voteHash,
      "voter_name": voterName,
      "only_with_valid_vote": onlyValidVotes
    }),
  });
  const data = await resp.json();
  return data;
}

export { getVotersInfo, getElectionInfo, getVotesInfo };
