import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStats } from "../../../services/election";
import { electionStatus } from "../../../constants";
import NotAvalaibleMessage from "../components/NotAvalaibleMessage"
import Step1Descript from "./VerifyInstructions/Step1Descript"
import Step2Descript from "./VerifyInstructions/Step2Descript"
import Step3Descript from "./VerifyInstructions/Step3Descript"


function EnabledVerification() {
  return (
    <>
      <div className="has-text-centered title is-size-4-mobile">
        Verificación del resultado
      </div>
      <hr />

      <Step1Descript />
      <Step2Descript />
      <Step3Descript />
    </>
  );
}

function VerifyElection() {
  const [status, setStatus] = useState("");

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  useEffect(() => {
    getStats(shortName).then((response) => {
      const { resp, jsonResponse } = response;
      if (resp.status === 200) {
        setStatus(jsonResponse.status);
      }
    });
  }, [shortName]);
  const finishedElection =
    status === electionStatus.decryptionsCombined;
  return (
    <div>
      {finishedElection ? (
        <EnabledVerification />
      ) : (
        <NotAvalaibleMessage
          message="Elección no finalizada"
        />
      )}
    </div>
  );
}

export default VerifyElection;
