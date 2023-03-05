import { useParams, useSearchParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

function UrnaTable(props) {
  const [searchParams] = useSearchParams();

  const hashUrl =
    searchParams.get("hash") !== null ? searchParams.get("hash") : undefined;
  const { uuid } = useParams();

  const openWindowVote = (voteHash) => {
    window.open(
      `${backendInfoIp}/election/${uuid}/cast-vote/${encodeURIComponent(
        voteHash
      )}`,
      "_blank"
    );
  };
  return (
    <Table className="pretty table is-bordered is-hoverable voters-table">
      <Thead>
        <Tr>
          <Th className="has-text-centered">Ponderador</Th>
          <Th className="has-text-centered">Código de papeleta</Th>
          <Th className="has-text-centered">Ver voto</Th>
        </Tr>
      </Thead>
      {props.electionData.electionVoters.map((voter, index) => {
        const voterHash = voter.cast_vote ? voter.cast_vote.vote_hash : "-";
        return (
          <Tbody key={index}>
            <Tr>
              <Td
                className={
                  "align-middle has-text-centered " +
                  (hashUrl === voterHash ? "hash-selected" : "")
                }
              >
                {voter.voter_weight}
              </Td>
              <Td
                className={
                  "align-middle has-text-centered " +
                  (hashUrl === voterHash ? "hash-selected" : "")
                }
              >
                <span className="urna-voter-hash">{voterHash}</span>
              </Td>
              <Td
                className={
                  "align-middle has-text-centered " +
                  (hashUrl === voterHash ? "hash-selected" : "")
                }
              >
                {voterHash !== "-" ? (
                  <div
                    onClick={() => {
                      openWindowVote(voter.cast_vote.vote_hash);
                    }}
                    className="button-redirect-vote ml-2 mr-2"
                  >
                    <i className="fa-solid fa-check-to-slot mr-1"></i>
                    Ver Voto Encriptado
                  </div>
                ) : (
                  "-"
                )}
              </Td>
            </Tr>
          </Tbody>
        );
      })}
    </Table>
  );
}

export default UrnaTable;
