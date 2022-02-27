import { Link } from "react-router-dom";

function SubNavbar(props) {
  return (
    <section className="subnavbar-section mb-3">
      <div className="subnavbar columns is-flex is-centered">
        <div className="subnavbar-inner">
          <div className="container pb-2 pt-2">
            <Link
              className={
                props.active !== 0 ? "text-subnavbar" : "text-subnavbar-active"
              }
              to="/admin/home"
            >
              <i className="fa fa-home mr-2"></i>
              <span>Votaciones</span>
            </Link>
            <Link
              className={
                props.active !== 1 ? "text-subnavbar" : "text-subnavbar-active"
              }
              to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/panel"
            >
              <i className="fa-solid fa-screwdriver-wrench mr-2"></i>
              <span>Panel</span>
            </Link>

            <Link
              className={
                props.active !== 2 ? "text-subnavbar" : "text-subnavbar-active"
              }
              to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/resumen"
            >
              <i className="fa fa-list-alt mr-2"></i>
              <span>Resumen</span>
            </Link>

            <Link
              className={
                props.active !== 3 ? "text-subnavbar" : "text-subnavbar-active"
              }
              to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/urna"
            >
              <i className="fa-solid fa-check-to-slot mr-2"></i>
              <span>Urna</span>
            </Link>

            <Link
              className={
                props.active !== 4 ? "text-subnavbar" : "text-subnavbar-active"
              }
              to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/custodio"
            >
              <i className="fa-solid fa-user-check mr-2"></i>
              <span>Custodio de Claves</span>
            </Link>

            <Link
              className={
                props.active !== 5 ? "text-subnavbar" : "text-subnavbar-active"
              }
              to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/resultado"
            >
              <i className="fa-solid fa-square-poll-vertical mr-2"></i>
              <span>Resultados</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SubNavbar;
