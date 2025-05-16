import { useCallback, useEffect, useState } from "react";
import { getTrusteePanel } from "../../../services/trustee";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import LoadPage from "../../../component/Loading/LoadPage";
import NoAuth from "../../Booth/NoAuth";
import KeyGenerator from "../../../crypto/KeyGenerator";
import DropFile from "./components/DropFile";
import CheckSecretKey from "../../../crypto/CheckSecretKey";
import DecryptAndProve from "../../../crypto/DecryptAndProve";
import { electionStatus, trusteeStep } from "../../../constants";

function SynchronizeSection({
  electionsSelected,
  cryptoGenerateKey,
  setCryptoGenerateKey,
}) {
  // const [electionsSelected, setElectionsSelected] = useState([]);
  const [electionsCrypto, setElectionsCrypto] = useState([]);
  const [initSynchronizeReady, setInitSynchronizeReady] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const setSteps = (index, value) => {
    setFeedback((prev) => {
      const newFeedback = [...prev]; // Crear una nueva copia del estado anterior
      newFeedback[index] = value; // Actualizar la copia
      return newFeedback; // Retornar la nueva copia
    });
    if (value === "Generación de claves completada con éxito") {
      setCryptoGenerateKey((prev) => {
        const newCrypto = [...prev];
        newCrypto[index] = null;
        return newCrypto;
      });
    }
  };

  const prepareToSynchronize = async () => {
    const elections = [];
    setInitSynchronizeReady(true);
    electionsSelected.forEach(async (shortName, index) => {
      const key = new KeyGenerator(shortName, index, setSteps);
      await key.initParams();
      elections.push(key);
      if (index === electionsSelected.length - 1) {
        setElectionsCrypto(elections);
        setInitSynchronizeReady(false);
        setSteps(index, " - Eleccion preparadas para la generación");
      }
    });
  };

  const generateMultipleKeys = () => {
    const keys = [];
    var trusteeUsername = "";
    electionsCrypto.forEach((electionCrypto) => {
      if (trusteeUsername === "") {
        trusteeUsername = electionCrypto.trustee.username;
      }
      electionCrypto.generateKeyPair();
      keys.push({
        election_name: electionCrypto.shortName,
        secret_key: electionCrypto.getSecretKey(),
      });
      setSteps(electionCrypto.index, " - Clave generada");
    });
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + JSON.stringify(keys)
    );
    element.setAttribute(
      "download",
      "LlavePrivada_" + trusteeUsername + ".key"
    );
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
        <button className="button is-medium" onClick={prepareToSynchronize}>
          Generar Claves
        </button>

        {electionsCrypto.length > 0 && (
          <button
            className="button is-medium"
            onClick={generateMultipleKeys}
          >
            Descargar Llave Privada
          </button>
        )}
      </div>

      {electionsCrypto.length > 0 && <DropFile setText={synchronize} />}
      <div className="my-4">
        {electionsCrypto.length > 0 &&
          feedback.map((value, index) => {
            return (
              <div key={index}>
                <h3>
                  {electionsCrypto[index].shortName} {value}
                </h3>
              </div>
            );
          })}
      </div>
      {initSynchronizeReady && (
        <div className="d-flex justify-content-center">
          <div className="spinner-animation" />
        </div>
      )}
    </>
  );
}

function CheckSkSection({ electionsSelected, cryptoCheckKey }) {
  const [electionsCrypto, setElectionsCrypto] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const prepareToCheckSk = () => {
    electionsSelected.forEach((shortName) => {
      const key = new CheckSecretKey(shortName);
      key.initParams();
      setElectionsCrypto((prev) => [...prev, key]);
    });
  };
  const checkSk = (secretKeyArray) => {
    setFeedback([]);
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (secretKey) => secretKey.election_name === electionCrypto.shortName
      );
      if(!secretKey) {
        setFeedback((prev) => [
          ...prev,
          `${electionCrypto.shortName}: No se encontró la clave`,
        ]);
        return;
      }
      const message = `${electionCrypto.shortName}: ${electionCrypto.checkSk(
        secretKey.secret_key
      )}`;
      setFeedback((prev) => [...prev, message]);
    });
  };
  return (
    <>
      <div className="mb-4">
        <button className="button is-medium" onClick={prepareToCheckSk}>
          Verificar claves
        </button>
      </div>
      {electionsCrypto.length > 0 && <DropFile setText={checkSk} />}
      {feedback.length > 0 && (
        <div className="mt-4">
          {feedback.map((message, index) => {
            return <h3 key={index}>{message}</h3>;
          })}
        </div>
      )}
    </>
  );
}

