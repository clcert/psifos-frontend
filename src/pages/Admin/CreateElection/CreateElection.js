import { Button } from "react-bulma-components";
import { Link } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import TimeField from "react-simple-timefield";

function CreateElection() {
  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Creación de Elección" />
        </div>
      </section>

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="create-election-section"
      >
        <div className="form-election">
          <div className="field">
            <label className="label label-form-election">Nombre corto</label>
            <div className="control">
              <input className="input" type="text" placeholder="Nombre corto" />
            </div>
            <p className="help">
              No espacios, esta sera parte de la URL, e.g. my-club-2010
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">
              Nombre de la elección
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Nombre de la elección"
              />
            </div>
            <p className="help">
              El nombre bonito para su elección, e.g Elecciones de Mi Club 2010
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">Descripción</label>
            <div className="control">
              <textarea className="textarea" placeholder="Descripción"></textarea>
            </div>
          </div>
          <div className="field">
            <label className="label label-form-election">Tipo de elección</label>
            <div className="control">
              <div className="select">
                <select>
                  <option>Elección</option>
                  <option>Referendum</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label label-form-election">Correo de ayuda</label>
            <div className="control">
              <input className="input" type="text" placeholder="Correo" />
            </div>
            <p className="help">
              An email address voters should contact if they need help.
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">
              Peso maximo de los votantes
            </label>
            <div className="control">
              <input
                className="input"
                type="number"
                placeholder="Peso maximo"
              />
            </div>
            <p className="help">The maximum value of the voter weights.</p>
          </div>

          <div className="field">
            <label className="label label-form-election">Fecha de inicio</label>
            <div className="control mb-2">
              <input
                className="input input-calendar"
                type="date"
                placeholder="Fecha de inicio"
              />
              
            </div>
            <TimeField style={{ width: "46px" }} colon=":" />
          </div>
          <div className="field">
            <label className="label label-form-election">
              Fecha de termino
            </label>
            <div className="control mb-2">
              <input
                className="input input-calendar"
                type="date"
                placeholder="Fecha de inicio"
              />
             
            </div>
            <TimeField style={{ width: "46px" }} colon=":" />
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" className="mr-2" />
                User voter aliases
              </label>
            </div>
            <p className="help">
              If selected, voter identities will be replaced with aliases, e.g.
              "V12", in the ballot tracking center
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" className="mr-2" />
                Randomize answer order
              </label>
            </div>
            <p className="help">
              enable this if you want the answers to questions to appear in
              random order for each voter
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" className="mr-2" />
                Elección privada
              </label>
            </div>
            <p className="help">
              A private election is only visible to registered voters.
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" className="mr-2" />
                Normalizar los resultados
              </label>
            </div>
            <p className="help">
              Results numbers displayed are divided by Maximum Voter Weight
            </p>
          </div>
          <div className="level">
            <Button className="button-custom mr-2 ml-2 level-left">
              <Link className="link-button" to="/admin/home">
                Atras
              </Link>
            </Button>
            <Button className="button-custom mr-2 ml-2 level-right">
              <Link className="link-button" to="/admin/home">
                Crear elección
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}
export default CreateElection;
