import CardInstruction from './CardInstruction'

function Description({linkResumen}) {
    return (
        <div className="verify-instruction-descript">
            {
                'El resumen matemático de la elección es un archivo que contiene la síntesis de los cálculos matemáticos que se realizaron para obtener los resultados.'
            }
            <div className='is-flex is-justify-content-center button-container'>
                <a href={linkResumen} target="_blank" rel="noreferrer" className="href-button">
                    <button
                        className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
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

function StepDescript({linkResumen}) {
    return (
        <CardInstruction
            title={'Paso 1: Descargar el resumen matemático'}
            description={<Description linkResumen={linkResumen}/>}
        />
    )
}

export default StepDescript;