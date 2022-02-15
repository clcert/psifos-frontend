function Title(props) {
  return (
    <div className="has-text-centered mt-6 py-3" id="election-title-background">
      <h1 className="title has-text-black is-size-4-mobile" id="election-title">
        {props.namePage}
        <br />
        {props.nameElection}
      </h1>
    </div>
  );
}

export default Title;