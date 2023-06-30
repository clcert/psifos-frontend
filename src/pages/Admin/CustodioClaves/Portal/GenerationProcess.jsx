import StepButton from "../components/StepButton"

function Paragraph({ text }) {
    return (
        <p className="has-text-blue px-5 is-size-5 text-align-justify">
            { text }
        </p>
    )
}

function WelcomeMessage() {
    return (
        <>
            <p className="has-text-blue px-5 is-size-4">
                ¡Bienvenido(a)!
            </p>
            <Paragraph
                text="En este portal, puedes generar tu clave privada. Al generarla, se descargará un archivo de texto plano que contendrá la clave en su interior."
            />
            <Paragraph
                text="Una vez que haya finalizado la elección, deberás ingresar tu clave para generar la desencriptación parcial de los resultados. Por esta razón, es importante que guardes y respaldes el archivo hasta quela elección haya finalizado."
            />
        </>
    )
}

function Welcome({
    shortName, uuidTrustee,
}) {
    return (
        <div>
            <WelcomeMessage />
            <StepButton
                id="init-key-generator"
                text="Iniciar Proceso"
                linkTo={`/psifos/${shortName}/trustee/${uuidTrustee}/keygenerator`}
            />
            <p className="has-text-blue px-5 is-size-5 is-italic">
                Recuerda no compartir la clave con nadie.
            </p>
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