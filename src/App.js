import "./App.css";
import { Routes, Route } from "react-router-dom";
import ElectionResume from "./pages/Admin/ElectionResume/ElectionResume";
import Urna from "./pages/Admin/Urna/Urna";
import CustodioClaves from "./pages/Admin/CustodioClaves/CustodioClaves";
import Resultados from "./pages/Admin/Results/Resultados";
import Home from "./pages/Home/Home";
import "bulma/css/bulma.min.css";
import CabinaElection from "./pages/Cabina/Election/CabinaElection";
import HomeAdmin from "./pages/Admin/Home/HomeAdmin";
import AdministrationPanel from "./pages/Admin/AdministrationPanel/AdministrationPanel";
import Login from "./pages/Admin/Login/Login";
import CreateElection from "./pages/Admin/CreateElection/CreateElection";
import CreateQuestion from "./pages/Admin/CreateQuestion.js/CreateQuestion";
import Consult from "./pages/Cabina/Consult/Consult";
import CustodioHome from "./pages/Admin/CustodioClaves/CustodioHome";
import Keygenerator from "./pages/Admin/CustodioClaves/Keygenerator";
import { Navigate } from "react-router-dom";
import RequireAuth from "./pages/Auth/RequireAuth";
import AutchCas from "./pages/Auth/AuthCas";
import CreateCustodio from "./pages/Admin/CustodioClaves/CreateCustodio";
import Cabina from "./pages/Cabina/Cabina";
import CheckSk from "./pages/Admin/CustodioClaves/CheckSk";
import DecryptProve from "./pages/Admin/CustodioClaves/DecryptProve";

function App() {
  function getToken() {
    /**
     * get token from localStorage
     * @returns {string} token
     */

    const tokenString = sessionStorage.getItem("token");
    return tokenString;
  }

  const token = getToken();

  return (
    <Routes>
      {/** Route for home page */}
      <Route path="home" element={<Home />} />

      {/** init route for login */}
      {token ? (
        <Route path="/" element={<Navigate replace to="/admin/home" />} />
      ) : (
        <Route path="/" element={<Login />} />
      )}

      {/** Routes for admin page */}
      <Route path="/admin">
        {token ? (
          <Route path="login" element={<Navigate replace to="/admin/home" />} />
        ) : (
          <Route path="login" element={<Login />} />
        )}
        <Route
          path="home"
          element={
            <RequireAuth>
              <HomeAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="create-election"
          element={
            <RequireAuth>
              <CreateElection />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/create-question/"
          element={
            <RequireAuth>
              <CreateQuestion />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/panel"
          element={
            <RequireAuth>
              <AdministrationPanel />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/resumen"
          element={
            <RequireAuth>
              <ElectionResume />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/urna"
          element={
            <RequireAuth>
              <Urna />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/trustee"
          element={
            <RequireAuth>
              <CustodioClaves />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/create-trustee"
          element={
            <RequireAuth>
              <CreateCustodio />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/resultado"
          element={
            <RequireAuth>
              <Resultados />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/edit-election/"
          element={
            <RequireAuth>
              <CreateElection edit={true} />
            </RequireAuth>
          }
        />
        <Route
          path=":uuid/cabina"
          element={
            <RequireAuth>
              <Cabina preview={true} />
            </RequireAuth>
          }
        />
      </Route>

      {/** Routes for cabina (voters) */}
      <Route path="/cabina">
        <Route path=":uuid" element={<Cabina />} />
        <Route path="consult" element={<Consult />} />
      </Route>

      {/** Routes for trustee */}
      <Route
        path=":uuid/trustee/:uuidTrustee/home"
        element={<CustodioHome />}
      />

      <Route path=":uuid/trustee/home" element={<CustodioHome />} />
      <Route
        path=":uuid/trustee/:uuidTrustee/keygenerator"
        element={<Keygenerator />}
      />
      <Route path=":uuid/trustee/:uuidTrustee/check-sk" element={<CheckSk />} />
      <Route
        path=":uuid/trustee/:uuidTrustee/decrypt-and-prove"
        element={<DecryptProve />}
      />

      <Route path="/test/:uuid" element={<AutchCas />}></Route>
    </Routes>
  );
}

export default App;
