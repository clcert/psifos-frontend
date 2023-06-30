import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FooterParticipa from "../../../../component/Footers/FooterParticipa";
import LoadPage from "../../../../component/Loading/LoadPage";
import TitlePsifos from "../../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../../component/ShortNavBar/MyNavbar";
import { backendOpIP } from "../../../../server";
import { getTrusteeHome } from "../../../../services/trustee";
import NoAuth from "../../../Booth/NoAuth";
import GenerationProcess from "./GenerationProcess";
import GenerationDone from "./GenerationDone";

function Header({
  linkExit, linkInit, electionName
}) {
    return (
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar
              linkExit={linkExit}
              linkInit={linkInit}
            />
            <TitlePsifos
              namePage="Portal de Custodio de Clave"
              nameElection={electionName}
            />
          </div>
        </section>
    )
}

function Body({
    mustGenerate, shortName, uuidTrustee,
    publicKey, currentStep, electionStatus, decryptions,
}){
    const disabledButton2 = !publicKey

    const disabledButton3 = Boolean(
        currentStep === 4 &&
        electionStatus === "Tally computed" &&
        decryptions === null
        ? false
        : true
    );
    return (
        <section className="section" id="drawing-section">
          <div className="container has-text-centered is-max-desktop">
            <div>
                {mustGenerate ? <GenerationProcess
                    shortName={shortName}
                    uuidTrustee={uuidTrustee}
                /> : <GenerationDone
                    // disabledButton2={disabledButton2}
                    // disabledButton3={disabledButton3}
                    disabledButton2={false}
                    disabledButton3={false}
                    verifyLink={`/psifos/${shortName}/trustee/${uuidTrustee}/check-sk`}
                    decryptLink={`/psifos/${shortName}/trustee/${uuidTrustee}/decrypt-and-prove`}
                />}
            </div>
          </div>
        </section>
    )
}

function HomeContent({
    linkExit, linkInit, election, shortName, uuidTrustee, generatedKey,
    currentStep, electionStatus, decryptions,
}) {
    return (
        <div id="content-trustees">
        <Header
            linkExit={linkExit}
            linkInit={linkInit}
            electionName={election.name}
        />
        <Body
            mustGenerate={!generatedKey}
            shortName={shortName}
            uuidTrustee={uuidTrustee}
            publicKey={true}
            currentStep={currentStep}
            electionStatus={electionStatus}
            decryptions={decryptions}
        />
        <section style={{ height: '60px' }}/>
        <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />        
      </div>
    )
}

function CustodioHome(props) {
  const [trustee, setTrustee] = useState([]);
  const [election, setElection] = useState([]);
  const [load, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [noAuthMessage, setNoAuthMessage] = useState("");

  /** @state {bool}  */
  const [searchParams] = useSearchParams();

  const { shortName, uuidTrustee } = useParams();

  useEffect(() => {
    if (searchParams.get("logout") === "true") { 
      window.location.href = `${backendOpIP}/${shortName}/trustee/login`;
    }
    getTrusteeHome(shortName, uuidTrustee).then((data) => {
      try {
        const { resp, jsonResponse } = data;

        setLoad(true);
        if (resp.status === 200) {
          setAuth(true);
          setTrustee(jsonResponse.trustee);
          setElection(jsonResponse.election);
        } else {
          setNoAuthMessage(
            "La elección no existe o no estas habilitado para generar llaves en ella"
          );
        }
      } catch (err) {
        setLoad(true);
        setNoAuthMessage(
          "La elección no existe o no estas habilitado para generar llaves en ella"
        );
      }
    });
  }, [searchParams, shortName, uuidTrustee]);

  return (
    !load ? <LoadPage />
    : (
        !auth ? ( <NoAuth
            title={"Custodio de Claves"}
            message={noAuthMessage}
            adressLogout={`${backendOpIP}/${shortName}/trustee/logout`}
        /> ) : ( <HomeContent
            linkExit={`${backendOpIP}/${shortName}/trustee/logout`}
            linkInit={`/${shortName}/trustee/${uuidTrustee}/home`}
            election={election}
            shortName={shortName}
            uuidTrustee={uuidTrustee}
            generatedKey={Boolean(trustee.public_key && !(
                trustee.current_step >= 0 && trustee.current_step < 3
            ))}
            currentStep={trustee.current_step}
            electionStatus={election.election_status}
            decryptions={trustee.decryptions}
        /> )
    )
  )
}

export default CustodioHome;
