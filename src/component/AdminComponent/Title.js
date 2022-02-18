function Title(props) {
  return (
    <div className="has-text-centered" id="election-title-background-admin">
      <h1 className="title has-text-black is-size-4-mobile" id="election-title">
        {props.namePage}
        <br />
        {props.nameElection}
      </h1>
    </div>
  );
}

export default Title;