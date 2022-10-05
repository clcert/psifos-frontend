import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function SubNavbar(props) {
  const { uuid } = useParams();

  return (
    <section className="subnavbar-section mb-3">
      <div className="subnavbar columns is-flex is-centered">
        <div className="subnavbar-inner pt-2">
          <div className="container subnavbar-items columns is-centered pb-2 pt-2">
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 0
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to="/psifos/admin/home"
              >
                <i className="fa fa-home mr-2"></i>
                <span>Votaciones</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 1
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to={"/psifos/admin/" + uuid + "/panel"}
              >
                <i className="fa-solid fa-screwdriver-wrench mr-2"></i>
                <span>Panel</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 2
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to={"/psifos/admin/" + uuid + "/resumen"}
              >
                <i className="fa fa-list-alt mr-2"></i>
                <span>Resumen</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 3
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to={"/psifos/admin/" + uuid + "/voters-list"}
              >
                <i className="fa-solid fa-check-to-slot mr-2"></i>
                <span>Padrón</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 4
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to={"/psifos/admin/" + uuid + "/trustee"}
              >
                <i className="fa-solid fa-user-check mr-2"></i>
                <span>Custodio de Claves</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 5
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to={"/psifos/admin/" + uuid + "/resultado"}
              >
                <i className="fa-solid fa-square-poll-vertical mr-2"></i>
                <span>Resultados</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SubNavbar;
