import { Link } from "react-router-dom";

function UserButton(props) {
  return (
    <div className="dropdown is-hoverable mb-2">
      <div className="dropdown-trigger">
        <a
          className="navbar-admin-button"
          aria-haspopup="true"
          aria-controls="dropdown-menu4"
        >
          <span>Helios Admin</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </a>
      </div>
      <div className="dropdown-menu mt-2" id="dropdown-menu4" role="menu">
        <div className="dropdown-item">
          <Link style={{textDecoration: "None", color: "black"}} to="/admin/login">Log out</Link>
        </div>
      </div>
    </div>
  );
}

export default UserButton;
