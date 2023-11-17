export const isMixNetQuestion = (q) => q === "mixnet_question";

export const isClosedQuestion = (q) => q === "closed_question";

export const isSTVQuestion = (q) => q === "stvnc_question";

export const usesMixNetTally = (q) => isMixNetQuestion(q) || isSTVQuestion(q);

export const getBlankAnswerId = (closedOpt) => closedOpt.length;

export const getNullAnswerId = (closedOpt) => closedOpt.length + 1;
