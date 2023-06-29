import CardInstruction from './CardInstruction'


function Description() {
    const installGo='https://go.dev/doc/install'
    return (
        <div className="verify-instruction-descript">
            <div>Para ejecutar el verificador debes ubicar el verificador y el resumen matemático (<code>bundle_filename</code>) en una misma carpeta. Luego, en la línea de comandos debes ejecutar la siguiente instrucción:</div>
            <code>{'./pyrios -bundle=<bundle_filename> -download=false -write=false -verify'}</code>
        </div>
    )
}

function StepDescript() {
    return (
        <CardInstruction
            title={'Paso 3: Verifica el resultado'}
            description={<Description/>}
        />
    )
}

export default StepDescript;