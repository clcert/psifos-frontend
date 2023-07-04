import DropFile from "../components/DropFile";
import BlueButton from "../../../../component/Buttons/BlueButton";

function CurrentProcess({name, icon}) {
  return (
    <div className="level-item">
      <div>
        <p className="pb-2 title has-text-blue">
          {name}{" "}
          {icon}
        </p>
      </div>
    </div>
  )
}

function ShowCurrentProccess({actualPhase, actualStep}) {
  return (
    (actualPhase === 2) && <CurrentProcess
        name="Sincronizando con los otros custodios de claves"
        icon={ <i
            id="step_0"
            className={actualStep >= 4
            ? "fa-solid fa-circle-check"
            : "fa-solid fa-spinner fa-spin"
            }
        />}
    />
  )
}


function BoxContent({title, stepExplication, stepNote, children}){
  return(
    <div
      id="process_step"
      className="has-text-blue text-align-justify"
    >
      <span className="is-size-4">{title}</span>
      <div className="is-size-6 mt-1">{stepExplication}</div>
      {children}
      <div className="is-size-8 mt-1">{stepNote}</div>
    </div>
  )
}

function ButtonsBlock({
  scndDisabled, scndHandleClick, scndText, scndId,
  actualStep, linkGoBack,
}) {
  return(
    <div className="is-flex is-justify-content-space-around mb-1">
      <BlueButton
        disabled={actualStep === 4}
        linkTo={linkGoBack}
        text={"Reiniciar el proceso"}
        id="download-key"
      />
      <BlueButton
        disabled={scndDisabled}
        handleClick={scndHandleClick}
        text={scndText}
        id={scndId}
      />
    </div>
  )
}

export function GenerationBox({
  actualStep, linkGoBack, disabledGeneration, handleGeneration,
}) {
  return (
    <div className="box px-5 py-4">
      <BoxContent
        title="Paso 1: Generar y descargar la clave"
        stepNote={<>
          <i className="fa-solid fa-bell"/>
          &nbsp;Una vez que descargue la clave, recuerde almacenarla en su
          computador y respaldarla, por ejemplo, en un pendrive.
        </>}
      />
      <ButtonsBlock
        scndDisabled={disabledGeneration}
        scndHandleClick={handleGeneration}
        scndText="Generar y descargar clave"
        scndId="download-key"
        actualStep={actualStep}
        linkGoBack={linkGoBack}
      />
    </div>
  )
}

export function VerificationBox({
  checkSk, linkGoBack, handleDownload, actualStep
}) {
  return (
    <div className="box px-5 py-4">
      <BoxContent
        title="Paso 2: Verificar la clave descargada"
        stepExplication="Una vez almacenado y respaldado el archivo recién descargado, debe subirlo para verificar su correctitud."
        stepNote={
          <div className="is-size-8 has-text-blue is-flex is-align-items-center mb-3">
            <i className="fa-solid fa-bell"/>
            &nbsp;Si no encuentra el archivo, puede descargarlo nuevamente.
          </div>
        }
      >
        <div className="py-4">
          <DropFile setText={checkSk}/>
        </div>
      </BoxContent>
      <ButtonsBlock
        scndHandleClick={handleDownload}
        scndText="Descargar nuevamente la clave"
        scndId="download-key"
        actualStep={actualStep}
        linkGoBack={linkGoBack}
      />
    </div>
  )
}

export function SyncupBox({
  actualStep, actualPhase, enabledButtonInit, textButtonInit, init_process, children,
}) {
  return (
    <div className="box px-5 py-4">
      <BoxContent
        title="Paso 3: Sincronizar claves"
        stepExplication="Su clave se debe sincronizar con la de los otros, espere unos momentos."
      >
        <ShowCurrentProccess
          actualPhase={actualPhase}
          actualStep={actualStep}
        />
        {actualStep !== 4 && (
          <button
            className="button mx-sm-2 mt-2"
            disabled={!enabledButtonInit}
            onClick={() => {
              init_process();
            }}
          >
            {textButtonInit}
          </button>
        )}
        {children}
      </BoxContent>
    </div>
  )
}