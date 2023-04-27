import Step1Descript from "./VerifyInstructions/Step1Descript"
import Step2Descript from "./VerifyInstructions/Step2Descript"
import Step3Descript from "./VerifyInstructions/Step3Descript"

function EnabledVerification({linkResumen="https://www.google.com.ar/"}) {

  return (
      <>
          <div className="has-text-centered title is-size-4-mobile">
              Verificación del resultado
          </div>
          <hr />
          
          <Step1Descript linkResumen={linkResumen}/>
          <Step2Descript />
          <Step3Descript />
      </>
  )
}

function DisabledVerification() {
  return (
      <div className="box" id="not-results-box">
          <p className="is-size-3 has-text-weight-bold">
              Elección aun no finaliza.
          </p>
      </div>
  )
}

function VerifyElection() {
  const finishedElection = true;
  return (
    <div>
      {
        finishedElection ? <EnabledVerification /> : <DisabledVerification />
      }
    </div>
    
  )
}

export default VerifyElection;
