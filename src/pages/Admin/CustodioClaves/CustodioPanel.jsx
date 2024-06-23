import { useCallback, useEffect, useState } from "react";
import { getTrusteePanel } from "../../../services/trustee";
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
import Tabs from "../component/Tabs";

const getTrusteeStatus = (crypto) => {
  if (crypto.decryptions) {
    return "Desencriptaciones enviadas";
  }
  if (crypto.public_key) {
    return "Llave generada";
  }
  return "Llaves aun no generadas";
};

function CustodioSelector({ trusteeCrypto, index, setElectionsSelected }) {
  const handlerSelector = (e) => {
    setElectionsSelected((prev) => [...prev, e.target.value]);
  };

  return (
    <div className="box border-style-box my-4 p-2" key={index}>
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        onChange={handlerSelector}
        value={trusteeCrypto.election_short_name}
      />
      <p>{getTrusteeStatus(trusteeCrypto)}</p>
      <h1>{trusteeCrypto.election_short_name}</h1>
    </div>
  );
}

function ElectionDisplay({ trusteeCrypto }) {
  return (
    <div className="box border-style-box my-4 p-2">
      <p>{getTrusteeStatus(trusteeCrypto)}</p>
      <h1>{trusteeCrypto.election_short_name}</h1>
    </div>
  );
}

function SynchronizeSection({ cryptoGenerateKey, initPanel }) {
  const [electionsSelected, setElectionsSelected] = useState([]);
  const [electionsCrypto, setElectionsCrypto] = useState([]);

  const prepareToSynchronize = () => {
    const elections = [];
    electionsSelected.forEach((shortName) => {
      const key = new KeyGenerator(shortName);
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

  const synchronize = (secretKeyArray) => {
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      electionCrypto.checkSk(secretKey.secret_key);
    });
  };
  return (
    <>
      <div className="mb-4">
        <button
          className="button-custom home-admin-button is-size-7-mobile button ml-2"
          onClick={prepareToSynchronize}
        >
          Seleccionar Elecciones
        </button>
        <button
          className="button-custom home-admin-button btn-fixed-mobile is-size-7-mobile button ml-2"
          onClick={generateMultipleKeys}
        >
          Generar claves
        </button>
      </div>
      <DropFile setText={synchronize} />
      {cryptoGenerateKey.map((trusteeCrypto, index) => {
        return (
          <CustodioSelector
            key={index}
            trusteeCrypto={trusteeCrypto}
            index={index}
            setElectionsSelected={setElectionsSelected}
            electionsSelected={electionsSelected}
          />
        );
      })}
    </>
  );
}

function CheckSkSection({ cryptoCheckKey, setFeedbackMessage }) {
  const [electionsSelected, setElectionsSelected] = useState([]);
  const [electionsCrypto, setElectionsCrypto] = useState([]);

  const prepareToCheckSk = () => {
    electionsSelected.forEach((shortName) => {
      const key = new CheckSecretKey(shortName);
      key.initParams();
      setElectionsCrypto((prev) => [...prev, key]);
    });
  };
  const checkSk = (secretKeyArray) => {
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      const message = electionCrypto.checkSk(secretKey.secret_key);
      setFeedbackMessage((prev) => [...prev, message]);
    });
  };
  return (
    <>
      <div className="mb-4">
        <button
          className="button-custom home-admin-button is-size-7-mobile button ml-2"
          onClick={prepareToCheckSk}
        >
          Seleccionar Elecciones
        </button>
      </div>
      <DropFile setText={checkSk} />
      {cryptoCheckKey.map((trusteeCrypto, index) => {
        return (
          <CustodioSelector
            key={index}
            trusteeCrypto={trusteeCrypto}
            index={index}
            setElectionsSelected={setElectionsSelected}
          />
        );
      })}
    </>
  );
}

