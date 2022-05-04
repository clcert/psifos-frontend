function CardInfo(props) {
  return (
    <div className="card card-cabina">
      <header className="card-header">
        <div className="card-header-icon">
          <span className="icon step-icon">
            <img src={props.icon} alt=""/>
          </span>
        </div>
        <p className="card-header-title is-size-5 pl-0">{props.title}</p>
      </header>
      <div className="card-image">
        <figure className="image step-figure">
          <img
            className="instruction-image"
            id="select-image"
            src={props.image}
            alt="Placeholder"
          />
        </figure>
      </div>
      <div className="card-content card-cabina-content">
        <div className="content step-text card-cabina-text">
          {props.info}
        </div>
      </div>
    </div>
  );
}

export default CardInfo;
