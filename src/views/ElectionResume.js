import { useEffect, useState } from "react";
import imageTrustees from "../static/svg/trustees-list.svg";
import { useParams } from "react-router";
import { backendIP } from "../server";
import Title from "../component/AdminComponent/Title";
import ImageFooter from "../component/AdminComponent/ImageFooter";
import InfoElection from "../component/AdminComponent/InfoElection";
import ElectionCode from "../component/AdminComponent/ElectionCode";
import MyNavbar from "../component/AdminComponent/MyNavbar";

function ElectionResume() {
  const [nameElection, setNameElection] = useState("");
  const [numVoters, setNumVoters] = useState("");
  const [totalVoters, setTotalVoters] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoElection, setInfoElection] = useState(null);

  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getElectionResume() {
      const resp = await fetch(backendIP + "/elections/" + uuid + "/resume", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status == 200) {
        const jsonResponse = await resp.json();
        setNameElection(jsonResponse.name);
        setNumVoters(jsonResponse.num_voters);
        setTotalVoters(jsonResponse.total_voters);
        setMaxWeight(jsonResponse.max_weight);
        setInfoElection(jsonResponse.info);
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
