import MyNavbar from "../component/AdminComponent/MyNavbar";
import Title from "../component/AdminComponent/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../component/AdminComponent/ElectionCode";
import InstructionsSection from "../component/CabinaComponent/InstructionsSection";
import MediaSection from "../component/CabinaComponent/MediaSection";

function Cabina() {
  const { uuid } = useParams();
  return (
    <div id="content-voters">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Resumen de Elección" nameElection={"nameElection"} />
        </div>
      </section>

      <MediaSection />
      <InstructionsSection />

      <ElectionCode uuid={uuid} />
    </div>
  );
}

export default Cabina;
