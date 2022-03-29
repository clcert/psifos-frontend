import imageTrustees from "../../../static/svg/trustees-list.svg";
import Title from "../../../component/OthersComponents/Title";
import ImageFooter from "../../../component/Footers/ImageFooter";
import InfoElection from "./components/InfoElection";
import ElectionCode from "../../../component/Footers/ElectionCode";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { useParams } from "react-router";
import { backendIP } from "../../../server";
import { useEffect, useState } from "react";
import SubNavbar from "../component/SubNavbar";

function ElectionResume() {
  const [nameElection, setNameElection] = useState("");
  const [numVoters, setNumVoters] = useState("");
  const [totalVoters, setTotalVoters] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoElection, setInfoElection] = useState([]);

  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getElectionResume() {
      const resp = await fetch(backendIP + "/" + uuid + "/resume", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status == 200) {
        const jsonResponse = await resp.json();

        setLoading(true);

        return jsonResponse;
      }
    }
    getElectionResume();
  }, []);

  if (loading !== false) {
    return (
      <div id="content-voters">
        <section className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar />
            <Title namePage="Resumen de Elección" nameElection={nameElection} />
            
          </div>
        </section>

        <SubNavbar active={2}/>

        <InfoElection
          infoElection={infoElection}
          numVoters={numVoters}
          totalVoters={totalVoters}
          maxWeight={maxWeight}
        />

        <ImageFooter imagePath={imageTrustees} />
        <ElectionCode uuid={uuid} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }
}

export default ElectionResume;
