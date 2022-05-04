import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import AgroupQuestions from "./ConsultQuestions/AgroupQuestions";
import DropdownSelection from "./ConsultQuestions/DropdownSelection";
import ImageQuestions from "./ConsultQuestions/ImageQuestions";
import MultipleSelection from "./ConsultQuestions/MultipleSelection";
import QuealificationSelection from "./ConsultQuestions/QualificationSelection";
import UniqueSelection from "./ConsultQuestions/UniqueSelection";
import InfoConsult from "./components/InfoConsult";
import TitleConsult from "./components/TitleConsult";

function Consult(props) {
  const dataUnique = require("./unica.json");
  const dataMulti = require("./multi.json");
  return (
    <div id="content-consult-question">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Creación de Elección" />
        </div>
      </section>
      <div className="columns is-flex is-centered">
        <section
          className="section mb-0 mt-1 p-4"
          id="consult-question-section"
        >
          <TitleConsult title="Consulta" />
          <InfoConsult info="Aquí va la descripción de la consulta. El objetivo es poner el objetivo de la consulta, la organización que la realiza, algún mensaje sobre la privacidad y seguridad también sería ideal. " />
          <UniqueSelection data={dataUnique} />
          <MultipleSelection data={dataMulti} />
          <DropdownSelection data={dataUnique} />
          <QuealificationSelection data={dataUnique} />
          <AgroupQuestions data={dataUnique} />
          <ImageQuestions data={dataUnique} />
        </section>
      </div>
    </div>
  );
}
export default Consult;
