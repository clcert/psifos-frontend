import "./App.css";
import { Routes, Route } from "react-router-dom";
import ElectionResume from "./pages/Admin/ElectionResume/ElectionResume";
import Urna from "./pages/Admin/Urna/Urna";
import CustodioClaves from "./pages/Admin/CustodioClaves/CustodioClaves";
import Resultados from "./pages/Admin/Results/Resultados";
import Home from "./pages/Home/Home";
import "bulma/css/bulma.min.css";
import Cabina from "./pages/Cabina/Cabina";
import Login from "./pages/Cabina/Login/Login";
import HomeAdmin from "./pages/Admin/Home/HomeAdmin";
import AdministrationPanel from "./pages/Admin/AdministrationPanel/AdministrationPanel";

function App() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />

      <Route path="/admin">
        <Route path="login" element={<Login />} />
        <Route path="home" element={<HomeAdmin />} />
        <Route path=":uuid/panel" element={<AdministrationPanel />} />
        <Route path=":uuid/resumen" element={<ElectionResume />} />
        <Route path=":uuid/urna" element={<Urna />} />
        <Route path=":uuid/custodio" element={<CustodioClaves />} />
        <Route path=":uuid/resultado" element={<Resultados />} />
      </Route>

      <Route path="/cabina">
        <Route path=":uuid" element={<Cabina />} />
      </Route>
    </Routes>
  );
}

export default App;
