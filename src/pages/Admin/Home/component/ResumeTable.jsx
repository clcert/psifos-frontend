import { Button } from "react-bulma-components";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { useState } from "react";
import { tasks } from "./tasks";
import { translateStep } from "../../../../utils/utils";

function StateActionButton({ handler, message }) {
  return (
    <Button
      className={`button-custom home-admin-button btn-fixed-mobile is-size-7-mobile`}
      onClick={handler}
    >
      {message}
    </Button>
  );
}

function StateAction({ elections, status, refreshElections, setInfoMessages }) {
  /** @state {boolean} active consent */
  const [activeConsent, setActiveConsent] = useState(false);
  return (
    <>
      {tasks[status]?.action &&
        (!activeConsent ? (
          <div className="d-flex justify-content-center">
            <StateActionButton
              handler={() => setActiveConsent(true)}
              message={tasks[status].buttonText}
            />
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-center">
              <span>¿Seguro?</span>
            </div>
            <div className="d-flex justify-content-center">
              <StateActionButton
                handler={async () =>
                  await electionsHandler(
                    elections,
                    status,
                    refreshElections,
                    setInfoMessages,
                    setActiveConsent
                  )
                }
                message="Si"
              />
              <StateActionButton
                handler={() => setActiveConsent(false)}
                message="No"
              />
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
    </>
  );
}

/**
 * It is in charge of executing the desired process of the elections
 *
 * @author Cristóbal Jaramillo
 */
const electionsHandler = async (
  elections,
  status,
  refreshElections,
  setInfoMessages,
  setActiveConsent
) => {
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

function ContentRow({ contentArr }) {
  return (
    <Tr>
      {contentArr.map((content, index) => {
        return (
          <Td
            className={
              typeof content === "number"
                ? "has-text-right"
                : "has-text-centered"
            }
            key={`${index}-${contentArr[0]}`}
          >
            {content}
          </Td>
        );
      })}
    </Tr>
  );
}

export default function ResumeTable({
  electionShowed,
  refreshElections,
  handleInfoMessages,
}) {
  return (
    <div className="d-flex disable-text-selection row justify-content-md-center mx-3">
      <Table
        id="resume-table"
        className="mt-2 table is-bordered is-hoverable voters-table"
      >
        <Thead>
          <Tr>
            <Th className="has-text-centered">Estado</Th>
            <Th className="has-text-centered">N° elecciones</Th>
            <Th className="has-text-centered">Sgte acción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(electionShowed).map((status, index) => {
            return (
              electionShowed[status].length !== 0 && (
                <ContentRow
                  key={`content-${index}`}
                  contentArr={[
                    translateStep(status),
                    electionShowed[status].length,
                    <StateAction
                      elections={electionShowed[status]}
                      status={status}
                      refreshElections={refreshElections}
                      setInfoMessages={handleInfoMessages}
                    />,
                  ]}
                />
              )
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}
