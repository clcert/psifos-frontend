import { backendOpIP } from "../../../server";
import { informalOptions } from "../../../constants";

// CREATE QUESTION INTERFACE
export const parseSavedQuestionList = (questions) => questions.map((question, index) => ({
    q_num: index,
    q_type: question.q_type ?? "CLOSED",
    q_text: question.q_text ?? "",
    q_description: question.q_description ?? "",
    total_options: question.total_options ?? 3,
    total_closed_options: question.total_closed_options ?? 2,
    closed_options: question.closed_options_list ?? [],
      options_specifications: question.options_specifications ?? [],
    open_option_max_size: question.open_option_max_size ?? 50,
    total_open_options: question.total_open_options ?? 0,
    num_of_winners: question.num_of_winners ?? 1,
    min_answers: question.min_answers ?? 1,
    max_answers: question.max_answers ?? 1,
    include_blank_null: question.include_blank_null,
    excluding_groups: question.excluding_groups,
    group_votes: question.group_votes
}))

export const getDefaultQuestion = (q_num) => ({
    q_num: q_num,
    q_type: "CLOSED",
    q_text: "",
    q_description: "",
    total_options: 0,
    total_closed_options: 2,
    closed_options: ["Voto Blanco", "Voto Nulo"],
    options_specifications: [],
    open_option_max_size: 50,
    total_open_options: 0,
    num_of_winners: 1,
    min_answers: 1,
    max_answers: 1,
    include_blank_null: true,
    excluding_groups: false,
    group_votes: false,
})

export const postQuestionList = async (
  shortName, newQuestionList, handleSuccess, handleError
) => {
  const token = localStorage.getItem("token");
  const resp = await fetch(backendOpIP + "/create-questions/" + shortName, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: newQuestionList,
    }),
  });
  if (resp.status === 200) {
    handleSuccess()
  } else {
    handleError(resp)
  }
}

export const isNotEmpty = (alert) => alert !== ""

// QUESTION CARD UTILS
export const generateClosedOptions = (
  includeInformal, ansList
) => includeInformal
? [...ansList, ...informalOptions] : ansList;

export const getListFromObjects = (arrayWithKeys) => {
  let auxAnswers = [];
  for (let i = 0; i < arrayWithKeys.length; i++) {
    auxAnswers[i] = arrayWithKeys[i].value;
  }
  return auxAnswers;
}
