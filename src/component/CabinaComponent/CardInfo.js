function CardInfo(props) {
  return (
    <div class="card card-cabina">
      <header class="card-header">
        <div class="card-header-icon">
          <span class="icon step-icon">
            <img src={props.icon} />
          </span>
        </div>
        <p class="card-header-title is-size-5 pl-0">{props.title}</p>
      </header>
      <div class="card-image">
        <figure class="image step-figure">
          <img
            class="instruction-image"
            id="select-image"
            src={props.image}
            alt="Placeholder image"
          />
        </figure>
      </div>
      <div class="card-content card-cabina-content">
        <div class="content step-text card-cabina-text">
          {props.info}
        </div>
      </div>
    </div>
  );
}

export default CardInfo;
