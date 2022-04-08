import ElectionCode from "../../component/Footers/ElectionCode";
import Title from "../../component/OthersComponents/Title";
import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import { Link, useParams } from "react-router-dom";

function NoAuth() {
  const { uuid } = useParams();
  return (
    <div id="content">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Cabina Votación" nameElection={"nameElection"} />
        </div>
      </section>

      <section className="section pb-0" id="auth-section">
        <div className="has-text-centered title is-size-4-mobile">
          No tienes permiso para votar en esta elección
        </div>

        <div className="d-flex justify-content-center pb-1">
          <button className="button review-buttons previous-button has-text-white has-text-weight-bold">
            <Link style={{textDecoration: "none", color:"white"}} to="/home">
              <span>Ir al inicio</span>
            </Link>
          </button>
        </div>
      </section>
      <ElectionCode uuid={uuid} />
      <div id="bottom"></div>
    </div>
  );
}

export default NoAuth;
