import { 
  useState, useCallback, useEffect
} from "react";
import { useSelector } from "react-redux";
import FormalOptions from "./FormalOptions";

function InformalAnswer({
  button, setVote, label, id
}){
  return (
    <div>
      <label
        id=""
        className={
          "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2  " +
          (button ? "answer-selected" : "")
        }
      >
        <input
          className="custom-answer"
          type="radio"
          id={id}
          name={`vote_${id}`}
          checked={button}
          onChange={(event) => {
            setVote(event);
          }}
        />
        <span className="is-size-5">{label}</span>
      </label>
    </div>
  )
}

function InformalOptions({
  blankButton, nullButton,
  setBlankVote, setNullVote,
}) {

  return (
    <div>
      {" "}
      <InformalAnswer
        button={blankButton}
        setVote={setBlankVote}
        label="Voto Blanco"
        id="blank"
      />
      <InformalAnswer
        button={nullButton}
        setVote={setNullVote}
        label="Voto Nulo"
        id="null"
      />
    </div>
  )
}

function MixnetSelection({ question, addAnswer, numQuestion }) {
  const isGrouped = question.group_votes === "True";
  const otherOptionsName = "Otras Candidaturas";

  let answers = useSelector(
    (state) => state.booth.answers
  )[numQuestion] || [];

  const numOfOptions = question.closed_options.length

  /** @state {array} array with options for react-select */
  const [options, setOptions] = useState([]);

  /** @state {array} array with answers selected */
  const [answersSelected, setAnswersSelected] = useState([]);

  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [blankButton, setBlankButton] = useState(false);

  const includeBlankNull = question.include_blank_null === "True";
  const addAnswerCallback = useCallback(addAnswer, [addAnswer]);

  const changeAllEncrypted = useCallback(
    (number) => {
      let auxAnswersForEncrypt = [];
      for (let i = 0; i < question.max_answers; i++) {
        auxAnswersForEncrypt.push(number);
      }
      addAnswerCallback(auxAnswersForEncrypt, numQuestion);
      return auxAnswersForEncrypt
    },
    [addAnswerCallback, numQuestion, question]
  );

  const initComponent = useCallback(() => {
    const auxAnswersForEncrypt = changeAllEncrypted(
      question.closed_options.length
    );
    const auxOptions = [];
    question.closed_options.forEach((close_option, index) => {
      if (
        includeBlankNull &&
        (close_option === "Voto Blanco" || close_option === "Voto Nulo")
      )
        return;
      if (!isGrouped) {
        const optionValue = {
          value: close_option,
          label: close_option,
          key: index,
        };
        auxOptions.push(optionValue);
      } else {
        const optionSplit = close_option.split(",");
        const value = optionSplit[0];
        const group = optionSplit[1] ? optionSplit[1] : otherOptionsName;
        const optionValue = {
          value: value,
          label: value,
          key: index,
          group: group,
        };
        const indexGroup = auxOptions.find((object) => object.label === group);
        if (!indexGroup) {
          optionValue.position = 0;
          auxOptions.push({
            label: group,
            options: [optionValue],
          });
        } else {
          optionValue.position = indexGroup.options.length;
          indexGroup.options.push(optionValue);
        }
      }
    });
    moveToFinal(auxOptions, (element) => element.label === otherOptionsName);
    setOptions(auxOptions);
    addAnswerCallback(auxAnswersForEncrypt, numQuestion);
  }, [
    addAnswerCallback,
    changeAllEncrypted,
    includeBlankNull,
    isGrouped,
    numQuestion,
    question.closed_options,
  ]);

  useEffect(() => {
    initComponent();
  }, []);

  const moveToFinal = function (array, condition) {
    const indice = array.findIndex(condition);

    if (indice !== -1) {
      const elemento = array.splice(indice, 1)[0];
      array.push(elemento);
    }
  };

  const selectAnswers = useCallback(
    (event, index) => {
      /**
       * Select answers disabling the option
       * Eneabling previous option
       * @param {event} event of selector
       * @param {index} index answers
       */

      let auxOptions = [...options];
      let auxAnswersSelected = [...answersSelected];
      let auxAnswersForEncrypt = [...answers];

      let previousSelected = auxAnswersSelected[index];
      let actualSelected = event;

      if (nullButton || blankButton) {
        setNullButton(false);
        setBlankButton(false);
        auxAnswersForEncrypt = [...changeAllEncrypted(
          question.closed_options.length
        )];
      }
      auxAnswersSelected[index] = event;
      auxAnswersForEncrypt[index] = actualSelected.key + 1;

      if (previousSelected) {
        previousSelected.isDisabled = false;
      }
      actualSelected.isDisabled = true;

      if (isGrouped) {
        auxOptions.forEach((option) => {
          if (option.label === actualSelected.group) {
            option.options[actualSelected.position] = actualSelected;
          }
          if (previousSelected && option.label === previousSelected.group) {
            option.options[previousSelected.position] = previousSelected;
          }
        });
      } else {
        auxOptions[actualSelected.key] = actualSelected;
        if (previousSelected) {
          auxOptions[previousSelected.key] = previousSelected;
        }
      }
      setAnswersSelected(auxAnswersSelected);
      addAnswerCallback(auxAnswersForEncrypt, numQuestion);
      setOptions(auxOptions);
    },
    [
      answers,
      answersSelected,
      nullButton,
      blankButton,
      options,
      addAnswerCallback,
      isGrouped,
      changeAllEncrypted,
      question,
      numQuestion,
    ]
  );

  function resetSelectedOptions() {
    /**
     * Delete all options selected
     */

    let auxOptions = [...options];
    answersSelected.forEach((answerSelected) => {
      if (isGrouped) {
        auxOptions.forEach((option) => {
          if (option.label === answerSelected.group) {
            answerSelected.isDisabled = false;
            option.options[answerSelected.position] = answerSelected;
          }
        });
      } else {
        let newAnswer = auxOptions[answerSelected.key];
        newAnswer.isDisabled = false;
        auxOptions[answerSelected.key] = newAnswer;
      }
    });
    setAnswersSelected([]);
    addAnswerCallback([], numQuestion);
    setOptions(auxOptions);
  }

  return (
    <>
      <FormalOptions
        optionIndexes={[...Array(parseInt(question.max_answers)).keys()]}
        answersSelected={answersSelected}
        options={options}
        selectAnswers={selectAnswers}
      />
      {includeBlankNull && (
        <InformalOptions
          blankButton={blankButton}
          nullButton={nullButton}
          setNullVote={(event) => {
            setNullButton(event.target.checked);
            setBlankButton(false);
            if (event.target.checked) {
              resetSelectedOptions();
            }
            const newAns = changeAllEncrypted(numOfOptions + 1);
            addAnswerCallback(newAns, numQuestion)
          }}
          setBlankVote={(event) => {
            setBlankButton(event.target.checked);
            setNullButton(false);
            if (event.target.checked) {
              resetSelectedOptions();
            }
            const newAns = changeAllEncrypted(numOfOptions);
            addAnswerCallback(newAns, numQuestion);
          }}
        />
      )}
    </>
  );
}

export default MixnetSelection;
