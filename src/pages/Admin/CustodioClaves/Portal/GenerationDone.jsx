import StepButton from "../components/StepButton"

export default function GenerationDone({
    disabledButton2, disabledButton3,
    verifyLink, decryptLink,
}) {
    return (
        <>
            <div className="is-flex is-flex-direction-column is-align-items-center">
                {!disabledButton2 && disabledButton3 && (
                    <StepButton
                    id="verify-key"
                    text="Verificar Clave Privada"
                    linkTo={verifyLink}
                    />
                )}
                {!disabledButton2 && !disabledButton3 && (
                    <StepButton
                    text="Verificar Clave Privada"
                    linkTo={verifyLink}
                    />
                )}
                {!disabledButton3 && (
                    <StepButton
                    id="upload-key"
                    text="Enviar Desencriptación Parcial"
                    linkTo={decryptLink}
                    />
                )}
            </div>
        </>
    )
}