import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import AsyncSelect from "react-select/async";

function MixnetSelection(props) {
  /** @state {array} array with options for react-select */
  const [options, setOptions] = useState([]);

  /** @state {array} array with answers selected */
  const [answersSelected, setAnswersSelected] = useState([]);

  /** @state {array} answers text */
  const [answersForEncrypt, setAnswersForEncrypt] = useState([]);

  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [whiteButton, setWhiteButton] = useState(false);

  /** @state {string} placeholder for input select */
  const [placeHolder, setPlaceHolder] = useState("Seleccione una opción");

  const changeAllEncrypted = useCallback(
    (number) => {
      let auxAnswersForEncrypt = [];
      for (let i = 0; i < props.answers.max_answers; i++) {
        auxAnswersForEncrypt.push(number);
      }
      setAnswersForEncrypt(auxAnswersForEncrypt);
      props.addAnswer(auxAnswersForEncrypt, props.index);
      return auxAnswersForEncrypt;
    },
    [answersForEncrypt]
  );

  useEffect(() => {
    console.log(answersForEncrypt);
  }, [answersForEncrypt]);

  useEffect(() => {
    const auxAnswersForEncrypt = changeAllEncrypted(0);
    let auxOptions = props.answers.closed_options.map((close_option, index) => {
      return {
        value: close_option,
        label: close_option,
        key: index,
      };
    });
    setOptions(auxOptions);
    props.addAnswer(auxAnswersForEncrypt, props.index);
  }, []);

  const filterOptions = useCallback(
    (inputValue) => {
      return options.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    },
    [options]
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

      if (nullButton || whiteButton) {
        setNullButton(false);
        setWhiteButton(false);
        changeAllEncrypted(0);
      }

      auxAnswersSelected[index] = event;
      auxAnswersForEncrypt[index] = actualSelected.key + 2;

      if (previousSelected) {
        previousSelected.isDisabled = false;
        auxOptions[previousSelected.key] = previousSelected;
      }
      actualSelected.isDisabled = true;
      auxOptions[actualSelected.key] = actualSelected;

      setAnswersSelected(auxAnswersSelected);
      setAnswersForEncrypt(auxAnswersForEncrypt);
      props.addAnswer(auxAnswersForEncrypt, props.index);
      setOptions(auxOptions);
      setPlaceHolder("Seleccione una opción");
    },
    [nullButton, whiteButton, options, answersSelected, answersForEncrypt]
  );

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

  function whiteVote(event) {
    setWhiteButton(event.target.checked);
    setNullButton(false);
    changeAllEncrypted(0);
    setPlaceHolder("Seleccione una opción");
    if (event.target.checked) {
      deleteOptions();
    }
  }

  function nullVote(event) {
    setNullButton(event.target.checked);
    setWhiteButton(false);
    changeAllEncrypted(1);
    setPlaceHolder("===========================/===========================");
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
              whiteVote(event);
            }}
          />
          <span className="is-size-5">Voto Blanco</span>
        </label>
      </div>
    </>
  );
}

export default MixnetSelection;
