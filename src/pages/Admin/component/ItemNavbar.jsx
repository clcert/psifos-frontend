import { Link } from "react-router-dom";

export default function ItemNavbar({ active, to, icon, itemText }) {
  return (
    <div className="content-subnavbar d-md-flex justify-content-center">
      <Link
        className={active ? "text-subnavbar" : "text-subnavbar-active"}
        to={to}
      >
        <i className={icon + " d-md-flex justify-content-center"}></i>
        <span className="">{itemText}</span>
      </Link>
    </div>
  );
}
