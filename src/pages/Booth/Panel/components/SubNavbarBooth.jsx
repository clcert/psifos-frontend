import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function SubNavbarBooth(props) {

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
                to=""
                onClick={() => {
                  props.changeActive(0, "Urna electronica");
                }}
              >
                <i className="fa fa-check-to-slot mr-2"></i>
                <span>Urna electronica</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 1
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to=""
                onClick={() => {
                  props.changeActive(1, "Estadísticas");
                }}
              >
                <i className="fa-solid fa-square-poll-vertical mr-2"></i>
                <span>Estadísticas</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 2
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to=""
                onClick={() => {
                  props.changeActive(2, "Resultados");
                }}
              >
                <i className="fa fa-list-alt mr-2"></i>
                <span>Resultados</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 3
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to=""
                onClick={() => {
                  props.changeActive(3, "Verificación");
                }}
              >
                <i className="fa fa-list-alt mr-2"></i>
                <span>Verificación</span>
              </Link>
            </div>
            <div className="content-subnavbar">
              <Link
                className={
                  props.active !== 4
                    ? "text-subnavbar"
                    : "text-subnavbar-active"
                }
                to=""
                onClick={() => {
                  props.changeActive(4, "Registro");
                }}
              >
                <i className="fa fa-list-alt mr-2"></i>
                <span>Registro</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SubNavbarBooth;
