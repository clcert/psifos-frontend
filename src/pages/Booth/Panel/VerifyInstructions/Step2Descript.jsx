import CardInstruction from './CardInstruction'

function Description() {
    const linkVerificadorWindows= 'https://github.com/clcert/pyrios/releases/download/v1.1.0/pyrios_windows-amd64'
    const linkVerificadores = 'https://github.com/clcert/pyrios/releases/tag/v1.1.0'
    return (
        <>
            <div>El verificador es un programa que toma el resumen matemático correspondiente a una elección cualquiera y verifica que el resultado de la elección concuerde con los cálculos realizados.</div>
            <div>
                {
                    ' El verificador que utilices dependerá de las características de tu computador. Si tu computador es Windows-amd64, puedes descargar tu verificador haciendo click '
                }
                <a href={linkVerificadorWindows}>aquí</a>.
                {
                    ' Si tu computador tiene otras características, puedes encontrar el verificador correspondiente ingresando '
                }
                <a href={linkVerificadores}>aquí</a>.
            </div>
            
        </>
    )
}

function StepDescript() {
    return (
        <CardInstruction
            title={'2. Descarga el verificador'}
            description={<Description/>}
        />
    )
}

export default StepDescript;