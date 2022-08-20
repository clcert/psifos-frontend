import Title from "../../../component/OthersComponents/Title";
import InfoConsult from "./components/InfoConsult";
import TitleConsult from "./components/TitleConsult";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { useEffect, useState } from "react";
import { backendIP } from "../../../server";
import { useParams } from "react-router-dom";
import QuestionConsult from "./ConsultQuestions/QuestionConsult";
import BoothPsifos from "../BoothPsifos";
import EndConsult from "./EndConsult";

function Consult(props) {
  const [questions, setQuestions] = useState([]);
  const [electionDescription, setElectionDescription] = useState("");
  const [actualPhase, setActualPhase] = useState(1);

  const { uuid } = useParams();

  useEffect(() => {
    if (props.electionData.questions) {
      setQuestions(JSON.parse(props.electionData.questions));
    }
    setElectionDescription(props.electionData.description);
  }, [props.electionData]);

  let election_metadata = require("../../../static/dummyData/electionMetadata.json");
  let BOOTH_PSIFOS = new BoothPsifos(
    JSON.stringify(props.electionData),
    election_metadata
  );

  return (
    <div id="content-consult-question">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            adressExit={backendIP + "/vote/" + uuid + "/logout"}
            addressInit=""
          />
          <Title namePage="Consulta" />
        </div>
      </section>
      <div className="columns is-flex is-centered">
        <section
          className="section mb-0 mt-1 p-4"
          id="consult-question-section"
        >
          {actualPhase === 1 && (
            <div>
              <TitleConsult title="Consulta" />
              <InfoConsult info={electionDescription} />
              <QuestionConsult
                questions={questions}
                booth={BOOTH_PSIFOS.getBooth()}
                encrypQuestions={(answersQuestions) => {
                  BOOTH_PSIFOS.sendEncryp(answersQuestions);
                }}
                afterEncrypt={() => {
                  BOOTH_PSIFOS.sendJson(uuid).then((res) => {
                    setActualPhase(2);
                  });
                }}
              />
            </div>
          )}
          {actualPhase === 2 && <EndConsult />}
        </section>
      </div>
    </div>
  );
}

export default Consult;
