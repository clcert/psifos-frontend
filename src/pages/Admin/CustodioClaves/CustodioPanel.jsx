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
  initPanel,
  cryptoGenerateKey,
  setCryptoGenerateKey,
}) {
  const [electionsCrypto, setElectionsCrypto] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [initProcess, setInitProcess] = useState(false);
  const [processCompleted, setProcessCompleted] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [keysGenerated, setKeysGenerated] = useState(false);
  const [electionCompleted, setElectionCompleted] = useState([]);

  const updateFeedback = (index, message) => {
    setFeedback((prev) => {
      const updatedFeedback = [...prev];
      updatedFeedback[index] = message;
      return updatedFeedback;
    });

    if (message === ": Generación de Claves completada con éxito ✅") {
      setElectionCompleted((prev) => {
        const updatedCompleted = [...prev];
        updatedCompleted[index] = true;
        return updatedCompleted;
      });

      setCryptoGenerateKey((prev) => {
        const updatedCrypto = [...prev];
        updatedCrypto[index] = null;
        return updatedCrypto;
      });
      initPanel(); // Reinitialize the panel to update the state
    }
  };

  useEffect(() => {
    if (electionsCrypto.length > 0) {
      const allCompleted = electionsCrypto.every((_, index) => electionCompleted[index]);
      if (allCompleted) {
        setProcessCompleted(true);
      }
    }
  }, [electionCompleted, electionsCrypto]);
        

  const prepareToSynchronize = async () => {
    setIsPreparing(true);
    const preparedElections = await Promise.all(
      electionsSelected.map(async (shortName, index) => {
        updateFeedback(index, ": Esperando generación de clave privada...");
        setElectionCompleted((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
        const key = new KeyGenerator(shortName, index, updateFeedback);
        await key.initParams();
        return key;
      })
    );
    setElectionsCrypto(preparedElections);
    setIsPreparing(false);
  };

  const generateKeysAndDownload = () => {
    const keys = electionsCrypto.map((electionCrypto) => {
      electionCrypto.generateKeyPair();
      updateFeedback(electionCrypto.index, ": Clave Privada Generada");
      return {
        election_name: electionCrypto.shortName,
        secret_key: electionCrypto.getSecretKey(),
      };
    });

    const trusteeName = electionsCrypto[0]?.trustee?.name.replace(/\s/g, "") || "CustodioClave";
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + JSON.stringify(keys)
    );
    element.setAttribute("download", `ClavePrivada_${trusteeName}.json`);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setKeysGenerated(true);
  };

  const synchronizeKeys = (secretKeyArray) => {
    setInitProcess(true);
    electionsCrypto.forEach((electionCrypto) => {
      const secretKey = secretKeyArray.find(
        (key) => key.election_name === electionCrypto.shortName
      );
      electionCrypto.checkSk(secretKey.secret_key);
    });
  };

  return (
    <>
      <div className="mb-4">
        {!initProcess && electionsCrypto.length === 0 && (
          <button
            className="button is-medium"
            onClick={prepareToSynchronize}
            disabled={isPreparing}
          >
            Iniciar Generación de Claves
          </button>
        )}
        {electionsCrypto.length > 0 && (
          <button className="button is-medium" onClick={generateKeysAndDownload}>
            Descargar Clave Privada
          </button>
        )}
      </div>
      {isPreparing && (
        <div className="d-flex justify-content-center">
          <div className="spinner-animation" />
        </div>
      )}
      {initProcess && !processCompleted && (
        <div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <div className="spinner-animation" />
          </div>
          <div className="text-center">
            <h3 className="mt-4">Generando claves, por favor espera...</h3>
          </div>
          <hr />
        </div>
      )}
      {processCompleted && initProcess && (
        <div className="d-flex flex-column justify-content-center">
          <div className="text-center">
            <h3 className="mt-4">Proceso completado ✅</h3>
          </div>
          <hr />
        </div>
      )}
      {keysGenerated && !initProcess && electionsCrypto.length > 0 && (
        <DropFile setText={synchronizeKeys} />
      )}
      <div className="my-4">                                                                     
        {electionsCrypto.map((electionCrypto, index) => (
          <div key={index}>
            <h3>
              {electionCrypto.shortName}
              {feedback[index]}
            </h3>
          </div>
        ))}
      </div>
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

function DecryptProveSection({ electionsSelected, cryptoDecryptProve, initPanel}) {
  const [electionsCrypto, setElectionsCrypto] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [initProcess, setInitProcess] = useState(false);
  const [processCompleted, setProcessCompleted] = useState(false);
  const [electionCompleted, setElectionCompleted] = useState([]);

  const setFeedbacks = (index, value) => {
    if (value === ": Desencriptación Parcial Completada ✓") {
      setElectionCompleted((prev) => {
        const updatedCompleted = [...prev];
        updatedCompleted[index] = true;
        return updatedCompleted;
      });
      initPanel(); // Reinitialize the panel to update the state
    }
    setFeedback((prev) => {
      const newFeedback = [...prev]; // Crear una nueva copia del estado anterior
      newFeedback[index] = value; // Actualizar la copia
      return newFeedback; // Retornar la nueva copia
    });
  };

  useEffect(() => {
    if (electionsCrypto.length > 0) {
      const allCompleted = electionsCrypto.every((_, index) => electionCompleted[index]);
      if (allCompleted) {
        setProcessCompleted(true);
      }
    }
  }, [electionCompleted, electionsCrypto]);

  const prepareToDecrypt = () => {
    electionsSelected.forEach((shortName, index) => {
      setElectionCompleted((prev) => {
        const updatedCompleted = [...prev];
        updatedCompleted[index] = false;
        return updatedCompleted;
      });
      const key = new DecryptAndProve(shortName, index, setFeedbacks);
      setElectionsCrypto((prev) => [...prev, key]);
    });
  };
  
  const decrypt = (secretKeyArray) => {
    setInitProcess(true);
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
            Desencriptar Elecciones
          </button>
        )}
      </div>
      {initProcess && !processCompleted && (
        <div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <div className="spinner-animation" />
          </div>
          <div className="text-center">
            <h3 className="mt-4">Realizando proceso de Desencriptación</h3>
          </div>
          <hr />
        </div>
      )}
      {processCompleted && initProcess && (
        <div className="d-flex flex-column justify-content-center">
          <div className="text-center">
            <h3 className="mt-4">Proceso completado ✅</h3>
          </div>
          <hr />
        </div>
      )}
      {!initProcess && electionsCrypto.length > 0 && <DropFile setText={decrypt} />}
      <div className="my-4">                                                                     
        {electionsCrypto.map((electionCrypto, index) => (
          <div key={index}>
            <h3>
              {electionCrypto.shortName}
              {feedback[index]}
            </h3>
          </div>
        ))}
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
    let currentElectionsSelected = [...electionsSelected];

    trusteesCrypto.forEach((tc, idx) => {
      otherTags.forEach(tag => {
        newCheckboxes[`${tag}${idx}`] = false;
      });
    });

    const currentChecked = !checkboxes[id];
    newCheckboxes[id] = currentChecked;
    if(currentChecked) {
      currentElectionsSelected.push(shortName);
    }
    else {
      currentElectionsSelected = currentElectionsSelected.filter(election => election !== shortName);
    }

    setCheckboxes(newCheckboxes);

    setUIStates({
      showKeyGeneration: tagName === "keygeneration_",
      showVerifyKey: tagName === "verify_",
      showDecryptProve: tagName === "decrypt_",
    });

    setElectionsSelected(currentElectionsSelected);
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

          {/* 👇 Tabla envuelta en table-container para scroll horizontal en móvil */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Elección</th>
                  {["Generación de Claves", "Verificación de Claves", "Desencriptación de Resultado"].map((text, i) => (
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
                {trusteesCrypto.map((trusteeCrypto, index) => {
                  const { election_short_name, election_status, current_step } = trusteeCrypto;
                  const conditionsElection = {
                    verify_:
                      [
                        electionStatus.readyForOpening,
                        electionStatus.started,
                        electionStatus.ended,
                        electionStatus.computingTally,
                        electionStatus.tallyComputed,
                      ].includes(election_status) && current_step === 5,
                    decrypt_:
                      election_status === electionStatus.tallyComputed &&
                      current_step === 5,
                  };

                  const renderCheckbox = (idPrefix) =>
                    conditionsElection[idPrefix] ? (
                      <input
                        type="checkbox"
                        name={election_short_name}
                        id={`${idPrefix}${index}`}
                        checked={checkboxes[`${idPrefix}${index}`] || false}
                        onChange={() =>
                          toggleCheckbox(`${idPrefix}${index}`, idPrefix, election_short_name)
                        }
                      />
                    ) : current_step === 6 ? (
                      "✅"
                    ) : (
                      "⏳"
                    );

                  const renderKeyGeneration = () =>
                    election_status === electionStatus.readyForKeyGeneration ? (
                      <input
                        type="checkbox"
                        name={election_short_name}
                        id={`keygeneration_${index}`}
                        checked={checkboxes[`keygeneration_${index}`] || false}
                        onChange={() =>
                          toggleCheckbox(`keygeneration_${index}`, "keygeneration_", election_short_name)
                        }
                      />
                    ) : current_step >= trusteeStep.points_step ? (
                      "✅"
                    ) : "⏳";

                  return (
                    <tr key={index}>
                      <th>{election_short_name}</th>
                      <td className="has-text-centered">{renderKeyGeneration()}</td>
                      <td className="has-text-centered">{renderCheckbox("verify_")}</td>
                      <td className="has-text-centered">{renderCheckbox("decrypt_")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* 👆 */}

          <h1 className="title">Paso 2: Realizar Acción</h1>
          <h2 className="subtitle">Aprieta el botón para iniciar el proceso</h2>
          <div>
            {uiStates.showKeyGeneration && (
              <SynchronizeSection
                electionsSelected={electionsSelected}
                cryptoGenerateKey={cryptoState.generateKey}
                initPanel={initPanel}
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
                initPanel={initPanel}
              />
            )}
          </div>
        </div>
      </section>

      <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
    </div>
  );
}
