import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";

function CreateCustodio() {
  /**
   * View for create a new custodio
   */

  /** @urlParams uuid of election */
  const { uuid } = useParams();

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Custodio de Claves" nameElection={"nameElection"} />
        </div>
      </section>

      <SubNavbar active={4} />

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="not-allowed-section"
      >
        <div className="form-election">
          <div className="field">
            <label className="label label-form-election">Nombre</label>
            <div className="control">
              <input className="input" type="text" placeholder="Nombre" />
            </div>
          </div>
          <div className="field">
            <label className="label label-form-election">Correo</label>
            <div className="control">
              <input className="input" type="text" placeholder="Correo" />
            </div>
          </div>
          <div className="level">
            <Button className="button-custom mr-2 ml-2 level-left">
              <Link className="link-button" to={"/admin/" + uuid + "/custodio"}>
                Atras
              </Link>
            </Button>

            <Button className="button-custom mr-2 ml-2 level-right">
              Crear custodio
            </Button>
          </div>
        </div>
      </section>

      <div>
        <ImageFooter imagePath={"imageTrustees"} />
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      </div>
    </div>
  );
}

export default CreateCustodio;
