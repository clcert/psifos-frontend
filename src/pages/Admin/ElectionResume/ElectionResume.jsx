import imageTrustees from "../../../static/svg/trustees-list.svg";
import Title from "../../../component/OthersComponents/Title";
import ImageFooter from "../../../component/Footers/ImageFooter";
import InfoElection from "./components/InfoElection";
import ElectionCode from "../../../component/Footers/ElectionCode";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useParams } from "react-router";
import { backendOpIP } from "../../../server";
import { useEffect, useState } from "react";
import SubNavbar from "../component/SubNavbar";
import { logout } from "../../../utils/utils";
import { getStats } from "../../../services/election";

function ElectionResume() {
  /**
   * view to summarize the election
   */

  /** @state {string} name of election */
  const [nameElection, setNameElection] = useState("");

  const [weightsInit, setWeightsInit] = useState({});

  const [weightsEnd, setWeightsEnd] = useState({});

  /** @state {string} state of loading data */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getElectionResume() {
      /**
       * async function to get the election data
       */

      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendOpIP + "/" + uuid + "/resume", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        const jsonResponse = await resp.json();

        setWeightsInit(JSON.parse(jsonResponse.weights_init));
        setWeightsEnd(JSON.parse(jsonResponse.weights_end));

        setLoad(true);
        return jsonResponse;
      } else if (resp.status === 401) {
        logout();
      }
    }
    getElectionResume();
    getStats(uuid).then((data) => {
      const { jsonResponse } = data;
      setNameElection(jsonResponse.name);
    });
  }, []);

  return (
    <div id="content-voters">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Resumen de Elección" nameElection={nameElection} />
        </div>
      </section>

      <SubNavbar active={2} />

      <InfoElection
        load={load}
        weightsInit={weightsInit}
        weightsEnd={weightsEnd}
      />

      <ImageFooter imagePath={imageTrustees} />
      <ElectionCode uuid={uuid} />
    </div>
  );
}

export default ElectionResume;
