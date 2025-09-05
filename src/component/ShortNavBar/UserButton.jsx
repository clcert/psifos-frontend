import { useState } from "react";
import { backendOpIP } from "../../server";

function UserButton(props) {
  const [display, setDisplay] = useState(false);

  function logOut() {
    async function fetchLogout() {
      await fetch(backendOpIP + "/logout", {
        method: "POST",
        credentials: "include", // Importante para mandar la cookie
      });
      window.location.href = "/psifos/admin/login";
    }
    fetchLogout();
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
      <span>
        <span> SALIR </span>
      </span>
      {display && (
        <div className="dropdown-menu" id="dropdown-menu4" role="menu">
          <div className="dropdown-item">
            <span
              onClick={logOut}
              style={{ textDecoration: "None", color: "black" }}
            >
              Cerrar sesión
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserButton;