function DecryptProveSection({ cryptoDecryptProve }) {
  const [electionsSelected, setElectionsSelected] = useState([]);
  const [electionsCrypto, setElectionsCrypto] = useState([]);

  const prepareToDecrypt = () => {
    electionsSelected.forEach((shortName) => {
      const key = new DecryptAndProve(shortName);
      setElectionsCrypto((prev) => [...prev, key]);
    });
  };
  const decrypt = (secretKeyArray) => {
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      electionCrypto.handlerDecrypt(secretKey.secret_key);
    });
  };
  return (
    <>
      <div className="mb-4">
        <button
          className="button-custom home-admin-button is-size-7-mobile button ml-2"
          onClick={prepareToDecrypt}
        >
          Seleccionar Elecciones
        </button>
      </div>
      <DropFile setText={decrypt} />
      {cryptoDecryptProve.map((trusteeCrypto, index) => {
        return (
          <CustodioSelector
            key={index}
            trusteeCrypto={trusteeCrypto}
            index={index}
            setElectionsSelected={setElectionsSelected}
          />
        );
      })}
    </>
  );
}

export default function CustodioHome() {
  const [load, setLoad] = useState(false);
  const [trustee, setTrustee] = useState({});
  const [trusteesCrypto, setTrusteesCrypto] = useState([]);
  const [noAuthMessage, setNoAuthMessage] = useState("");
  const [auth, setAuth] = useState(false);

  const [actualTab, setActualTab] = useState(0);

  const [cryptoGenerateKey, setCryptoGenerateKey] = useState([]);
  const [cryptoCheckKey, setCryptoCheckKey] = useState([]);
  const [cryptoDecryptProve, setCryptoDecryptProve] = useState([]);

  const [feedbackMessage, setFeedbackMessage] = useState([]);

  const tabs = [
    "General",
    "Sincronización",
    "Chequear clave",
    "Desencriptación",
  ];

  const setCrypto = (trusteesCrypto) => {
    trusteesCrypto.forEach((trusteeCrypto) => {
      if (!trusteeCrypto.public_key) {
        setCryptoGenerateKey((prev) => [...prev, trusteeCrypto]);
      } else if (trusteeCrypto.public_key && !trusteeCrypto.decryptions) {
        setCryptoDecryptProve((prev) => [...prev, trusteeCrypto]);
      }
      if (trusteeCrypto.public_key) {
        setCryptoCheckKey((prev) => [...prev, trusteeCrypto]);
      }
    });
  };

  const initPanel = useCallback(() => {
    getTrusteePanel().then((data) => {
      try {
        const { resp, jsonResponse } = data;
        setLoad(true);
        if (resp.status === 200) {
          setAuth(true);
          setTrusteesCrypto(jsonResponse.trustee_crypto);
          setCrypto(jsonResponse.trustee_crypto);
          setTrustee(jsonResponse.trustee);
        } else {
          console.log("Error");
          setNoAuthMessage(jsonResponse.detail);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  useEffect(() => {
    initPanel();
  }, [initPanel]);

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
              <Tabs
                actualTab={actualTab}
                setActualTab={setActualTab}
                tabs={tabs}
              />
              {feedbackMessage.length > 0 && (
                <div className="mt-4">
                  {feedbackMessage.map((message, index) => {
                    return <p key={index}>{message}</p>;
                  })}
                </div>
              )}
            </div>
            {actualTab === 1 && (
              <div>
                <SynchronizeSection
                  cryptoGenerateKey={cryptoGenerateKey}
                  initPanel={initPanel}
                />
              </div>
            )}
            {actualTab === 2 && (
              <div>
                <CheckSkSection
                  cryptoCheckKey={cryptoCheckKey}
                  setFeedbackMessage={setFeedbackMessage}
                />
              </div>
            )}
            {actualTab === 3 && (
              <div>
                <DecryptProveSection cryptoDecryptProve={cryptoDecryptProve} />
              </div>
            )}
            {actualTab === 0 && (
              <div>
                {trusteesCrypto.map((trusteeCrypto, index) => {
                  return (
                    <ElectionDisplay
                      trusteeCrypto={trusteeCrypto}
                      key={index}
                    />
                  );
                })}
              </div>
            )}
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
