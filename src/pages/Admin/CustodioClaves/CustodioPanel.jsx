import { useEffect, useState } from "react";
import { getTrusteePanel } from "../../../services/trustee";
import { Link, useParams } from "react-router-dom";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import ImageFooter from "../../../component/Footers/ImageFooter";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import imageTrustees from "../../../static/svg/trustees1.svg";
import LoadPage from "../../../component/Loading/LoadPage";
import NoAuth from "../../Booth/NoAuth";
import KeyGenerator from "../../../crypto/KeyGenerator";
import DropFile from "./components/DropFile";
import CheckSecretKey from "../../../crypto/CheckSecretKey";
import DecryptAndProve from "../../../crypto/DecryptAndProve";

const getTrusteeStatus = (crypto) => {
  if (crypto.decryptions) {
    return "Desencriptaciones enviadas";
  }
  if (crypto.public_key) {
    return "Llave generada";
  }
  return "Llaves aun no generadas";
};

function CustodioSelector({
  trusteeCrypto,
  uuidTrustee,
  index,
  setShortNames,
  electionsCrypto,
}) {
  const handlerSelector = (e) => {
    setShortNames((prev) => [...prev, e.target.value]);
  };

  return (
    <div className="box border-style-box my-4 p-2" key={index}>
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        onChange={handlerSelector}
        value={trusteeCrypto.election_short_name}
        disabled={electionsCrypto.length > 0}
      />
      <p>{getTrusteeStatus(trusteeCrypto)}</p>
      <h1>{trusteeCrypto.election_short_name}</h1>
    </div>
  );
}

function Synchronize({ electionsCrypto }) {
  const synchronize = (secretKeyArray) => {
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      electionCrypto.checkSk(secretKey.secret_key);
    });
  };
  return <DropFile setText={synchronize} />;
}

function CheckSk({ electionsCrypto, setFeedbackMessage }) {
  const checkSk = (secretKeyArray) => {
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      const message = electionCrypto.checkSk(secretKey.secret_key);
      setFeedbackMessage((prev) => [...prev, message]);
    });
  };
  return <DropFile setText={checkSk} />;
}

function DecryptProve({ electionsCrypto }) {
  const decrypt = (secretKeyArray) => {
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      electionCrypto.handlerDecrypt(secretKey.secret_key);
    });
  };
  return <DropFile setText={decrypt} />;
}

export default function CustodioHome() {
  const [load, setLoad] = useState(false);
  const [trustee, setTrustee] = useState({});
  const [trusteesCrypto, setTrusteesCrypto] = useState([]);
  const [noAuthMessage, setNoAuthMessage] = useState("");
  const [auth, setAuth] = useState(false);

  const [electionsCrypto, setElectionsCrypto] = useState([]);
  const [checkCrypto, setCheckCrypto] = useState([]);
  const [decryptCrypto, setDecryptCrypto] = useState([]);

  const [shortNames, setShortNames] = useState([]);

  const [synchronizeActive, setSynchronizeActive] = useState(false);
  const [checkSkActive, setCheckSkActive] = useState(false);
  const [decryptProveActive, setDecryptProveActive] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState([]);

  const { uuidTrustee } = useParams();

  useEffect(() => {
    getTrusteePanel().then((data) => {
      try {
        const { resp, jsonResponse } = data;
        setLoad(true);
        if (resp.status === 200) {
          setAuth(true);
          setTrusteesCrypto(jsonResponse.trustee_crypto);
          setTrustee(jsonResponse.trustee);
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [uuidTrustee]);

  const prepareElections = () => {
    const elections = [];
    shortNames.forEach((shortName) => {
      const key = new KeyGenerator(shortName, uuidTrustee);
      key.initParams();
      elections.push(key);
    });
    setElectionsCrypto(elections);
  };

  const generateMultipleKeys = () => {
    const keys = [];
    electionsCrypto.forEach((electionCrypto) => {
      electionCrypto.generateKeyPair();
      keys.push({
        election_name: electionCrypto.shortName,
        secret_key: electionCrypto.getSecretKey(),
      });
    });
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + JSON.stringify(keys)
    );
    element.setAttribute("download", "keys.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlerButtonCheckSk = () => {
    setCheckSkActive(!checkSkActive);
    shortNames.forEach((shortName) => {
      const key = new CheckSecretKey(shortName, uuidTrustee);
      key.initParams();
      setCheckCrypto((prev) => [...prev, key]);
    });
  };

  const handlerButtonDecryptProve = () => {
    setDecryptProveActive(!decryptProveActive);
    shortNames.forEach((shortName) => {
      const key = new DecryptAndProve(shortName, uuidTrustee);
      setDecryptCrypto((prev) => [...prev, key]);
    });
  };

  if (!load) {
    return <LoadPage />;
  }

  if (!auth) {
    return <NoAuth title={"Custodio de Claves"} message={noAuthMessage} />;
  } else {
    return (
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar />
            <TitlePsifos
              namePage="Portal de Custodio de Clave"
              nameElection={`Custodio ${trustee.name}`}
            />
          </div>
        </section>

        <section className="section" id="medium-section">
          <div className="container has-text-centered is-max-desktop">
            <div className="d-flex ">
              <button
                onClick={prepareElections}
                className="button-custom home-admin-button btn-fixed-mobile is-size-7-mobile button"
              >
                Elegir
              </button>
              {electionsCrypto.length > 0 && (
                <button
                  className="button-custom home-admin-button btn-fixed-mobile is-size-7-mobile button ml-2"
                  onClick={generateMultipleKeys}
                >
                  Generar claves
                </button>
              )}
              <button
                onClick={(event) => {
                  setSynchronizeActive(!synchronizeActive);
                }}
                className="button-custom home-admin-button is-size-7-mobile button ml-2"
              >
                Iniciar Sincronización
              </button>
              <button
                onClick={handlerButtonCheckSk}
                className="button-custom home-admin-button is-size-7-mobile button ml-2"
              >
                Chequear clave
              </button>
              <button
                onClick={handlerButtonDecryptProve}
                className="button-custom home-admin-button is-size-7-mobile button ml-2"
              >
                Desencriptación
              </button>
            </div>
            {synchronizeActive && (
              <div className="mt-4">
                <Synchronize electionsCrypto={electionsCrypto} />
              </div>
            )}
            {checkSkActive && (
              <div className="mt-4">
                <CheckSk
                  electionsCrypto={checkCrypto}
                  setFeedbackMessage={setFeedbackMessage}
                />
              </div>
            )}
            {decryptProveActive && (
              <div className="mt-4">
                <DecryptProve electionsCrypto={decryptCrypto} />
              </div>
            )}
            {feedbackMessage.length > 0 && (
              <div className="mt-4">
                {feedbackMessage.map((message, index) => {
                  return <p key={index}>{message}</p>;
                })}
              </div>
            )}
            <div>
              {trusteesCrypto.map((trusteeCrypto, index) => {
                return (
                  <CustodioSelector
                    key={index}
                    trusteeCrypto={trusteeCrypto}
                    uuidTrustee={uuidTrustee}
                    index={index}
                    setShortNames={setShortNames}
                    electionsCrypto={electionsCrypto}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <div>
          <ImageFooter imagePath={imageTrustees} />
          <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
        </div>
      </div>
    );
  }
}
