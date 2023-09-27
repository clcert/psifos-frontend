import ModalFreeze from "../AdministrationPanel/component/ModalFreeze";
import ModalCloseElection from "../AdministrationPanel/component/ModalCloseElection";
import ModalTally from "../AdministrationPanel/component/ModalTally";
import ModalCombineTally from "../AdministrationPanel/component/ModalCombineTally";
import UploadModal from "../VotersList/components/UploadModal";
import CardElection from "./component/CardElection";
import AlertNotification from "../component/AlertNotification";
import { Link } from "react-router-dom";
import { electionStatusTranslate } from "../../../constants";
import { Button } from "react-bulma-components";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import {
  closeElection,
  combineDecryptions,
  computeTally,
  getElections,
  initElection,
} from "../../../services/election";

function ShowFeedbackMessage({
  feedbackMessage, handleFeedbackMessage, typeFeedback,
}){
  return (
    Boolean(feedbackMessage) && (
      <div className={`notification is-primary ${typeFeedback}`}>
        <button
          className="delete"
          onClick={handleFeedbackMessage}
        />
        {feedbackMessage}
      </div>
    )
  )
}

function Resume({
  infoMessages, electionShowed, refreshElections, handleInfoMessages,
}) {
  return (
    <div className="box row justify-content-between">
      <AlertNotification
        alertMessage={infoMessages.success}
        type="success"
      />
      <AlertNotification
        alertMessage={infoMessages.danger}
        type="danger"
      />
      {Object.keys(electionShowed).map((status, index) => {
        return (
          <CardElectionRecount
            key={index}
            status={status}
            elections={electionShowed[status]}
            refreshElections={refreshElections}
            setInfoMessages={handleInfoMessages}
          />
        );
      })}
    </div>
  )
}

