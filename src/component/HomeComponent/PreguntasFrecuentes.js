function PreguntasFrecuentes(props) {
  return (
    <article className="message">
      <div className="message-header">
        <p>{props.pregunta}</p>
      </div>
      <div className="message-body">{props.respuesta}</div>
    </article>
  );
}

export default PreguntasFrecuentes;
