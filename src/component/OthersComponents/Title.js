function Title(props) {
  return (
    <div className="has-text-centered" id="election-title-background-admin">
      <h1 className="title has-text-black is-size-4-mobile mb-0" id="election-title">
        {props.namePage}
      </h1>

      <h3 id="election-subtitle">{props.nameElection}</h3>
    </div>
  );
}

export default Title;
