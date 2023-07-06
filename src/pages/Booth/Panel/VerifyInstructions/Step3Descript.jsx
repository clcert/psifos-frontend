import CardInstruction from './CardInstruction'


function Description() {
    const installGo='https://go.dev/doc/install'
    return (
        <div className="verify-instruction-descript">
            <div>Para ejecutar el verificador debe ubicar el verificador y el resumen matemático en una misma carpeta. Luego, en la línea de comandos debe ejecutar la siguiente instrucción:</div>
            <code>{'./pyrios -bundle=<bundle_filename> -download=false -write=false -verify'}</code>
        </div>
    )
}

function StepDescript() {
    return (
        <CardInstruction
            title={'Paso 3: Verificar el resultado'}
            description={<Description/>}
        />
    )
}

export default StepDescript;