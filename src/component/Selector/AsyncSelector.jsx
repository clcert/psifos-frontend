import AsyncSelect from "react-select/async";

const colors = {
    disableGray: "#bbc1c6",
    lightBlue: "#0095d4",
    lightOrange: "#FFE8DF",
}

export default function AsyncSelector(props) {
    return (
        <AsyncSelect
            {...props}
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor:
                    props.isDisabled ? colors.disableGray : "white",
                }),
                groupHeading: (provided, state) => ({
                    ...provided,
                    backgroundColor: colors.lightBlue,
                    color: "white",
                    padding: "10px 10px",
                    display: "flex",
                    fontSize: "14px",
                }),
                option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? colors.lightOrange : undefined,
                }),
            }}
        />
    )
}