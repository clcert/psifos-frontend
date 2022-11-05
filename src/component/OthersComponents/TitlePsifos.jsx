function TitlePsifos(props) {
  return (
    <div className="has-text-centered" id="election-title-background-admin">
      <h1 className="title has-text-black is-size-4-mobile mb-0" id="election-title">
        {props.nameElection}
      </h1>

      <h3 id="election-subtitle" className="mb-0">{props.namePage}</h3>
    </div>
  );
}

export default TitlePsifos;
