import { useState } from "react";
import { useEffect } from "react";
import AsyncSelect from "react-select/async";

function InputDropdown(props) {
  /** @state {array} array with options for react-select */
  const [options, setOptions] = useState([]);

  /** @state {array} array with answers selected */
  const [answersSelected, setAnswersSelected] = useState([]);

  /** @state {array} answers text */
  const [answersForEncryp, setAnswersForEncryp] = useState([]);

  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [whiteButton, setWhiteButton] = useState(false);

  /** @state {string} placeholder for input select */
  const [placeHolder, setPlaceHolder] = useState("Seleccione una opción");

  useEffect(() => {
    let auxOptions = props.answers.closed_options.map((close_option, index) => {
      return {
        value: close_option,
        label: close_option,
        key: index,
      };
    });
    setOptions(auxOptions);
  }, []);

  useEffect(() => {
    let auxAnswersForEncryp = [];
    answersSelected.forEach((answers) => {
      if (answers) {
        auxAnswersForEncryp.concat(answers.value);
      }
    });

    setAnswersForEncryp(auxAnswersForEncryp);
  }, [answersSelected]);

  const filterOptions = (inputValue) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  function selectAnswers(event, index) {
    /**
     * Select answers disabling the option
     * Eneabling previous option
     * @param {event} event of selector
     * @param {index} index answers
     */

    let auxOptions = [...options];
    let auxAnswersSelected = [...answersSelected];

    let previousSelected = answersSelected[index];
    let actualSelected = event;

    auxAnswersSelected[index] = event;

    if (previousSelected) {
      previousSelected.isDisabled = false;
      auxOptions[previousSelected.key] = previousSelected;
    }
    actualSelected.isDisabled = true;
    auxOptions[actualSelected.key] = actualSelected;

    setAnswersSelected(auxAnswersSelected);
    setOptions(auxOptions);
    setNullButton(false);
    setWhiteButton(false);
    setPlaceHolder("Seleccione una opción");
  }

  function deleteOptions() {
    /**
     * Delete all options selected
     */

    let auxOptions = [...options];
    let auxAnswersSelected = [...answersSelected];
    answersSelected.forEach((answer) => {
      if (answer) {
        let newAnswer = auxOptions[answer.key];
        newAnswer.isDisabled = false;
        auxOptions[answer.key] = newAnswer;
      }
    });
    auxAnswersSelected = [];
    setAnswersSelected(auxAnswersSelected);
    setOptions(auxOptions);
  }

  function nullVote(event) {
    if (event.target.checked) {
      deleteOptions();
    }
  }

  return (
    <>
      {[...Array(parseInt(props.answers.max_answers)).keys()].map((index) => {
        return (
          <div key={index} className="has-text-black mb-4">
            <div className="mb-2">
              <span className="has-text-white">Opción {index + 1}:</span>
            </div>

            <AsyncSelect
              defaultOptions={options}
              loadOptions={loadOptions}
              placeholder={placeHolder}
              value={answersSelected[index] ? answersSelected[index] : ""}
              onChange={(event) => {
                selectAnswers(event, index);
              }}
            />
          </div>
        );
      })}

      <div>
        <label id="" className={"radio question-answer pl-3 pr-2 py-2 "}>
          <input
            className="custom-answer"
            type="radio"
            id="null"
            name="vote_null"
            checked={nullButton}
            onChange={(event) => {
              setNullButton(event.target.checked);
              setWhiteButton(false);
              setPlaceHolder(
                "===========================/==========================="
              );
              nullVote(event);
            }}
          />
          <span className="is-size-5">Voto Nulo</span>
        </label>
      </div>
      <div>
        <label id="" className={"radio question-answer pl-3 pr-2 py-2 "}>
          <input
            className="custom-answer"
            type="radio"
            id="white"
            name="vote_null"
            checked={whiteButton}
            onChange={(event) => {
              setWhiteButton(event.target.checked);
              setNullButton(false);
              setPlaceHolder("Seleccione una opción");
              nullVote(event);
            }}
          />
          <span className="is-size-5">Voto Blanco</span>
        </label>
      </div>
    </>
  );
}

export default InputDropdown;
