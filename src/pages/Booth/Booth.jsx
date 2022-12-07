import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { backendOpIP } from "../../server";
import CabinaElection from "./Election/CabinaElection";
import Consult from "./Consult/Consult";
import NoAuth from "./NoAuth";
import LoadPage from "../../component/Loading/LoadPage";

function Booth(props) {
  /** View for booth */

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
  const [searchParams] = useSearchParams();

  /** @state {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      window.location.href = backendOpIP + "/vote/" + uuid;
    } else if (props.preview) {
      getElectionQuestionsPreview();
    } else {
      getElectionQuestions();
    }

    async function getElectionQuestionsPreview() {
      /**
       * async function to get the election data
       * check if voter can vote in election
       */

      const url = backendOpIP + "/get-election/" + uuid;
      const token = sessionStorage.getItem("token");
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      const jsonResponse = await resp.json();
      setLoad(true);
      if (resp.status === 200) {
        setElectionData(jsonResponse);
        setType(jsonResponse.election_type);
        setAuth(true);
      }
    }

    async function getElectionQuestions() {
      /**
       * async function to get the election data
       * check if voter can vote in election
       */

      const url = backendOpIP + "/" + uuid + "/questions";
      const resp = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      try {
        const jsonResponse = await resp.json();
        setLoad(true);
        if (resp.status === 200) {
          setElectionData(jsonResponse);
          setType(jsonResponse.election_type);
          setAuth(true);
        } else if (jsonResponse.detail === "Election status check failed") {
          setNoAuthMessage("La elección se encuentra cerrada");
        } else {
          setNoAuthMessage(
            "La elección no existe o no estas habilitado para votar en ella"
          );
        }
      } catch (err) {
        setLoad(true);
        setNoAuthMessage(
          "La elección no existe o no estas habilitado para votar en ella"
        );
      }
    }
  }, [props.preview, searchParams, uuid]);

  if (!load) {
    return <LoadPage />;
  } else if (!auth) {
    return (
      <NoAuth
        title={"Cabina de votación"}
        message={noAuthMessage}
        adressLogout={backendOpIP + "/vote/" + uuid + "/logout"}
      ></NoAuth>
    );
  } else if (load) {
    return type === "Query" ? (
      <Consult consultData={electionData}></Consult>
    ) : (
      <CabinaElection
        preview={props.preview}
        electionData={electionData}
      ></CabinaElection>
    );
  }
}

export default Booth;
