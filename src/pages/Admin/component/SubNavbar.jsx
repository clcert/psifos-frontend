import { useParams } from "react-router-dom";
import ItemNavbar from "./ItemNavbar";

function SubNavbar(props) {
  const { shortName } = useParams();

  return (
    <section className="subnavbar-section mb-3">
      <div className="subnavbar columns is-flex is-centered">
        <div className="subnavbar-inner pt-2">
          <div className="container subnavbar-items columns is-centered pt-2">
            <ItemNavbar
              active={props.active !== 0}
              to={"/psifos/admin/home"}
              icon={"fa fa-home"}
              itemText="Votaciones"
            />
            <ItemNavbar
              active={props.active !== 1}
              to={"/psifos/admin/" + shortName + "/panel"}
              icon="fa-solid fa-screwdriver-wrench"
              itemText="Panel"
            />
            <ItemNavbar
              active={props.active !== 2}
              to={"/psifos/admin/" + shortName + "/resumen"}
              icon="fa fa-list-alt"
              itemText="Resumen"
            />
            <ItemNavbar
              active={props.active !== 3}
              to={"/psifos/admin/" + shortName + "/voters-list"}
              icon="fa-solid fa-check-to-slot"
              itemText="Padrón"
            />
            <ItemNavbar
              active={props.active !== 4}
              to={"/psifos/admin/" + shortName + "/trustee"}
              icon="fa-solid fa-user-check"
              itemText="Custodios"
            />
            <ItemNavbar
              active={props.active !== 5}
              to={"/psifos/admin/" + shortName + "/resultado"}
              icon="fa-solid fa-square-poll-vertical"
              itemText="Resultados"
            />
            <ItemNavbar
              active={props.active !== 6}
              to={"/psifos/admin/" + shortName + "/statistics"}
              icon="fa-solid fa-chart-line"
              itemText="Estadísticas"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default SubNavbar;
