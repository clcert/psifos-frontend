import { useEffect, useState } from "react";
import { getTrusteePanel } from "../../../services/trustee";
import { Link, useParams } from "react-router-dom";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import ImageFooter from "../../../component/Footers/ImageFooter";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import imageTrustees from "../../../static/svg/trustees1.svg";
import LoadPage from "../../../component/Loading/LoadPage";
import NoAuth from "../../Booth/NoAuth";

export default function CustodioHome() {
  const [load, setLoad] = useState(false);
  const [trustee, setTrustee] = useState({});
  const [trusteesCrypto, setTrusteesCrypto] = useState([]);
  const [noAuthMessage, setNoAuthMessage] = useState("");
  const [auth, setAuth] = useState(false);

  const { uuidTrustee } = useParams();

  const handlerClick = () => {
    
  };

  useEffect(() => {
    getTrusteePanel(uuidTrustee).then((data) => {
      try {
        const { resp, jsonResponse } = data;
        setLoad(true);
        if (resp.status === 200) {
          setAuth(true);
          setTrusteesCrypto(jsonResponse.trustee_crypto);
            setTrustee(jsonResponse.trustee);
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [uuidTrustee]);

  if (!load) {
    return <LoadPage />;
  }

  if (!auth) {
    return <NoAuth title={"Custodio de Claves"} message={noAuthMessage} />;
  } else {
    return (
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar />
            <TitlePsifos
              namePage="Portal de Custodio de Clave"
              nameElection={`Custodio ${trustee.name}`}
            />
          </div>
        </section>

        <section className="section" id="medium-section">
          <div className="container has-text-centered is-max-desktop">
            <div>
              {trusteesCrypto.map((trusteeCrypto, index) => {
                return (
                <Link to={`/psifos/${trusteeCrypto.election_short_name}/trustee/${uuidTrustee}/home`}>
                  <div
                    onClick={handlerClick}
                    class="box border-style-box"
                    key={index}
                  >
                    <h1>{trusteeCrypto.election_short_name}</h1>
                  </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div>
          <ImageFooter imagePath={imageTrustees} />
          <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
        </div>
      </div>
    );
  }
}
