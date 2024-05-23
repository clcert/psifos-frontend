import AsyncSelector from "../../../../../component/Selector/AsyncSelector";
import { matchingStrings } from "../../../../../utils";
import { normalizedLowerCase } from "../../../../../utils/utils";

// todo: la normalización debería ocurrir al crear options
const filterOptions = (inputValue, options, isGrouped) => {
    const inputNormalized = normalizedLowerCase(inputValue);
    if (!isGrouped) {
      return options.filter((option) => matchingStrings(
        inputNormalized, normalizedLowerCase(option.label)
      ));
    }
    
    const auxOptions = JSON.parse(JSON.stringify(options));
    auxOptions.forEach((option) => {
      option.options = option.options.filter((optionGroup) => {
        return options.filter((option) => matchingStrings(
          inputNormalized, normalizedLowerCase(optionGroup.label)
        ))
      });
    });
    return auxOptions;
  }

function FormalOption({
    index, currentAnswerSelected,
    options, selectAnswers, isGrouped, isDisabled,
  }) {
    const placeHolder = "Seleccione o escriba una opción 🔎";
  
    const loadOptions = (inputValue, callback) => {
      setTimeout(() => {
        callback(filterOptions(inputValue, options, isGrouped));
      }, 1000);
    };
  
    return (
      <div key={index} className="has-text-black mb-4">
        <div className="mb-2">
            <span className="has-text-white">Opción {index + 1}:</span>
        </div>
        <div
          className={isDisabled ? "not-clickable" : ""}
        >
          <AsyncSelector
            isDisabled={isDisabled}
            name={`mn-ans-selector-${index}`}
            defaultOptions={options}
            loadOptions={loadOptions}
            placeholder={placeHolder}
            value={currentAnswerSelected ? currentAnswerSelected : ""}
            onChange={(event) => {
              selectAnswers(event, index);
            }}
          />
        </div>
      </div>
    )
  }

export default function FormalOptions({
    optionIndexes, answersSelected,
    options, selectAnswers,
  
  }) {
    return(
      optionIndexes.map((index) => {
        return (
          <FormalOption
            index={index}
            isDisabled={answersSelected.length < index}
            currentAnswerSelected={answersSelected[index]}
            options={options}
            selectAnswers={selectAnswers}
          />
        );
      })
    )
  }