import CardInstruction from './CardInstruction'

function Description({nombreEleccion='Elección Mascotas', linkResumen="https://www.google.com.ar/"}) {
    return (
        <>
            {
                'El resumen matemático de la elección es un archivo que contiene la síntesis de los cálculos matemáticos que se realizaron para obtener los resultados. Para decargar el resumen matemático correspondiente a la ' +
                nombreEleccion
                + ' ingresa '
            }
            <a href={linkResumen}>aquí</a>.
        </>
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