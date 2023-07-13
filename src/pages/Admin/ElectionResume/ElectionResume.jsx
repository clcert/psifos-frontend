import imageTrustees from "../../../static/svg/trustees-list.svg";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import ImageFooter from "../../../component/Footers/ImageFooter";
import InfoElection from "./components/InfoElection";
import ElectionCode from "../../../component/Footers/ElectionCode";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import SubNavbar from "../component/SubNavbar";
import {
  getElectionResume, getStats, getElectionPublic
} from "../../../services/election";

function ElectionResume() {
  /**
   * view to summarize the election
   */

  /** @state {string} name of election */
  const [nameElection, setNameElection] = useState("");

  const [weightsInit, setWeightsInit] = useState({});

  const [weightsEnd, setWeightsEnd] = useState({});

  const [weightsElection, setWeightsElection] = useState({});
  
  const [maxWeight, setMaxWeight] = useState();

  /** @state {string} state of loading data */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  const getElectionResult = useCallback(async () => {
    getElectionPublic(shortName).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        jsonResponse.max_weight && setMaxWeight(
          jsonResponse.max_weight
        )
      }
    });
  }, [shortName]);

  useEffect(() => {
    getElectionResult();
  }, [getElectionResult]);

  useEffect(
    function effectFunction() {
      getElectionResume(shortName).then((data) => {
        const { jsonResponse } = data;
        setWeightsInit(JSON.parse(jsonResponse.weights_init));
        setWeightsEnd(JSON.parse(jsonResponse.weights_end));
        setWeightsElection(JSON.parse(jsonResponse.weights_election));
        setLoad(true);
      });
      getStats(shortName).then((data) => {
        const { jsonResponse } = data;
        setNameElection(jsonResponse.name);
      });
    },
    [shortName]
  );

  return (
    <div id="content-home-admin">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <TitlePsifos
            namePage="Resumen de Elección"
            nameElection={nameElection}
          />
        </div>
      </section>

      <SubNavbar active={2} />

      <InfoElection
        load={load}
        weightsInit={weightsInit}
        weightsEnd={weightsEnd}
        weightsElection={weightsElection}
        maxWeight={maxWeight}
      />

      <ImageFooter imagePath={imageTrustees} />
      <ElectionCode />
    </div>
  );
}

export default ElectionResume;
