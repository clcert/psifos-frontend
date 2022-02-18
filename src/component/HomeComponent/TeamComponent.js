function TeamComponent(props) {
  return (
    <div className="box has-text-centered team-box">
      <figure className="image">
        <img className="" src={props.image} />
      </figure>
      <p
        className="
    title
    is-size-5
    pt-4
    is-color-blue
    has-text-weight-bold
    "
      >
        {props.name}
      </p>
      <p className="subtitle is-color-blue">{props.rol}</p>
    </div>
  );
}

export default TeamComponent;
