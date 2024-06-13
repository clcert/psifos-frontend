import AsyncSelect from "react-select/async";
import {
    disabledGray, mediumBlue, lightOrange,
} from "../../colors";

export default function AsyncSelector(props) {
    return (
        <AsyncSelect
            {...props}
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor:
                    props.isDisabled ? disabledGray : "white",
                }),
                groupHeading: (provided, state) => ({
                    ...provided,
                    backgroundColor: mediumBlue,
                    color: "white",
                    padding: "10px 10px",
                    display: "flex",
                    fontSize: "14px",
                }),
                option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? lightOrange : undefined,
                }),
            }}
        />
    )
}