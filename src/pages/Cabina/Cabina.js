import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import Title from "../../component/OthersComponents/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../../component/Footers/ElectionCode";
import InstructionsSection from "../../pages/Cabina/components/InstructionsSection";
import MediaSection from "../../pages/Cabina/components/MediaSection";

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
