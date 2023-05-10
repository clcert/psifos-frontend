import { Link } from "react-router-dom";

export default function ItemNavbar({
  active,
  to,
  icon,
  itemText,
  actionClick,
}) {
  return (
    <div className="content-subnavbar d-md-flex justify-content-center is-flex">
      <Link
        className={active ? "text-subnavbar" : "text-subnavbar-active"}
        to={to}
        onClick={actionClick}
      >
        <i className={icon + " d-md-flex justify-content-center mx-1"}></i>
        <span className="">{itemText}</span>
      </Link>
    </div>
  );
}
