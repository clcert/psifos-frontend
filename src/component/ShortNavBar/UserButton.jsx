import { useState } from "react";

function UserButton(props) {
  const [display, setDisplay] = useState(false);

  function logOut() {
    sessionStorage.removeItem("token");
    window.location.href = "/psifos/admin/login";
  }
  return (
    <div
      id="text-button"
      className="menu-text-admin"
      onClick={(e) => {
        setDisplay(!display);
      }}
      onMouseEnter={(e) => {
        setDisplay(true);
      }}
      onMouseLeave={(e) => {
        setDisplay(false);
      }}
    >
      <a>
        <span>{sessionStorage.getItem("user")}</span>
      </a>
      {display && (
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
      )}
    </div>
  );
}

export default UserButton;
