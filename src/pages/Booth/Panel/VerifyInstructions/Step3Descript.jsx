import CardInstruction from './CardInstruction'

function SubSetp({children}) {
    return (
        <div style={{marginLeft: '20px'}}>
            {children}
        </div>
    )
}

function Description() {
    const installGo='https://go.dev/doc/install'
    return (
        <>
            <div>Para ejecutar el verificador debes seguir estos pasos:</div>
            <SubSetp>
                i. Pon el verificador y el resumen matemático en una misma carpeta.
            </SubSetp>
            <SubSetp>
                {'ii. Instala go (lo puedes hace ingresando '}
                <a href={installGo}>aquí</a>{').'}
            </SubSetp>
            <SubSetp>
                <div>iii. Ingresa a tu consola de comandos y, dentro de la carpeta, ejecuta los siguientes comandos:</div>
                <SubSetp><code>go build</code></SubSetp>
                <SubSetp><code>{'pyrios -bundle=<bundle_filename> -download=false -write=false -verify'}</code></SubSetp>
            </SubSetp>
        </>
    )
}

function StepDescript() {
    return (
        <CardInstruction
            title={'3. Verifica el resultado'}
            description={<Description/>}
        />
    )
}

export default StepDescript;