function DecryptProveSection({ electionsSelected, cryptoDecryptProve }) {
  const [electionsCrypto, setElectionsCrypto] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const setFeedbacks = (index, value) => {
    setFeedback((prev) => {
      const newFeedback = [...prev]; // Crear una nueva copia del estado anterior
      newFeedback[index] = value; // Actualizar la copia
      return newFeedback; // Retornar la nueva copia
    });
  };

  const prepareToDecrypt = () => {
    electionsSelected.forEach((shortName, index) => {
      const key = new DecryptAndProve(shortName, index, setFeedbacks);
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
        {cryptoDecryptProve.length > 0 && electionsCrypto.length === 0 && (
          <button className="button is-medium" onClick={prepareToDecrypt}>
            Desencriptar elecciones
          </button>
        )}
      </div>
      {electionsCrypto.length > 0 && <DropFile setText={decrypt} />}
      <div className="my-4">
        {feedback.map((value, index) => {
          return (
            <div key={index}>
              <h3>
                {electionsCrypto[index].shortName} {value}
              </h3>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default function CustodioHome() {
  const [load, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [trustee, setTrustee] = useState({});
  const [trusteesCrypto, setTrusteesCrypto] = useState([]);
  const [noAuthMessage, setNoAuthMessage] = useState("");
  const [electionsSelected, setElectionsSelected] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});

  const [uiStates, setUIStates] = useState({
    showKeyGeneration: false,
    showVerifyKey: false,
    showDecryptProve: false,
  });

  const [cryptoState, setCryptoState] = useState({
    generateKey: [],
    checkKey: [],
    decryptProve: [],
  });

  useEffect(() => {
    const initialCheckboxes = {};
    trusteesCrypto.forEach((_, index) => {
      ["keygeneration_", "verify_", "decrypt_"].forEach(tag => {
        initialCheckboxes[`${tag}${index}`] = false;
      });
    });
    setCheckboxes(initialCheckboxes);
  }, [trusteesCrypto]);

  const toggleCheckbox = (id, tagName, shortName) => {
    // Desactiva todos los checkboxes de las demás columnas
    const otherTags = ["keygeneration_", "verify_", "decrypt_"].filter(t => t !== tagName);
    const newCheckboxes = { ...checkboxes };
    const newSelected = [];

    trusteesCrypto.forEach((tc, idx) => {
      otherTags.forEach(tag => {
        newCheckboxes[`${tag}${idx}`] = false;
      });
    });

    const currentChecked = !checkboxes[id];
    newCheckboxes[id] = currentChecked;

    if (currentChecked) {
      newSelected.push(shortName);
    }

    setCheckboxes(newCheckboxes);

    setUIStates({
      showKeyGeneration: tagName === "keygeneration_",
      showVerifyKey: tagName === "verify_",
      showDecryptProve: tagName === "decrypt_",
    });

    setElectionsSelected(currentChecked ? [shortName] : []);
  };

  const selectAllElections = (tagName) => {
    const otherTags = ["keygeneration_", "verify_", "decrypt_"].filter(t => t !== tagName);
    const newCheckboxes = { ...checkboxes };
    
    const newSelected = [];
    
    trusteesCrypto.forEach((trusteeCrypto, index) => {
      const status = trusteeCrypto.current_step;
      const tagsNameCondition = {
        keygeneration_: status < trusteeStep.points_step,
        verify_: status >= trusteeStep.points_step,
        decrypt_: status === trusteeStep.waiting_decryptions,
      }
      const id = `${tagName}${index}`;
      newCheckboxes[id] = true;
      if (tagsNameCondition[tagName]) {
        newSelected.push(trusteeCrypto.election_short_name);
      }

      // Desmarcar otros tags
      otherTags.forEach(tag => {
        newCheckboxes[`${tag}${index}`] = false;
      });
    });

    setCheckboxes(newCheckboxes);
    setElectionsSelected(newSelected);

    setUIStates({
      showKeyGeneration: tagName === "keygeneration_",
      showVerifyKey: tagName === "verify_",
      showDecryptProve: tagName === "decrypt_",
    });
  };

  const categorizeCrypto = (crypto) => {
    const newCrypto = { generateKey: [], checkKey: [], decryptProve: [] };

    crypto.forEach((item) => {
      if (!item.public_key) {
        newCrypto.generateKey.push(item);
      } else {
        newCrypto.checkKey.push(item);
        if (!item.decryptions) {
          newCrypto.decryptProve.push(item);
        }
      }
    });
    setCryptoState(newCrypto);
  };

  const initPanel = useCallback(async () => {
    try {
      const { resp, jsonResponse } = await getTrusteePanel();
      setLoad(true);

      if (resp.status === 200) {
        setAuth(true);
        setTrusteesCrypto(jsonResponse.trustee_crypto);
        categorizeCrypto(jsonResponse.trustee_crypto);
        setTrustee(jsonResponse.trustee);
      } else {
        setNoAuthMessage(jsonResponse.detail);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initPanel();
  }, [initPanel]);

  if (!load) return <LoadPage />;
  if (!auth)
    return <NoAuth title="Custodio de Claves" message={noAuthMessage} />;

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <TitlePsifos
            namePage={trustee.name}
            nameElection="Portal de Custodio de Clave"
          />
        </div>
      </section>

      <section className="section voters-section">
        <div className="container is-max-desktop">
          <h1 className="title">Paso 1: Seleccionar Elecciones</h1>
          <h2 className="subtitle">
            Selecciona las elecciones en la columna de la acción que deseas
            realizar
          </h2>
          <table className="table">
            <thead>
              <tr>
                <th>Elección</th>
                {["Generación de Llaves", "Verificación de Llaves", "Desencriptación de Resultado"].map((text, i) => (
                  <th key={i} className="has-text-centered">
                    <div>{text}</div>
                    <button
                      className="button is-small mt-2"
                      onClick={() => selectAllElections(["keygeneration_", "verify_", "decrypt_"][i])}
                    >
                      Seleccionar Todas
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trusteesCrypto.map((trusteeCrypto, index) => (
                <tr key={index}>
                  <th>{trusteeCrypto.election_short_name}</th>
                  <td className="has-text-centered">
                    {trusteeCrypto.election_status === electionStatus.readyForKeyGeneration ? (
                      <input
                        type="checkbox"
                        name={trusteeCrypto.election_short_name}
                        id={`keygeneration_${index}`}
                        checked={checkboxes[`keygeneration_${index}`] || false}
                        onChange={() => toggleCheckbox(`keygeneration_${index}`, "keygeneration_", trusteeCrypto.election_short_name)}
                      />
                    ) : (
                      trusteeCrypto.current_step >= trusteeStep.points_step && "✅"
                    )}
                  </td>
                  <td className="has-text-centered">
                    {trusteeCrypto.current_step >= trusteeStep.points_step ? (
                      <input
                        type="checkbox"
                        name={trusteeCrypto.election_short_name}
                        id={`verify_${index}`}
                        checked={checkboxes[`verify_${index}`] || false}
                        onChange={() => toggleCheckbox(`verify_${index}`, "verify_", trusteeCrypto.election_short_name)}
                      />
                    ) : (
                      trusteeCrypto.election_status === electionStatus.resultsReleased && "✅"
                    )}
                  </td>
                  <td className="has-text-centered">
                    {trusteeCrypto.election_status === electionStatus.tallyComputed ? (
                      <input
                        type="checkbox"
                        name={trusteeCrypto.election_short_name}
                        id={`decrypt_${index}`}
                        checked={checkboxes[`decrypt_${index}`] || false}
                        onChange={() => toggleCheckbox(`decrypt_${index}`, "decrypt_", trusteeCrypto.election_short_name)}
                      />
                    ) : (
                      trusteeCrypto.current_step === 6 && "✅"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h1 className="title">Paso 2: Realizar Acción</h1>
          <h2 className="subtitle">Aprieta el botón para iniciar el proceso</h2>
          <div>
            {uiStates.showKeyGeneration && (
              <SynchronizeSection
                electionsSelected={electionsSelected}
                cryptoGenerateKey={cryptoState.generateKey}
                setCryptoGenerateKey={(val) =>
                  setCryptoState((prev) => ({ ...prev, generateKey: val }))
                }
              />
            )}
            {uiStates.showVerifyKey && (
              <CheckSkSection
                electionsSelected={electionsSelected}
                cryptoCheckKey={cryptoState.checkKey}
              />
            )}
            {uiStates.showDecryptProve && (
              <DecryptProveSection
                electionsSelected={electionsSelected}
                cryptoDecryptProve={cryptoState.decryptProve}
              />
            )}
          </div>
        </div>
      </section>

      <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
    </div>
  );
}
