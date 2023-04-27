import CardInstruction from './CardInstruction'

function Description({nombreEleccion='Elección Mascotas', linkResumen="https://www.google.com.ar/"}) {
    return (
        <div className="verify-instruction-descript">
            {
                'El resumen matemático de la elección es un archivo que contiene la síntesis de los cálculos matemáticos que se realizaron para obtener los resultados.'
            }
            <div className='is-flex is-justify-content-center button-container'>
                <a href={linkResumen} target="_blank" rel="noreferrer" className="href-button">
                    <button
                        className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
                        onClick={linkResumen}
                    >
                        <div>
                            Descargar resumen matemático de la elección
                        </div>
                    </button>
                </a>
            </div>
        </div>
    )
}

function StepDescript() {
    return (
        <CardInstruction
            title={'1. Descargar el resumen matemático'}
            description={<Description/>}
        />
    )
}

export default StepDescript;