import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import AsyncSelect from "react-select/async";

function MixnetSelection({ question, addAnswer, index }) {
  const defaultPlaceHolder = "Seleccione o escriba una opción 🔎";
  const isMixnetGroup = question.group_votes === "True";
  const otherOptionsName = "Otras Candidaturas";

  /** @state {array} array with options for react-select */
  const [options, setOptions] = useState([]);

  /** @state {array} array with answers selected */
  const [answersSelected, setAnswersSelected] = useState([]);

  /** @state {array} answers text */
  const [answersForEncrypt, setAnswersForEncrypt] = useState([]);

  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [blankButton, setBlankButton] = useState(false);

  /** @state {string} placeholder for input select */
  const [placeHolder, setPlaceHolder] = useState(defaultPlaceHolder);

  const includeBlankNull = question.include_blank_null === "True";

  const changeAllEncrypted = useCallback(
    (number) => {
      let auxAnswersForEncrypt = [];
      for (let i = 0; i < question.max_answers; i++) {
        auxAnswersForEncrypt.push(number);
      }
      setAnswersForEncrypt(auxAnswersForEncrypt);
      addAnswer(auxAnswersForEncrypt, index);
      return auxAnswersForEncrypt;
    },
    [addAnswer, index, question]
  );

  useEffect(() => {
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
      if (!isMixnetGroup) {
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
    addAnswer(auxAnswersForEncrypt, index);
  }, []);

  const moveToFinal = function (array, condition) {
    const indice = array.findIndex(condition);

    if (indice !== -1) {
      const elemento = array.splice(indice, 1)[0];
      array.push(elemento);
    }
  };

  const filterOptions = useCallback(
    (inputValue) => {
      if (!isMixnetGroup) {
        return options.filter((i) =>
          i.label
            .toLowerCase()
            .normalize("NFD")
            .includes(inputValue.toLowerCase().normalize("NFD"))
        );
      }
      const auxOptions = JSON.parse(JSON.stringify(options));
      auxOptions.forEach((option) => {
        option.options = option.options.filter((i) =>
          i.label
            .toLowerCase()
            .normalize("NFD")
            .includes(inputValue.toLowerCase().normalize("NFD"))
        );
      });
      return auxOptions;
    },
    [options, isMixnetGroup]
  );

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
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
      let auxAnswersForEncrypt = [...answersForEncrypt];

      let previousSelected = answersSelected[index];
      let actualSelected = event;

      if (nullButton || blankButton) {
        setNullButton(false);
        setBlankButton(false);
        auxAnswersForEncrypt = changeAllEncrypted(
          question.closed_options.length
        );
      }

      auxAnswersSelected[index] = event;
      auxAnswersForEncrypt[index] = actualSelected.key + 1;

      if (previousSelected) {
        previousSelected.isDisabled = false;
      }
      actualSelected.isDisabled = true;

      if (isMixnetGroup) {
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
      setAnswersForEncrypt(auxAnswersForEncrypt);
      addAnswer(auxAnswersForEncrypt, index);
      setOptions(auxOptions);
      setPlaceHolder(defaultPlaceHolder);
    },
    [
      nullButton,
      blankButton,
      options,
      answersSelected,
      answersForEncrypt,
      addAnswer,
      isMixnetGroup,
      changeAllEncrypted,
      question,
    ]
  );

  function deleteOptions() {
    /**
     * Delete all options selected
     */

    let auxOptions = [...options];
    let auxAnswersSelected = [...answersSelected];
    answersSelected.forEach((answerSelected) => {
      if (isMixnetGroup) {
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
    auxAnswersSelected = [];
    setAnswersSelected(auxAnswersSelected);
    setOptions(auxOptions);
  }

  function blankVote(event) {
    setBlankButton(event.target.checked);
    setNullButton(false);
    changeAllEncrypted(question.closed_options.length);
    setPlaceHolder(defaultPlaceHolder);
    if (event.target.checked) {
      deleteOptions();
    }
  }

  function nullVote(event) {
    setNullButton(event.target.checked);
    setBlankButton(false);
    changeAllEncrypted(question.closed_options.length + 1);
    if (event.target.checked) {
      deleteOptions();
    }
  }

  return (
    <>
      {[...Array(parseInt(question.max_answers)).keys()].map((index) => {
        return (
          <div key={index} className="has-text-black mb-4">
            <div className="mb-2">
              <span className="has-text-white">Opción {index + 1}:</span>
            </div>
            <div
              className={answersSelected.length < index ? "not-clickable" : ""}
            >
              <AsyncSelect
                isDisabled={answersSelected.length < index}
                name={`select-${index}`}
                defaultOptions={options}
                loadOptions={loadOptions}
                placeholder={placeHolder}
                value={answersSelected[index] ? answersSelected[index] : ""}
                onChange={(event) => {
                  selectAnswers(event, index);
                }}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor:
                      answersSelected.length < index ? "#bbc1c6" : "white",
                  }),
                  groupHeading: (provided, state) => ({
                    ...provided,
                    backgroundColor: "#0095d4",
                    color: "white",
                    padding: "10px 10px",
                    display: "flex",
                    fontSize: "14px",
                  }),
                  group: (provided, state) => {
                    if (state.label === "Candidaturas Oficiales") {
                      return {
                        ...provided,
                        backgroundColor: "#DFF6FF",
                      };
                    }
                  },
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#FFE8DF" : undefined,
                  }),
                }}
              />
            </div>
          </div>
        );
      })}

      {includeBlankNull && (
        <>
          {" "}
          <div>
            <label
              id=""
              className={
                "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2  " +
                (blankButton ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type="radio"
                id="white"
                name="vote_null"
                checked={blankButton}
                onChange={(event) => {
                  blankVote(event);
                }}
              />
              <span className="is-size-5">Voto Blanco</span>
            </label>
          </div>
          <div>
            <label
              id=""
              className={
                "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2  " +
                (nullButton ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type="radio"
                id="null"
                name="vote_null"
                checked={nullButton}
                onChange={(event) => {
                  nullVote(event);
                }}
              />
              <span className="is-size-5">Voto Nulo</span>
            </label>
          </div>
        </>
      )}
    </>
  );
}

export default MixnetSelection;