function CardElectionRecount({
  elections,
  status,
  refreshElections,
  setInfoMessages,
}) {
  /** @state {boolean} active consent */
  const [activeConsent, setActiveConsent] = useState(false);

  /** @state {number} total elections */
  const [totalElections, setTotalElections] = useState(0);

  useEffect(() => {
    setTotalElections(elections.length);
  }, [elections]);

  /**
   * Different possible tasks for the elections
   */
  const tasks = {
    "Setting up": {
      buttonText: "Iniciar Elecciones",
      action: async (shortName) => {
        return await initElection(shortName);
      },
    },
    Started: {
      buttonText: "Cerrar elecciones",
      action: async (shortName) => {
        return await closeElection(shortName);
      },
    },
    Ended: {
      buttonText: "Computar Tallys",
      action: async (shortName) => {
        return await computeTally(shortName);
      },
    },
    "Tally computed": {
      textHelp: "Esperando a recibir las desencriptaciones",
    },
    "Decryptions combined": {
      textHelp: "Desencriptaciones listas, los resultados están calculados",
    },
    "Can combine decryptions": {
      buttonText: "Combinar",
      action: async (shortName) => {
        return await combineDecryptions(shortName);
      },
    },
  };

  /**
   * It is in charge of executing the desired process of the elections
   *
   * @author Cristóbal Jaramillo
   */
  const handler = async () => {
    let successElections = [];
    let errorElections = [];
    const promises = elections.map(async (election) => {
      try {
        const resp = await tasks[status].action(election.short_name);
        if (resp.status === 200) {
          successElections = [...successElections, election.name];
        } else {
          errorElections = [...errorElections, election.name];
        }
      } catch (error) {
        errorElections = [...errorElections, election.name];
      }
    });

    await Promise.all(promises);

    setTimeout(refreshElections, 1000);
    let successMessage =
      successElections.length > 0
        ? "Las elecciones " +
          successElections.join(", ") +
          " fueron procesadas con éxito."
        : "";
    successMessage = successMessage.endsWith(", ")
      ? successMessage.slice(0, -2)
      : successMessage;

    let dangerMessage =
      errorElections.length > 0
        ? "Las elecciones " +
          errorElections.join(", ") +
          " tuvieron problemas para ser procesadas, es posible que falte configurar o procesar datos."
        : "";
    dangerMessage = dangerMessage.endsWith(", ")
      ? dangerMessage.slice(0, -2)
      : dangerMessage;
    setInfoMessages({
      danger: dangerMessage,
      success: successMessage,
    });
    refreshElections();
    setActiveConsent(false);
  };

  return (
    <>
      <div className="box col-sm-3 col-12 m-0 mb-3" style={{ minWidth: "30%" }}>
        <span>
          Tienes {totalElections}{" "}
          {totalElections > 1 ? "elecciones" : "elección"} en estado:{" "}
        </span>
        <span className="panel-text-sect">
          {electionStatusTranslate[status]}{" "}
        </span>
        {tasks[status]?.action &&
          (!activeConsent ? (
            <div className="d-flex justify-content-center mt-4">
              <Button
                className="button-custom home-admin-button btn-fixed"
                onClick={() => {
                  setActiveConsent(true);
                }}
              >
                {tasks[status].buttonText}
              </Button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <span>¿Seguro?</span>
              </div>
              <div className="d-flex justify-content-center mt-1">
                <Button
                  className="button-custom home-admin-button btn-fixed"
                  onClick={handler}
                >
                  Si
                </Button>
                <Button
                  className="button-custom home-admin-button btn-fixed"
                  onClick={() => {
                    setActiveConsent(false);
                  }}
                >
                  No
                </Button>
              </div>
            </>
          ))}
        {tasks[status]?.textHelp && (
          <div className="p-2">
            <span style={{ fontStyle: "italic" }}>
              **{tasks[status].textHelp}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function ElectionList({
  electionsPage, electionSelected, electionSelectedHandler,
  freezeModalHandler, closeModalHandler, tallyModalHandler,
  combineTallyHandler, uploadModalHandler,
}) {
  return (
    electionsPage.map((election, index) => {
      const modalParams = {
        state: true,
        shortName: election.short_name,
      }
      return (
        <CardElection
          key={index}
          election={election}
          electionStatus={election.election_status}
          electionSelected={electionSelected}
          handlerElectionSelected={electionSelectedHandler(election)}
          freezeModal={() => freezeModalHandler(modalParams)}
          closeModal={() => closeModalHandler(modalParams)}
          tallyModal={() => tallyModalHandler(modalParams)}
          combineTallyModal={() => combineTallyHandler(modalParams)}
          uploadModalonClick={(_) => uploadModalHandler(modalParams)}
        />
      )
    })
  )
}

function ElectionListButton({
  isDisabled, onClickHandler, message,
}) {
  return(
    <div className="d-flex mt-2">
      <Button
        className="button-custom home-admin-button btn-fixed"
        disabled={isDisabled}
        onClick={onClickHandler}
      >
        {message}
      </Button>
    </div>
  )
}

function ElectionListButtons({
  isPreviousDisabled, previousHandler,
  isNextDisabled, nextHandler,
}) {
  return (
    <div className="d-flex justify-content-between mt-4">
      <ElectionListButton
        isDisabled={isPreviousDisabled}
        onClickHandler={previousHandler}
        message="Anterior"
      />
      <ElectionListButton
        isDisabled={isNextDisabled}
        onClickHandler={nextHandler}
        message="Siguiente"
      />
    </div>
  )
}

function GeneralAdmin() {
  /** @state {array} all elections */
  const [elections, setElections] = useState([]);

  /** @state {array} elections showed in the election */
  const [electionsPage, setElectionsPage] = useState([]);

  /** @state {number} page elections */
  const [actualPage, setActualPage] = useState(0);

  /** @state {json} state modal freeze */
  const [freezeModal, setFreezeModal] = useState({
    state: false,
    shortName: "",
  });

  /** @state {json} state modal close election */
  const [closeModal, setCloseModal] = useState({ state: false, shortName: "" });

  /** @state {json} tally modal close election */
  const [tallyModal, setTallyModal] = useState({ state: false, shortName: "" });

  /** @state {json} state modal combine tally election */
  const [combineTallyModal, setCombineTallyModal] = useState({
    state: false,
    shortName: "",
  });

  /** @state {string} message with feeback for admin */
  const [feedbackMessage, setFeedbackMessage] = useState("");

  /** @state {string} feeback type for admin */
  const [typeFeedback, setTypeFeedback] = useState("");

  /** @state {bool} state for load information from backend */
  const [load, setLoad] = useState(false);

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState({
    state: false,
    shortName: "",
  });

  /** @state {object} Total election to show */
  const [electionsRecount, setElectionsRecount] = useState({});

  /** @state {object} Selected election to show */
  const [electionSelected, setElectionSelected] = useState([]);

  /** @state {object} Selected election to show */
  const [electionShowed, setElectionShowed] = useState({});

  /** @state {object} Messages feedback */
  const [infoMessages, setInfoMessages] = useState({
    danger: "",
    success: "",
  });

  const electionsForPage = 3;
  const nextDisabled =
    actualPage * electionsForPage + electionsForPage >= elections.length;
  const previousDisabled = actualPage === 0;

  function updateElectionStatus(shortName, status) {
    let auxElections = elections;
    for (let i = 0; i < auxElections.length; i++) {
      if (auxElections[i].short_name === shortName) {
        auxElections[i].election_status = status;
      }
    }
    setElections(auxElections);
  }

  const updateElections = useCallback(() => {
    const selectedElections = elections.slice(
      actualPage * electionsForPage,
      actualPage * electionsForPage + electionsForPage
    );
    setElectionsPage(selectedElections);
  }, [actualPage, elections]);

  useEffect(() => {
    setElectionsPage([]);
    updateElections();
  }, [actualPage, updateElections]);

  /**
   * Check if decryptions can be combined
   *
   * @param {*} election to check
   * @returns bool
   *
   * @author Cristóbal Jaramillo
   */
  const canCombineDecryptions = (election) => {
    return (
      election.election_status === "Decryptions uploaded" ||
      (election.election_status === "Tally computed" &&
        election.decryptions_uploaded >=
          Math.floor(election.total_trustees / 2) + 1)
    );
  };

  /**
   * Refreshes elections in case of changes
   *
   * @author Cristóbal Jaramillo
   */
  const refreshElections = () => {
    getElections().then((res) => {
      const { resp, jsonResponse } = res;
      if (resp.status === 200) {
        setElections(jsonResponse);
        const auxJson = {};
        jsonResponse.forEach((election) => {
          let status = election.election_status;
          if (canCombineDecryptions(election)) {
            status = "Can combine decryptions";
          }
          auxJson[status] =
            status in auxJson ? [...auxJson[status], election] : [election];
        });

        setElectionsRecount(auxJson);
        setElectionShowed(auxJson);
        setElectionSelected({});
        setLoad(true);
      }
    });
  };

  /**
   * Action of selecting an election
   *
   * @param {object} election selected
   * @param {boolean} checked
   *
   * @author Cristóbal Jaramillo
   */

  const handlerElectionSelected = (election, checked) => {
    let status = election.election_status;

    if (canCombineDecryptions(election)) {
      status = "Can combine decryptions";
    }
    let selected = { ...electionSelected };
    if (checked) {
      selected[status] =
        status in selected ? [...selected[status], election] : [election];
    } else {
      selected[status] = selected[status].filter(
        (item) => item.short_name !== election.short_name
      );
    }

    setElectionSelected(selected);
    setElectionShowed(selected);
  };

  /**
   * Discriminate between showing all or selected ones
   */
  useEffect(() => {
    if (
      Object.values(electionSelected).every(
        (arr) => Array.isArray(arr) && arr.length === 0
      )
    ) {
      setElectionShowed(electionsRecount);
      return;
    }
    setElectionShowed(electionSelected);
  }, [electionSelected]);

  useEffect(() => {
    refreshElections();
  }, []);

  return (
    <>
      <div id="content-home-admin">
        <div className="voters-section is-flex is-flex-direction-column is-align-items-center">
          {load ? (
            <div className="container is-max-desktop">
              <ShowFeedbackMessage
                feedbackMessage={feedbackMessage}
                handleFeedbackMessage={() => setFeedbackMessage("")}
                typeFeedback={typeFeedback}
              />
              <Resume
                infoMessages={infoMessages}
                electionShowed={electionShowed}
                refreshElections={refreshElections}
                handleInfoMessages={setInfoMessages}
              />
              <ElectionList
                electionsPage={electionsPage}
                electionSelected={electionSelected}
                electionSelectedHandler={(election) => {
                  return (
                    (checked) => handlerElectionSelected(election, checked)
                  )
                }}
                freezeModalHandler={setFreezeModal}
                closeModalHandler={setCloseModal}
                tallyModalHandler={setTallyModal}
                combineTallyHandler={setCombineTallyModal}
                uploadModalHandler={setUploadModal}
              />
              <ElectionListButtons
                isPreviousDisabled={previousDisabled}
                previousHandler={() => setActualPage(actualPage - 1)}
                isNextDisabled={nextDisabled}
                nextHandler={() => setActualPage(actualPage + 1)}
              />
            </div>
          ) : (
            <div className="spinner-animation"/>
          )}

          <FooterParticipa message="Participa UChile - 2023 - Universidad de Chile" />
        </div>

        <ModalFreeze
          show={freezeModal.state}
          onHide={() => setFreezeModal(false)}
          freezeChange={() =>
            updateElectionStatus(freezeModal.shortName, "Started")
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={freezeModal.shortName}
        />
        <ModalCloseElection
          show={closeModal.state}
          onHide={() => setCloseModal(false)}
          endChange={() => updateElectionStatus(closeModal.shortName, "Ended")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={closeModal.shortName}
        />

        <ModalTally
          show={tallyModal.state}
          onHide={() => setTallyModal(false)}
          tallyChange={() =>
            updateElectionStatus(tallyModal.shortName, "Tally computed")
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={tallyModal.shortName}
        />

        <ModalCombineTally
          show={combineTallyModal.state}
          onHide={() => setCombineTallyModal(false)}
          combineChange={() =>
            updateElectionStatus(
              combineTallyModal.shortName,
              "Decryptions combined"
            )
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={combineTallyModal.shortName}
        />
        <UploadModal
          show={uploadModal.state}
          onHide={() => setUploadModal(false)}
          shortName={uploadModal.shortName}
        />
      </div>
    </>
  );
}

export default GeneralAdmin;
