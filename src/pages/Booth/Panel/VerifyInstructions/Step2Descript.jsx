import CardInstruction from './CardInstruction'

function Description() {
    const linkVerificadorWindows= 'https://github.com/clcert/pyrios/releases/download/v1.1.0/pyrios_windows-amd64'
    const linkVerificadores = 'https://github.com/clcert/pyrios/releases/tag/v1.1.0'
    return (
        <div className="verify-instruction-descript">
            <div>El verificador es un programa que toma el resumen matemático correspondiente a una elección cualquiera y verifica que el resultado de la elección concuerde con los cálculos realizados.</div>
            <div>
                {
                    ' El verificador que utilices dependerá de las características de tu computador. Si tu computador es Windows-amd64 puedes descargar tu verificador haciendo click en el botón, en el caso contrario puedes buscar y descargar el verificador correspondiente ingresando '
                }
                <a href={linkVerificadores}>aquí</a>.

                <div className='is-flex is-justify-content-center button-container'>
                    <a href={linkVerificadorWindows} target="_blank" rel="noreferrer" className="href-button">
                        <button 
                            className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
                            onClick={linkVerificadorWindows}
                        >   
                            <div>
                                Descargar el verificador para Windows-amd64
                            </div>
                        </button>
                    </a>
                </div>
            </div>
            
        </div>
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