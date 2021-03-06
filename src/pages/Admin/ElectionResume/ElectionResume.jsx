import imageTrustees from "../../../static/svg/trustees-list.svg";
import Title from "../../../component/OthersComponents/Title";
import ImageFooter from "../../../component/Footers/ImageFooter";
import InfoElection from "./components/InfoElection";
import ElectionCode from "../../../component/Footers/ElectionCode";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useParams } from "react-router";
import { backendIP } from "../../../server";
import { useEffect, useState } from "react";
import SubNavbar from "../component/SubNavbar";
import logout from "../../../utils/utils";

function ElectionResume() {
  /**
   * view to summarize the election
   */

  /** @state {string} name of election */
  const [nameElection, setNameElection] = useState("");

  /** @state {string} number of voters */
  const [numVoters, setNumVoters] = useState("");

  /** @state {string} total voters */
  const [totalVoters, setTotalVoters] = useState("");

  /** @state {string} max weight election */
  const [maxWeight, setMaxWeight] = useState("");

  /** @state {string} state of loading data */
  const [loading, setLoading] = useState(false);

  /** @urlParam {array} array with election metadata */
  const [infoElection, setInfoElection] = useState([]);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getElectionResume() {
      /**
       * async function to get the election data
       */

      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + "/" + uuid + "/resume", {
        method: "GET",
        headers: {
          "x-access-tokens": token,
          "Content-Type": "application/json",
        },
      });

      if (resp.status == 200) {
        const jsonResponse = await resp.json();
        setLoading(true);
        return jsonResponse;
      } else if (resp.status == 401) {
        logout();
      }
    }
    getElectionResume();
  }, []);

  if (loading !== false) {
    return (
      <div id="content-voters">
        <section className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <Title namePage="Resumen de Elecci??n" nameElection={nameElection} />
          </div>
        </section>

        <SubNavbar active={2} />

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
