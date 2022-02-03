import "../static/css/booth.css";


function ElectionCode(props) {
  return (
    <div className="container has-text-centered">
      <p>CÓDIGO DE LA ELECCIÓN</p>
      <div className="columns is-centered">
      <p className="is-family-monospace">{props.uuid}</p>
      </div>
    </div>
  );
}


export default ElectionCode;