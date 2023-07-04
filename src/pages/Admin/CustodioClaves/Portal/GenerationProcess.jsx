import { useState } from "react"
import StepButton from "../components/StepButton"
import AlertNotification from "../../component/AlertNotification"

function Paragraph({ text }) {
    return (
        <p className="has-text-blue px-5 is-size-5 text-align-justify">
            { text }
        </p>
    )
}

function WelcomeMessage({clickHandler}) {
    return (
        <>
            <p className="has-text-blue px-5 is-size-4">
                ¡Bienvenido(a)!
            </p>
            <Paragraph
                text="En este portal, puede obtener su clave privada. Al obtenerla, se descargará un archivo de texto plano que contendrá la clave en su interior."
            />
            <Paragraph
                text="Una vez que haya finalizado la elección, deberá ingresar su clave para generar la desencriptación parcial de los resultados. Por esta razón, es importante que guarde y respalde el archivo hasta que la elección haya finalizado."
            />
            <p className="has-text-blue px-5 text-align-justify">
                <label className="checkbox">
                    <input
                    onChange={(e) => clickHandler()}
                    type="checkbox"
                    className="mr-2"
                    />
                    <span className="has-hover-blue">
                        Conozco la importancia de mi rol y me comprometo a no compartir la clave privada con nadie.
                    </span>
                </label>
            </p>
        </>
    )
}

function Welcome({
    shortName, uuidTrustee,
}) {
    const [activeButton, setActiveButton] = useState(false)
    const [alertMessage, setAlertMessage] = useState(undefined)

    return (
        <div>
            {alertMessage && <AlertNotification
                alertMessage={alertMessage}
                onClear={() => setAlertMessage(undefined)}
            />}
            <WelcomeMessage
                clickHandler={() => setActiveButton(!activeButton)}
            />
            <StepButton
                id="init-key-generator"
                text="Iniciar Proceso"
                linkTo={activeButton && `/psifos/${shortName}/trustee/${uuidTrustee}/keygenerator`}                
                onClick={() => !activeButton && setAlertMessage(
                    'Para iniciar el proceso debe marcar el compromiso de almacenamiento de clave.'
                )}
            />
        </div>
    )
}

export default function GenerationProcess({
    shortName, uuidTrustee,
}) {
    return (
        <Welcome
            shortName={shortName}
            uuidTrustee={uuidTrustee}
        />
    )
}