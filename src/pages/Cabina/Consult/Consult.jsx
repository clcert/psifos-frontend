import Title from "../../../component/OthersComponents/Title";
import AgroupQuestions from "./ConsultQuestions/AgroupQuestions";
import DropdownSelection from "./ConsultQuestions/DropdownSelection";
import ImageQuestions from "./ConsultQuestions/ImageQuestions";
import MultipleSelection from "./ConsultQuestions/MultipleSelection";
import QuealificationSelection from "./ConsultQuestions/QualificationSelection";
import UniqueSelection from "./ConsultQuestions/UniqueSelection";
import InfoConsult from "./components/InfoConsult";
import TitleConsult from "./components/TitleConsult";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";

function Consult(props) {
  const dataUnique = require("./unica.json");
  const dataMulti = require("./multi.json");
  return (
    <div id="content-consult-question">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Creación de Elección" />
        </div>
      </section>
      <div className="columns is-flex is-centered">
        <section
          className="section mb-0 mt-1 p-4"
          id="consult-question-section"
        >
          <TitleConsult title="Consulta" />
          <InfoConsult info="Consulta dummy" />
          {props.electionData.map((item, index) => {
            return (
              <div key={index}>
                
                {item.min_answers === item.max_answers && (
                  <UniqueSelection data={item} />
                )}

                {item.min_answers !== item.max_answers && (
                  <MultipleSelection data={item} />
                )}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
export default Consult;
