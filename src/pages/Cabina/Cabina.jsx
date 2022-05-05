import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { backendIP } from "../../server";
import CabinaElection from "./Election/CabinaElection";
import Consult from "./Consult/Consult";
import NoAuth from "./NoAuth";

function Cabina() {
  /** View for cabina */

  /** @state {string} type of election */
  const [type, setType] = useState("");

  /** @state {bool} state of load election */
  const [load, setLoad] = useState(false);

  /** @state {bool} state auth to vote in election */
  const [auth, setAuth] = useState(false);

  /** @state {array} info election (questions) */
  const [electionData, setElectionData] = useState([]);

  /** @state {string} message user feedback */
  const [noAuthMessage, setNoAuthMessage] = useState("");

  /** @state {bool}  */
  const [searchParams, setSearchParams] = useSearchParams();

  /** @state {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      window.location.href = backendIP + "/vote/" + uuid;
    }

    async function getElectionQuestions() {
      /**
       * async function to get the election data
       * check if voter can vote in election
       */

      const url = backendIP + "/" + uuid + "/questions";
      const resp = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      try {
        const jsonResponse = await resp.json();
        setLoad(true);
        if (resp.status === 200) {
          setElectionData({});
          setAuth(true);
        } else {
          setNoAuthMessage(
            "La elección no exite o no estas habilitado para votar en ella"
          );
        }
      } catch (err) {
        setLoad(true);
        setNoAuthMessage(
          "La elección no exite o no estas habilitado para votar en ella"
        );
      }
    }
    getElectionQuestions();
  }, []);

  if (!load) {
    return <>LOAD</>;
  } else if (!auth) {
    return <NoAuth message={noAuthMessage}></NoAuth>;
  } else if (load) {
    return type === "Query" ? (
      <Consult></Consult>
    ) : (
      <CabinaElection></CabinaElection>
    );
  }
}

export default Cabina;
