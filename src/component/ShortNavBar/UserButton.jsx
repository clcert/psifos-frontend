function UserButton(props) {
  function logOut() {
    sessionStorage.removeItem("token");
    window.location.href = "/admin/login";
  }
  return (
    <div className="dropdown is-hoverable mb-2">
      <div className="dropdown-trigger">
        <a
          className="navbar-admin-button"
          aria-haspopup="true"
          aria-controls="dropdown-menu4"
        >
          <span>{sessionStorage.getItem("user")}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </a>
      </div>
      <div className="dropdown-menu" id="dropdown-menu4" role="menu">
        <div className="dropdown-item">
          <a
            onClick={logOut}
            style={{ textDecoration: "None", color: "black" }}
          >
            Cerrar sesión
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserButton;
