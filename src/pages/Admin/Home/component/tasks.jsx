import {
  closeElection,
  combineDecryptions,
  computeTally,
  initElection,
} from "../../../../services/election";

/** Different possible tasks for the elections **/
export const tasks = {
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
  "Computing Tally": {
    textHelp: "Esperando a que se computen los Tallys",
  },
  "Tally computed": {
    textHelp: "Esperando a recibir las desencriptaciones",
  },
  "Decryptions combined": {
    textHelp: "Desencriptaciones listas, los resultados están calculados",
  },
  "Results released": {
    textHelp: "Los resultados están publicados",
  },
  "Can combine decryptions": {
    buttonText: "Combinar",
    action: async (shortName) => {
      return await combineDecryptions(shortName);
    },
  },
};
