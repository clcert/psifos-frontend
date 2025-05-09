// ErrorContext.js
import { createContext, useState, useContext } from "react";
import NavbarAdmin from "../../component/ShortNavBar/NavbarAdmin";
import TitlePsifos from "../../component/OthersComponents/TitlePsifos";

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <ErrorContext.Provider value={{ hasError, setHasError }}>
      {hasError ? <ErrorScreen /> : children}
    </ErrorContext.Provider>
  );
};

const messageError = "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.";
const ErrorScreen = () => (


  <div id="content" className="parallax-01">
    <section className="parallax hero is-medium">
      <div className="hero-body pt-0 px-0 header-hero">
      <NavbarAdmin />
      <TitlePsifos namePage="Información no encontrada"/>
      </div>
    </section>

    <section className="section" id="auth-section">
      <div className="has-text-centered title is-size-4-mobile">{messageError}</div>
    </section>
    <div id="bottom"></div>
  </div>
);
