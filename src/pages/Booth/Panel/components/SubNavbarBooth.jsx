import { Link } from "react-router-dom";
import ItemNavbar from "../../../Admin/component/ItemNavbar";

function SubNavbarBooth(props) {
  return (
    <section className="subnavbar-section mb-3">
      <div className="subnavbar columns is-flex is-centered">
        <div className="subnavbar-inner pt-2">
          <div className="container subnavbar-items columns is-centered pt-2">
            <ItemNavbar
              active={props.active !== 0}
              to=""
              icon="fa-solid fa-check-to-slot"
              itemText="Urna electrónica"
              actionClick={() => {
                props.changeActive(0);
              }}
            />
            <ItemNavbar
              active={props.active !== 1}
              to=""
              icon="fa-solid fa-square-poll-vertical"
              itemText="Estadísticas"
              actionClick={() => {
                props.changeActive(1);
              }}
            />
            <ItemNavbar
              active={props.active !== 2}
              to=""
              icon="fa-solid fa-list-check"
              itemText="Eventos"
              actionClick={() => {
                props.changeActive(2);
              }}
            />
            <ItemNavbar
              active={props.active !== 3}
              to=""
              icon="fa-solid fa-list-alt"
              itemText="Resultados"
              actionClick={() => {
                props.changeActive(3);
              }}
            />
            <ItemNavbar
              active={props.active !== 4}
              to=""
              icon="fa-solid fa-square-check"
              itemText="Verificación"
              actionClick={() => {
                props.changeActive(4);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default SubNavbarBooth;
